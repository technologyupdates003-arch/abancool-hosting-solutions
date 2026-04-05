import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { billingService } from "@/services/billingService";

const MyInvoices = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creditExpanded, setCreditExpanded] = useState(true);
  const [invoicesDueExpanded, setInvoicesDueExpanded] = useState(true);
  const [statusExpanded, setStatusExpanded] = useState(true);
  const [billingExpanded, setBillingExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("invoice");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();
  const { profile } = useProfile(user);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [invoiceStats, setInvoiceStats] = useState({
    paid: 0,
    unpaid: 0,
    cancelled: 0,
    refunded: 0
  });

  // Mock invoice data - in a real app, this would come from your backend
  const mockInvoices = [
    {
      id: "1460027",
      invoiceDate: "Sunday, November 2nd, 2025",
      dueDate: "Sunday, November 2nd, 2025",
      total: "KSh 4,620.00",
      status: "Paid"
    }
  ];

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
    const loadInvoices = async () => {
      if (!user?.id) return;
      
      setLoadingInvoices(true);
      try {
        const [invoicesData, statsData] = await Promise.all([
          billingService.getUserInvoices(user.id),
          billingService.getInvoiceStats(user.id)
        ]);
        
        setInvoices(invoicesData);
        setInvoiceStats(statsData);
      } catch (error) {
        console.error('Failed to load invoices:', error);
        // Fallback to mock data for demo
        setInvoices([
          {
            id: "1460027",
            invoice_number: "1460027",
            created_at: "2025-11-02T01:43:00Z",
            due_date: "2025-11-02T01:43:00Z",
            amount: 4620.00,
            currency: "KSh",
            status: "paid"
          }
        ]);
        setInvoiceStats({ paid: 1, unpaid: 0, cancelled: 0, refunded: 0 });
      } finally {
        setLoadingInvoices(false);
      }
    };

    if (user?.id) {
      loadInvoices();
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

            {/* Invoices Due Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setInvoicesDueExpanded(!invoicesDueExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {invoicesDueExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">0 Invoices Due</span>
                </button>
              </div>

              {invoicesDueExpanded && (
                <div className="border-t border-gray-200 p-4">
                  <p className="text-sm text-gray-600">
                    You have no unpaid invoices at this time.
                  </p>
                </div>
              )}
            </div>

            {/* Status Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setStatusExpanded(!statusExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {statusExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Status</span>
                </button>
              </div>

              {statusExpanded && (
                <div className="border-t border-gray-200 p-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="status" className="text-blue-500" defaultChecked />
                    <span className="text-sm text-gray-700">Paid</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="status" className="text-blue-500" />
                    <span className="text-sm text-gray-700">Unpaid</span>
                    <span className="text-sm text-gray-500 ml-auto">0</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="status" className="text-blue-500" />
                    <span className="text-sm text-gray-700">Cancelled</span>
                    <span className="text-sm text-gray-500 ml-auto">0</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="status" className="text-blue-500" />
                    <span className="text-sm text-gray-700">Refunded</span>
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
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium">
                    My Invoices
                  </div>
                  <button
                    onClick={() => navigate("/my-quotes")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    My Quotes
                  </button>
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
                <span className="text-green-600">My Invoices</span>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
                <p className="text-gray-500 text-sm">Your invoice history with us</p>
              </div>

              {/* Search and Results Info */}
              <div className="bg-gray-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                <span className="text-sm">Showing 1 to {invoices.length} of {invoices.length} entries</span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 text-sm text-gray-900 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Invoices Table */}
              <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("invoice")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Invoice #
                          {sortField === "invoice" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("invoiceDate")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Invoice Date
                          {sortField === "invoiceDate" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("dueDate")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Due Date
                          {sortField === "dueDate" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("total")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Total
                          {sortField === "total" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Status
                          {sortField === "status" && (
                            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingInvoices ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : invoices.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No invoices found
                        </td>
                      </tr>
                    ) : (
                      invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {invoice.invoice_number || invoice.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(invoice.created_at).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(invoice.due_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {invoice.currency} {invoice.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'unpaid' ? 'bg-red-100 text-red-800' :
                              invoice.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {invoice.status}
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
                  
                  <button className="px-3 py-1 text-sm bg-gray-800 text-white rounded">
                    1
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

export default MyInvoices;