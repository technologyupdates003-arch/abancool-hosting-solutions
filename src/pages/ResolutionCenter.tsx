import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, Shield, Clock } from "lucide-react";
import { supportService, AbuseReport } from "@/services/supportService";
import { useToast } from "@/hooks/use-toast";

const ResolutionCenter = () => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<AbuseReport>({
    reporter_email: "",
    report_type: "",
    domain_url: "",
    description: "",
    evidence: "",
    contact_info: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await supportService.submitAbuseReport(formData);
      toast({
        title: "Report Submitted",
        description: "Your abuse report has been submitted successfully. We'll investigate and get back to you soon.",
      });
      setFormData({
        reporter_email: "",
        report_type: "",
        domain_url: "",
        description: "",
        evidence: "",
        contact_info: ""
      });
    } catch (error) {
      console.error('Error submitting abuse report:', error);
      toast({
        title: "Error",
        description: "Failed to submit abuse report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Resolution Center</h1>
            <p className="text-muted-foreground">Report abuse, resolve disputes, and get help with your services</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Abuse Reports Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Abuse Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Report Type</label>
                        <Select value={formData.report_type} onValueChange={(value) => setFormData({...formData, report_type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spam">Spam</SelectItem>
                            <SelectItem value="phishing">Phishing</SelectItem>
                            <SelectItem value="malware">Malware</SelectItem>
                            <SelectItem value="copyright">Copyright Infringement</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Domain/URL</label>
                        <Input 
                          placeholder="example.com or full URL"
                          value={formData.domain_url}
                          onChange={(e) => setFormData({...formData, domain_url: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                      <Textarea 
                        placeholder="Describe the abuse in detail..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Evidence/URLs</label>
                      <Textarea 
                        placeholder="Provide any evidence, URLs, or additional information..."
                        rows={3}
                        value={formData.evidence}
                        onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Your Contact Information</label>
                      <Input 
                        placeholder="Email or phone number for follow-up"
                        value={formData.reporter_email}
                        onChange={(e) => setFormData({...formData, reporter_email: e.target.value})}
                        type="email"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Abuse Report"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/open-ticket">
                      <FileText className="w-4 h-4 mr-2" />
                      Open Support Ticket
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/billing-support">
                      <Shield className="w-4 h-4 mr-2" />
                      Billing Support
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/network-status">
                      <Clock className="w-4 h-4 mr-2" />
                      Network Status
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Spam Report #1234</p>
                        <p className="text-muted-foreground">Under Review</p>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Phishing Report #1233</p>
                        <p className="text-green-600">Resolved</p>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help & Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Help & Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <a href="#" className="block text-primary hover:underline">Abuse Reporting Guidelines</a>
                  <a href="#" className="block text-primary hover:underline">What Constitutes Abuse?</a>
                  <a href="#" className="block text-primary hover:underline">Response Time Expectations</a>
                  <a href="#" className="block text-primary hover:underline">Contact Support</a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResolutionCenter;