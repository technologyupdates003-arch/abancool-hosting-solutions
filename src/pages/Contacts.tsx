import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contacts = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountExpanded, setAccountExpanded] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile(user);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    emailAddress: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    stateRegion: "",
    zipCode: "",
    country: "South Africa",
  });

  const [emailPreferences, setEmailPreferences] = useState({
    generalEmails: false,
    invoiceEmails: false,
    supportEmails: false,
    productEmails: false,
    domainEmails: false,
  });

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
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        companyName: profile.company || "",
        emailAddress: profile.email || "",
        phoneNumber: profile.phone || "",
        address1: profile.address || "",
        address2: "",
        city: profile.city || "",
        stateRegion: profile.state || "",
        zipCode: profile.postcode || "",
        country: profile.country || "South Africa",
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailPreferenceChange = (field: string, checked: boolean) => {
    setEmailPreferences(prev => ({ ...prev, [field]: checked }));
  };

  const handleSaveChanges = async () => {
    setSaveLoading(true);
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.companyName,
        phone: formData.phoneNumber,
        address: formData.address1,
        city: formData.city,
        state: formData.stateRegion,
        postcode: formData.zipCode,
        country: formData.country,
        email_preferences: emailPreferences,
      });

      toast({
        title: "Changes saved successfully!",
        description: "Your contact information has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to save changes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
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
          <aside className="w-64 shrink-0">
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
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium">
                    Contacts
                  </div>
                  <button className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                    Account Security
                  </button>
                  <button className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                    Email History
                  </button>
                  <button className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
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
                <span>Account Details</span>
                <span className="mx-2">/</span>
                <span className="text-green-600">Contacts</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-6">Contacts</h1>

              {/* Contact Selection */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Choose Contact</span>
                    <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white">
                      <option>Add New Contact</option>
                    </select>
                  </div>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm">
                    Go
                  </button>
                </div>
              </div>

              {/* Contact Form */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex">
                      <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiBmaWxsPSIjRkY5OTAwIi8+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSI0LjY2NjY3IiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHk9IjkuMzMzMzQiIHdpZHRoPSIyMCIgaGVpZ2h0PSI0LjY2NjY3IiBmaWxsPSIjMDA3QTVFIi8+Cjwvc3ZnPgo=" alt="South Africa" className="w-5 h-3" />
                        <span className="ml-2 text-sm text-gray-600">+27</span>
                      </div>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        placeholder="71 123 4567"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address 1</label>
                    <input
                      type="text"
                      value={formData.address1}
                      onChange={(e) => handleInputChange("address1", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address 2</label>
                    <input
                      type="text"
                      value={formData.address2}
                      onChange={(e) => handleInputChange("address2", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Region</label>
                    <input
                      type="text"
                      value={formData.stateRegion}
                      onChange={(e) => handleInputChange("stateRegion", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="South Africa">South Africa</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Uganda">Uganda</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email Preferences */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Email Preferences</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={emailPreferences.generalEmails}
                      onChange={(e) => handleEmailPreferenceChange("generalEmails", e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">General Emails</span>
                      <span className="text-sm text-gray-500"> - General Announcements & Password Reminders</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={emailPreferences.invoiceEmails}
                      onChange={(e) => handleEmailPreferenceChange("invoiceEmails", e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Invoice Emails</span>
                      <span className="text-sm text-gray-500"> - Invoices & Billing Reminders</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={emailPreferences.supportEmails}
                      onChange={(e) => handleEmailPreferenceChange("supportEmails", e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Support Emails</span>
                      <span className="text-sm text-gray-500"> - Receive a copy of all support ticket communications created by the parent account holder</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={emailPreferences.productEmails}
                      onChange={(e) => handleEmailPreferenceChange("productEmails", e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Product Emails</span>
                      <span className="text-sm text-gray-500"> - Order Details, Welcome Emails, etc...</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={emailPreferences.domainEmails}
                      onChange={(e) => handleEmailPreferenceChange("domainEmails", e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Domain Emails</span>
                      <span className="text-sm text-gray-500"> - Renewal Notices, Registration Confirmations, etc...</span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveChanges}
                    disabled={saveLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {saveLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm font-medium">
                    Cancel
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

export default Contacts;