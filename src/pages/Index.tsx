import Navbar from "@/components/Navbar";
import DomainSearchBar from "@/components/DomainSearchBar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import HostingPlans from "@/components/HostingPlans";
import PromiseSection from "@/components/PromiseSection";
import ReviewsSection from "@/components/ReviewsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <DomainSearchBar />
      <HeroSection />
      <TrustSection />
      <HostingPlans />
      <PromiseSection />
      <ReviewsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
