import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Code, Zap, Clock, Users, Server, AlertTriangle } from "lucide-react";

const PHPSupport = () => {
  const phpVersions = [
    { version: "PHP 5.4", status: "Extended Support", color: "bg-orange-100 text-orange-800" },
    { version: "PHP 5.5", status: "Extended Support", color: "bg-orange-100 text-orange-800" },
    { version: "PHP 5.6", status: "Extended Support", color: "bg-orange-100 text-orange-800" },
    { version: "PHP 7.0", status: "Extended Support", color: "bg-orange-100 text-orange-800" },
    { version: "PHP 7.1", status: "Extended Support", color: "bg-orange-100 text-orange-800" },
    { version: "PHP 7.2", status: "Extended Support", color: "bg-orange-100 text-orange-800" },
    { version: "PHP 7.3", status: "Extended Support", color: "bg-orange-100 text-orange-800" },
    { version: "PHP 7.4", status: "Extended Support", color: "bg-orange-100 text-orange-800" },
    { version: "PHP 8.0", status: "Extended Support", color: "bg-orange-100 text-orange-800" },
    { version: "PHP 8.1", status: "Active Support", color: "bg-green-100 text-green-800" },
    { version: "PHP 8.2", status: "Active Support", color: "bg-green-100 text-green-800" },
    { version: "PHP 8.3", status: "Active Support", color: "bg-green-100 text-green-800" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Support and security for older PHP versions that require PHP 5.4 to 8.0",
      description: "Comprehensive security patches and updates for legacy PHP versions"
    },
    {
      icon: Code,
      title: "Continuous security updates guaranteed",
      description: "Regular security patches to keep your applications protected"
    },
    {
      icon: Zap,
      title: "Uninterrupted operation of your website",
      description: "Maintain business continuity without forced upgrades"
    },
    {
      icon: Clock,
      title: "Flexibility in updating",
      description: "Update at your own pace when your application is ready"
    }
  ];

  const supportTypes = [
    {
      title: "Extended Support for Older PHP Versions",
      description: "Keep your systems running smoothly with security patches and performance optimizations for PHP versions that are no longer officially supported.",
      features: [
        "Security patches for PHP 5.4 - 8.0",
        "Performance optimizations", 
        "Compatibility maintenance",
        "24/7 technical support"
      ]
    },
    {
      title: "Freedom Without Forced Upgrades",
      description: "Run on the PHP version that works for your business without being forced to upgrade before you're ready.",
      features: [
        "No forced migrations",
        "Maintain existing workflows",
        "Gradual transition planning",
        "Legacy application support"
      ]
    },
    {
      title: "Enhanced Security Safeguards",
      description: "Our proactive security approach safeguards your applications with the latest security patches and monitoring.",
      features: [
        "Proactive security monitoring",
        "Real-time threat detection", 
        "Custom security patches",
        "Vulnerability assessments"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                PHP Extended Support:
                <br />
                <span className="text-primary">We Support Older PHP Versions</span>
              </h1>
              
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8">
                  Get Extended Support
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">PHP</h3>
                    <p className="text-muted-foreground">Extended Support</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Security Updates</span>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Performance Patches</span>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">24/7 Support</span>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHP Versions Support */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Supported PHP Versions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide extended support for PHP versions from 5.4 to 8.0, ensuring your legacy applications 
              continue to run securely and efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {phpVersions.map((php, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Code className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{php.version}</h3>
                  <Badge className={php.color}>{php.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Types */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive PHP Support</h2>
            <p className="text-muted-foreground">Three pillars of our PHP extended support program</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {supportTypes.map((type, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{type.description}</p>
                  <ul className="space-y-3">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Extended Support */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Why Choose PHP Extended Support?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Security First</h3>
                    <p className="text-muted-foreground">
                      Keep your applications secure with regular security patches and vulnerability fixes, 
                      even for older PHP versions that are no longer officially supported.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">No Rush to Upgrade</h3>
                    <p className="text-muted-foreground">
                      Upgrade on your timeline. Our extended support gives you the flexibility to plan 
                      and execute upgrades when it makes business sense for your organization.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Expert Support Team</h3>
                    <p className="text-muted-foreground">
                      Our PHP experts are available 24/7 to help with any issues, performance optimization, 
                      and migration planning when you're ready to upgrade.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8">
                <div className="text-center mb-6">
                  <Server className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Ready to Get Started?</h3>
                  <p className="text-muted-foreground">
                    Join thousands of businesses that trust ABANCOOL for their PHP hosting needs
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Setup Time</span>
                    <span className="text-primary font-semibold">&lt; 24 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Support Response</span>
                    <span className="text-primary font-semibold">&lt; 2 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Uptime Guarantee</span>
                    <span className="text-primary font-semibold">99.9%</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6" size="lg">
                  Contact Sales Team
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Let Outdated PHP Hold You Back</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Get the security and support you need for your legacy PHP applications while you plan your upgrade strategy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Get Extended Support Now
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-primary">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PHPSupport;