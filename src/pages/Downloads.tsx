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

const Downloads = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportExpanded, setSupportExpanded] = useState(true);
  const navigate = useNavigate();

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
          <aside className="w-64 shrink-0">
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
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Downloads
                  </div>
                  <button
                    onClick={() => navigate("/network-status")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    Network Status
                  </button>
                  <button
                    onClick={() => navigate("/open-ticket")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Open Ticket
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
                <span className="text-green-600">Downloads</span>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Downloads</h1>
                <p className="text-gray-500 text-sm">Manuals, programs, and other files</p>
              </div>

              {/* No Downloads Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <Download className="w-16 h-16 text-blue-400 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">No Downloads to Display</h3>
                <p className="text-blue-700 text-sm">
                  There are currently no files available for download. Check back later or contact support if you need specific files.
                </p>
              </div>

              {/* Information Section */}
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What You Can Find Here</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Software & Tools</h4>
                    <ul className="space-y-1">
                      <li>• Control panel software</li>
                      <li>• FTP clients and tools</li>
                      <li>• Website builders</li>
                      <li>• Email clients</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Documentation</h4>
                    <ul className="space-y-1">
                      <li>• Setup guides and manuals</li>
                      <li>• Configuration templates</li>
                      <li>• API documentation</li>
                      <li>• Best practices guides</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-blue-500 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Need Specific Files?</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      If you're looking for specific software, documentation, or files that aren't listed here, 
                      please contact our support team and we'll be happy to help.
                    </p>
                    <button
                      onClick={() => navigate("/open-ticket")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Contact Support
                    </button>
                  </div>
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

export default Downloads;