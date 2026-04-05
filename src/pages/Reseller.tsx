import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, Server, Shield, Zap, Globe, HeadphonesIcon } from "lucide-react";

const Reseller = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const resellerPlans = [
    {
      name: "Starter Reseller",
      price: "KSh 1,500",
      period: "/month",
      description: "Perfect for starting your hosting business",
      features: [
        "30 GB SSD Storage",
        "30 DirectAdmin Accounts", 
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel"
      ],
      popular: false
    },
    {
      name: "Basic Reseller", 
      price: "KSh 2,500",
      period: "/month",
      description: "Great for growing hosting businesses",
      features: [
        "60 GB SSD Storage",
        "60 DirectAdmin Accounts",
        "Unlimited MySQL Databases", 
        "Unlimited Bandwidth",
        "Unlimited Email Addresses",
        "WHMCS Licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel"
      ],
      popular: true
    },
    {
      name: "Premium Reseller",
      price: "KSh 4,000", 
      period: "/month",
      description: "Premium reseller hosting with enhanced features",
      features: [
        "80 GB SSD Storage",
        "80 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth", 
        "Unlimited Email Addresses",
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel"
      ],
      popular: false
    },
    {
      name: "Platinum Reseller",
      price: "KSh 6,000",
      period: "/month", 
      description: "Top-tier reseller hosting with maximum resources",
      features: [
        "150 GB SSD Storage",
        "100 DirectAdmin Accounts",
        "Unlimited MySQL Databases",
        "Unlimited Bandwidth",
        "Unlimited Email Addresses", 
        "WHMCS licence at 20 USD Monthly",
        "30 Day Money-back",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
        "DirectAdmin Control Panel"
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Fully White-labeled",
      description: "Build your own hosting brand with our white-label solution. Your customers will only see your brand."
    },
    {
      icon: Server,
      title: "API Integration", 
      description: "Full API access for seamless integration with your existing systems and custom applications."
    },
    {
      icon: Shield,
      title: "Easy account management",
      description: "Pre-configured control panels make it easy to manage all your customer accounts from one place."
    },
    {
      icon: Zap,
      title: "Tier 3 ISO Accreditation",
      description: "Our servers are hosted at Tier 3 ISO accredited data centers with maximum uptime and best security."
    }
  ];

  const discountTiers = [
    { percentage: "5%", spending: "Under KSh 10,000" },
    { percentage: "10%", spending: "KSh 10,000 - KSh 50,000" },
    { percentage: "15%", spending: "KSh 50,000 - KSh 100,000" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm opacity-90">Rated 5.0 out of 5 by customers (156 reviews)</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                VPS reseller hosting
              </h1>
              <p className="text-xl mb-4 opacity-90">
                Start your own VPS hosting business today
              </p>
              
              <p className="text-lg mb-8 opacity-80">
                It's time to get your VPS reseller business going and earn! 
                Get everything you need to start your VPS business or to 
                jumpstart your new up to 30% on all prices. Get instant 
                today for just KSh 2,243 per month!
              </p>
              
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg">
                Get Started Today
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src="/placeholder.svg" 
                alt="Happy customer using VPS hosting" 
                className="rounded-lg shadow-2xl w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Our Reseller Hosting?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build and grow your hosting business with confidence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Reseller Plan</h2>
            <p className="text-muted-foreground">Start small and scale as your business grows</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resellerPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Capitalize on our VPS reseller discount</h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Pay up to 15% less than other users do on South African servers and keep the profit. The more you pay for what you use and cash 
              out with a monthly discount at the beginning of the following month.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-center">VPS RESELLER DISCOUNT</h3>
                <div className="space-y-4">
                  {discountTiers.map((tier, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-white/20 last:border-0">
                      <span className="font-medium">{tier.percentage}</span>
                      <span className="opacity-90">{tier.spending}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Become a VPS reseller today!</h2>
            <p className="text-lg opacity-90 mb-8">Sign up now</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Users, title: "Fully white-labeled", desc: "Build your own hosting brand with complete white-label solution for your own product." },
              { icon: Server, title: "API Integration", desc: "Full API access for seamless integration with your existing systems and custom applications." },
              { icon: Shield, title: "Easy account management", desc: "Pre-configured control panels make it easy to manage all your customer accounts from one place." },
              { icon: Zap, title: "Tier 3 ISO Accreditation", desc: "Our servers are hosted at Tier 3 ISO accredited data centers with maximum uptime and best security." }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reseller;