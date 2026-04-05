import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { billingService } from "@/services/billingService";

const MyQuotes = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creditExpanded, setCreditExpanded] = useState(true);
  const [stageExpanded, setStageExpanded] = useState(true);
  const [billingExpanded, setBillingExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("quote");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();
  const { profile } = useProfile(user);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [quoteStats, setQuoteStats] = useState({
    draft: 0,
    sent: 0,
    accepted: 0,
    declined: 0,
    expired: 0
  });

  // Mock quotes data - in a real app, this would come from your backend
  const mockQuotes: any[] = []; // Empty array to show "No Records Found"

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
    const loadQuotes = async () => {
      if (!user?.id) return;
      
      setLoadingQuotes(true);
      try {
        const [quotesData, statsData] = await Promise.all([
          billingService.getUserQuotes(user.id),
          billingService.getQuoteStats(user.id)
        ]);
        
        setQuotes(quotesData);
        setQuoteStats(statsData);
      } catch (error) {
        console.error('Failed to load quotes:', error);
        setQuotes([]);
      } finally {
        setLoadingQuotes(false);
      }
    };

    if (user?.id) {
      loadQuotes();
    }
  }, [user?.id]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2">
                      <span>+</span>
                      Add Funds
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setStageExpanded(!stageExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {stageExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Stage</span>
                </button>
              </div>

              {stageExpanded && (
                <div className="border-t border-gray-200 p-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="stage" className="text-blue-500" defaultChecked />
                    <span className="text-sm text-gray-700">Delivered</span>
                    <span className="text-sm text-gray-500 ml-auto">0</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="stage" className="text-blue-500" />
                    <span className="text-sm text-gray-700">Accepted</span>
                    <span className="text-sm text-gray-500 ml-auto">0</span>
                  </label>
                </div>
              )}
            </div>

            {/* Billing Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setBillingExpanded(!billingExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {billingExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Billing</span>
                </button>
              </div>

              {billingExpanded && (
                <nav className="border-t border-gray-200">
                  <button
                    onClick={() => navigate("/my-invoices")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    My Invoices
                  </button>
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium">
                    My Quotes
                  </div>
                  <button
                    onClick={() => navigate("/add-funds")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Add Funds
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
                <span className="text-green-600">My Quotes</span>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Quotes</h1>
                <p className="text-gray-500 text-sm">Quotes we have generated for you</p>
              </div>

              {/* Search and Results Info */}
              <div className="bg-gray-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                <span className="text-sm">Showing 0 to {quotes.length} of {quotes.length} entries</span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 text-sm text-gray-900 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quotes Table */}
              <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("quote")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Quote #
                          {sortField === "quote" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("subject")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Subject
                          {sortField === "subject" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("dateCreated")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Date Created
                          {sortField === "dateCreated" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("validUntil")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Valid Until
                          {sortField === "validUntil" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("stage")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Stage
                          {sortField === "stage" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          {loadingQuotes ? "Loading..." : "No Records Found"}
                        </td>
                      </tr>
                    ) : (
                      quotes.map((quote) => (
                        <tr key={quote.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {quote.quote_number}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {quote.subject}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(quote.valid_until).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              quote.status === 'declined' ? 'bg-red-100 text-red-800' :
                              quote.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {quote.status}
                            </span>
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
                  <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span>entries</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <button
                    disabled
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

      <Footer />
    </div>
  );
};

export default MyQuotes;