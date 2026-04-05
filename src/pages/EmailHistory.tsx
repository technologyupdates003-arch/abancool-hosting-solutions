import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight, ChevronUp, Mail, Filter, Search } from "lucide-react";
import { emailService } from "@/services/emailService";

const EmailHistory = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creditExpanded, setCreditExpanded] = useState(true);
  const [accountExpanded, setAccountExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("sent_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [emailTypeFilter, setEmailTypeFilter] = useState<string>("");
  const navigate = useNavigate();
  const { profile } = useProfile(user);
  const [emails, setEmails] = useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const emailsPerPage = 10;
  const totalEmails = emails.length;
  const totalPages = Math.ceil(totalEmails / emailsPerPage);

  // Filter emails based on search term and type
  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !emailTypeFilter || email.email_type === emailTypeFilter;
    return matchesSearch && matchesType;
  });

  // Paginate filtered emails
  const startIndex = (currentPage - 1) * emailsPerPage;
  const paginatedEmails = filteredEmails.slice(startIndex, startIndex + emailsPerPage);

  // Email type counts
  const emailTypeCounts = emails.reduce((acc, email) => {
    acc[email.email_type] = (acc[email.email_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/login");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const loadEmails = async () => {
      if (!user?.id) return;
      
      setLoadingEmails(true);
      try {
        // Try to get real email history first, fallback to mock data
        let emailHistory;
        try {
          emailHistory = await emailService.getUserEmailHistory(user.id, emailTypeFilter);
        } catch (error) {
          console.log('Using mock data for email history');
          emailHistory = await emailService.getMockEmailHistory(user.id);
        }
        
        // Sort emails
        const sortedEmails = emailHistory.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];
          
          if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        setEmails(sortedEmails);
      } catch (error) {
        console.error('Failed to load email history:', error);
        setEmails([]);
      } finally {
        setLoadingEmails(false);
      }
    };

    if (user?.id) {
      loadEmails();
    }
  }, [user?.id, emailTypeFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getEmailTypeIcon = (type: string) => {
    switch (type) {
      case 'support': return '🎫';
      case 'invoice': return '📧';
      case 'domain': return '🌐';
      case 'account': return '👤';
      case 'general': return '📬';
      default: return '📧';
    }
  };

  const getEmailTypeBadge = (type: string) => {
    const colors = {
      support: 'bg-blue-100 text-blue-800',
      invoice: 'bg-green-100 text-green-800',
      domain: 'bg-purple-100 text-purple-800',
      account: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800'
    };
    
    return colors[type as keyof typeof colors] || colors.general;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container py-6 flex-1">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 space-y-4">
            {/* Available Credit Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setCreditExpanded(!creditExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {creditExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Available Credit</span>
                </button>
              </div>

              {creditExpanded && (
                <div className="border-t border-gray-200 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      KSh {profile?.credit_balance?.toFixed(2) || '0.00'}
                    </div>
                    <button 
                      onClick={() => navigate("/add-funds")}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <span>+</span>
                      Add Funds
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email Types Filter */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filter by Type</span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setEmailTypeFilter("")}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      !emailTypeFilter ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Emails ({totalEmails})
                  </button>
                  {Object.entries(emailTypeCounts).map(([type, count]) => (
                    <button
                      key={type}
                      onClick={() => setEmailTypeFilter(type)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                        emailTypeFilter === type ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{getEmailTypeIcon(type)}</span>
                      <span className="capitalize">{type}</span>
                      <span className="ml-auto">({count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setAccountExpanded(!accountExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {accountExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Account</span>
                </button>
              </div>

              {accountExpanded && (
                <nav className="border-t border-gray-200">
                  <button
                    onClick={() => navigate("/client-area")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    Account Details
                  </button>
                  <button
                    onClick={() => navigate("/user-management")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => navigate("/contacts")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    Contacts
                  </button>
                  <button
                    onClick={() => navigate("/account-security")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    Account Security
                  </button>
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email History
                  </div>
                  <button 
                    onClick={() => navigate("/manage-client-pin")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Manage Your Client PIN
                  </button>
                </nav>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-500 mb-6">
                <span>Portal Home</span>
                <span className="mx-2">/</span>
                <span>Client Area</span>
                <span className="mx-2">/</span>
                <span className="text-green-600">My Emails</span>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  My Emails
                </h1>
                <p className="text-gray-500 text-sm">Your email history and communications with us</p>
              </div>

              {/* Search and Results Info */}
              <div className="bg-gray-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                <span className="text-sm">
                  Showing {startIndex + 1} to {Math.min(startIndex + emailsPerPage, filteredEmails.length)} of {filteredEmails.length} entries
                  {emailTypeFilter && ` (filtered by ${emailTypeFilter})`}
                </span>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 text-sm text-gray-900 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email Table */}
              <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("sent_at")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Date Sent
                          {sortField === "sent_at" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("subject")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Message Subject
                          {sortField === "subject" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingEmails ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            Loading emails...
                          </div>
                        </td>
                      </tr>
                    ) : paginatedEmails.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          {searchTerm || emailTypeFilter ? 'No emails match your search criteria.' : 'No emails found.'}
                        </td>
                      </tr>
                    ) : (
                      paginatedEmails.map((email) => (
                        <tr key={email.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <div>
                              <div className="font-medium">
                                {new Date(email.sent_at).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-gray-500">
                                ({new Date(email.sent_at).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })})
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <div className="max-w-md">
                              <div className="font-medium truncate">{email.subject}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmailTypeBadge(email.email_type)}`}>
                              <span className="mr-1">{getEmailTypeIcon(email.email_type)}</span>
                              {email.email_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              onClick={() => setSelectedEmail(email)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              View Message
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Show</span>
                  <select 
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    onChange={(e) => {
                      // Handle entries per page change
                      setCurrentPage(1);
                    }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span>entries</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="px-3 py-1 text-sm bg-gray-800 text-white rounded">
                    {currentPage}
                  </span>
                  
                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Email Details</h2>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject:</label>
                  <p className="text-gray-900">{selectedEmail.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type:</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${getEmailTypeBadge(selectedEmail.email_type)}`}>
                    <span className="mr-1">{getEmailTypeIcon(selectedEmail.email_type)}</span>
                    {selectedEmail.email_type}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date Sent:</label>
                  <p className="text-gray-900">
                    {new Date(selectedEmail.sent_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Message:</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      This is a placeholder for the email content. In a real implementation, 
                      you would store and display the actual email content here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EmailHistory;