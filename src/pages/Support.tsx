import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  HeadphonesIcon, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  FileText,
  Users,
  Shield,
  Server,
  Globe,
  Zap,
  Database,
  Code
} from "lucide-react";
import { supportService, SupportCategory, ContactMessage } from "@/services/supportService";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const [categories, setCategories] = useState<SupportCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState<ContactMessage>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSupportCategories();
  }, []);

  const loadSupportCategories = async () => {
    try {
      const data = await supportService.getSupportCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading support categories:', error);
      toast({
        title: "Error",
        description: "Failed to load support categories.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await supportService.submitContactMessage(contactForm);
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully. We'll get back to you soon!",
      });
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error submitting contact message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      server: Server,
      shield: Shield,
      users: Users,
      code: Code,
      globe: Globe,
      zap: Zap,
      database: Database
    };
    return icons[iconName] || Server;
  };

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      action: "Start Chat",
      primary: true
    },
    {
      icon: Mail,
      title: "Email Support", 
      description: "Send us a detailed message about your issue",
      availability: "Response within 2 hours",
      action: "Send Email"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our technical experts",
      availability: "Mon-Fri 8AM-6PM EAT",
      action: "Call Now"
    },
    {
      icon: FileText,
      title: "Submit Ticket",
      description: "Create a support ticket for complex issues",
      availability: "Tracked & Prioritized",
      action: "Open Ticket"
    }
  ];

  const supportCategories = categories.map(category => ({
    icon: getIconComponent(category.icon),
    title: category.name,
    description: category.description,
    topics: [] // We'll populate this from KB articles later
  }));

  const trustLogos = [
    { name: "Google", logo: "🔍" },
    { name: "Trustpilot", logo: "⭐" },
    { name: "HelpCenter", logo: "🎧" }
  ];

  const resources = [
    {
      icon: FileText,
      title: "SMS Log",
      description: "View the hosting and resourcing from businesses in Africa"
    },
    {
      icon: Globe,
      title: "Move to ABANCOOL",
      description: "Learn how website and hosting migration to ABANCOOL"
    },
    {
      icon: FileText,
      title: "Blog",
      description: "News, updates and hosting insights from ABANCOOL"
    },
    {
      icon: HeadphonesIcon,
      title: "How to Pay",
      description: "View payment options and billing information"
    },
    {
      icon: Code,
      title: "PHP Extended Support",
      description: "Extended security support for legacy PHP versions"
    },
    {
      icon: Users,
      title: "Sell Your Hosting Business",
      description: "A trusted way to transition your hosting business"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Scope of support
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Our top-notch support staff will look after your business info in a matter 
                of minutes. Great customer service is what makes us different from the 
                competition. We only hire the best of the best to make sure your business 
                runs smoothly. We only hire the best of the best to make sure your business 
                runs smoothly.
              </p>
              
              <div className="flex items-center gap-6 mb-8">
                {trustLogos.map((trust, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-2xl">{trust.logo}</span>
                    <span className="font-medium">{trust.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/placeholder.svg" 
                alt="Customer support representative" 
                className="rounded-lg shadow-xl w-full max-w-md mx-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <HeadphonesIcon className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold">24/7 Support</p>
                    <p className="text-sm text-muted-foreground">Always here to help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get Help Now</h2>
            <p className="text-muted-foreground">Choose the support channel that works best for you</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className={`text-center hover:shadow-lg transition-shadow ${channel.primary ? 'border-primary shadow-md' : ''}`}>
                <CardContent className="p-6">
                  <channel.icon className={`w-12 h-12 mx-auto mb-4 ${channel.primary ? 'text-primary' : 'text-muted-foreground'}`} />
                  <h3 className="font-semibold text-foreground mb-2">{channel.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{channel.description}</p>
                  <Badge variant="secondary" className="mb-4">{channel.availability}</Badge>
                  <Button 
                    className="w-full" 
                    variant={channel.primary ? "default" : "outline"}
                  >
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What can we help you with?</h2>
            <p className="text-muted-foreground">Browse our support categories to find the help you need</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <category.icon className="w-8 h-8 text-primary" />
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  {category.topics && category.topics.length > 0 && (
                    <div className="space-y-2">
                      {category.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Resources</h2>
            <p className="text-muted-foreground">Additional resources to help you succeed</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <resource.icon className="w-8 h-8 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Form */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Quick Contact</CardTitle>
                <p className="text-muted-foreground">Send us a message and we'll get back to you soon</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleContactSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input 
                        placeholder="Your name" 
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input 
                        placeholder="your@email.com" 
                        type="email" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input 
                      placeholder="How can we help you?" 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea 
                      placeholder="Describe your issue or question..." 
                      rows={4} 
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;