import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight, MessageSquare, Megaphone, BookOpen } from "lucide-react";
import { ticketService } from "@/services/ticketService";

const Tickets = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewExpanded, setViewExpanded] = useState(true);
  const [supportExpanded, setSupportExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketStats, setTicketStats] = useState({
    open: 0,
    answered: 0,
    customer_reply: 0,
    closed: 0
  });

  // Mock ticket data - in a real app, this would come from your backend
  const mockTickets = [
    {
      id: "5107040",
      department: "Support",
      subject: "Node.js backend deployment issue",
      status: "Closed",
      lastUpdated: "Monday, February 23rd, 2026 (16:20)"
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
    const loadTickets = async () => {
      if (!user?.id) return;
      
      setLoadingTickets(true);
      try {
        const [ticketsData, statsData] = await Promise.all([
          ticketService.getUserTickets(user.id),
          ticketService.getTicketStats(user.id)
        ]);
        
        setTickets(ticketsData);
        setTicketStats(statsData);
      } catch (error) {
        console.error('Failed to load tickets:', error);
        // Fallback to mock data for demo
        setTickets([
          {
            id: "5107040",
            ticket_number: "5107040",
            department: "Support",
            subject: "Node.js backend deployment issue",
            status: "closed",
            updated_at: "2026-02-23T16:20:00Z"
          }
        ]);
        setTicketStats({ open: 0, answered: 0, customer_reply: 0, closed: 1 });
      } finally {
        setLoadingTickets(false);
      }
    };

    if (user?.id) {
      loadTickets();
    }
  }, [user?.id]);

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

      {/* Service Notice */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            </div>
            We are aware of a potentially service impacting issue.
          </div>
          <button className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-1">
            Learn more
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="container py-6 flex-1">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 space-y-4">
            {/* View Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setViewExpanded(!viewExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {viewExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">View</span>
                </button>
              </div>

              {viewExpanded && (
                <div className="border-t border-gray-200 p-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="view" className="text-blue-500" />
                    <span className="text-sm text-gray-700">Open</span>
                    <span className="text-sm text-gray-500 ml-auto">0</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="view" className="text-blue-500" />
                    <span className="text-sm text-gray-700">Answered</span>
                    <span className="text-sm text-gray-500 ml-auto">0</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="view" className="text-blue-500" />
                    <span className="text-sm text-gray-700">Customer-Reply</span>
                    <span className="text-sm text-gray-500 ml-auto">0</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="view" className="text-blue-500" defaultChecked />
                    <span className="text-sm text-gray-700">Closed</span>
                  </label>
                </div>
              )}
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setSupportExpanded(!supportExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {supportExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Support</span>
                </button>
              </div>

              {supportExpanded && (
                <nav className="border-t border-gray-200">
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    My Support Tickets
                  </div>
                  <button
                    onClick={() => navigate("/announcements")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                  >
                    <Megaphone className="w-4 h-4" />
                    Announcements
                  </button>
                  <button
                    onClick={() => navigate("/knowledgebase")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Knowledgebase
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
                <span className="text-green-600">Support Tickets</span>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Support Tickets</h1>
                <p className="text-gray-500 text-sm">Your ticket history</p>
              </div>

              {/* Search and Results Info */}
              <div className="bg-gray-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                <span className="text-sm">Showing 1 to {tickets.length} of {tickets.length} entries</span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 text-sm text-gray-900 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tickets Table */}
              <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingTickets ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : tickets.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          No tickets found
                        </td>
                      </tr>
                    ) : (
                      tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {ticket.department}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div>
                              <div className="font-medium text-gray-900">#{ticket.ticket_number || ticket.id}</div>
                              <div className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                {ticket.subject}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'resolved' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(ticket.updated_at).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} ({new Date(ticket.updated_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })})
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

              {/* Create New Ticket Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/open-ticket")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Open New Support Ticket
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tickets;