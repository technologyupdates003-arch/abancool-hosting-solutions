import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ChevronDown, 
  ChevronRight, 
  MessageSquare, 
  Megaphone, 
  BookOpen, 
  Download,
  Activity,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ticketService } from "@/services/ticketService";

const OpenTicket = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentTicketsExpanded, setRecentTicketsExpanded] = useState(true);
  const [supportExpanded, setSupportExpanded] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock recent tickets data
  const recentTickets = [
    {
      id: "5107040",
      subject: "Node.js backend dep...",
      status: "Closed",
      timeAgo: "1 month ago"
    }
  ];

  const departments = [
    {
      id: "sales",
      name: "Sales",
      description: "",
      color: "text-blue-600"
    },
    {
      id: "support",
      name: "Support",
      description: "",
      color: "text-blue-600"
    },
    {
      id: "abuse",
      name: "Abuse",
      description: "Report network abuse here",
      color: "text-blue-600"
    },
    {
      id: "billing",
      name: "Billing",
      description: "Billing related questions report here",
      color: "text-blue-600"
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

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDepartment) {
      toast({
        title: "Department Required",
        description: "Please select a department for your ticket.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a subject and message for your ticket.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const ticket = await ticketService.createTicket({
        department: selectedDepartment,
        subject: subject.trim(),
        message: message.trim(),
        priority
      });
      
      toast({
        title: "Ticket Created Successfully!",
        description: `Your support ticket #${ticket.ticket_number} has been created. We'll respond as soon as possible.`,
      });
      
      // Reset form
      setSelectedDepartment("");
      setSubject("");
      setMessage("");
      setPriority("medium");
      
      // Redirect to tickets page
      navigate("/tickets");
      
    } catch (error: any) {
      toast({
        title: "Failed to Create Ticket",
        description: error.message || "Failed to create support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
            {/* Recent Tickets Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setRecentTicketsExpanded(!recentTicketsExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {recentTicketsExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Your Recent Tickets</span>
                </button>
              </div>

              {recentTicketsExpanded && (
                <div className="border-t border-gray-200 p-4">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="mb-3 last:mb-0">
                      <div className="text-sm font-medium text-gray-900">#{ticket.id}</div>
                      <div className="text-sm text-gray-600">{ticket.subject}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{ticket.status}</span>
                        <span className="text-xs text-gray-500">{ticket.timeAgo}</span>
                      </div>
                    </div>
                  ))}
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
                  <button
                    onClick={() => navigate("/tickets")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    My Support Tickets
                  </button>
                  <button
                    onClick={() => navigate("/announcements")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                  >
                    <Megaphone className="w-4 h-4" />
                    Announcements
                  </button>
                  <button
                    onClick={() => navigate("/knowledgebase")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Knowledgebase
                  </button>
                  <button
                    onClick={() => navigate("/downloads")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Downloads
                  </button>
                  <button
                    onClick={() => navigate("/network-status")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    Network Status
                  </button>
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Open Ticket
                  </div>
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
                <span>Support Tickets</span>
                <span className="mx-2">/</span>
                <span className="text-green-600">Submit Ticket</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-6">Open Ticket</h1>

              <p className="text-gray-600 mb-8">
                If you can't find a solution to your problems in our knowledgebase, you can submit a ticket by selecting the appropriate department below.
              </p>

              {/* Department Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Department</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        selectedDepartment === dept.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`font-medium ${dept.color} mb-1`}>
                        {dept.name}
                      </div>
                      {dept.description && (
                        <div className="text-sm text-gray-600">
                          {dept.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticket Form */}
              {selectedDepartment && (
                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please provide detailed information about your issue..."
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? "Submitting..." : "Submit Ticket"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/tickets")}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OpenTicket;