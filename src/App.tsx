import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { automationService } from "@/services/automationService";
import Index from "./pages/Index.tsx";
import Store from "./pages/Store.tsx";
import Checkout from "./pages/Checkout.tsx";
import TestCheckout from "./pages/TestCheckout.tsx";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import ClientArea from "./pages/ClientArea.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import MyServices from "./pages/MyServices.tsx";
import ServiceManage from "./pages/ServiceManage.tsx";
import UserManagement from "./pages/UserManagement.tsx";
import Contacts from "./pages/Contacts.tsx";
import AccountSecurity from "./pages/AccountSecurity.tsx";
import EmailHistory from "./pages/EmailHistory.tsx";
import ManageClientPIN from "./pages/ManageClientPIN.tsx";
import BillingSupport from "./pages/BillingSupport.tsx";
import Affiliates from "./pages/Affiliates.tsx";
import MyQuotes from "./pages/MyQuotes.tsx";
import UnblockIP from "./pages/UnblockIP.tsx";
import AddFunds from "./pages/AddFunds.tsx";
import MyInvoices from "./pages/MyInvoices.tsx";
import Tickets from "./pages/Tickets.tsx";
import Downloads from "./pages/Downloads.tsx";
import OpenTicket from "./pages/OpenTicket.tsx";
import ResolutionCenter from "./pages/ResolutionCenter.tsx";
import NetworkStatus from "./pages/NetworkStatus.tsx";
import Reseller from "./pages/Reseller.tsx";
import News from "./pages/News.tsx";
import Support from "./pages/Support.tsx";
import PHPSupport from "./pages/PHPSupport.tsx";
import NotFound from "./pages/NotFound.tsx";
import AccountDetails from "./pages/AccountDetails.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";
import SecuritySettings from "./pages/SecuritySettings.tsx";
import YourProfile from "./pages/YourProfile.tsx";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize automation service when app starts
    // Process emails and DirectAdmin tasks every 30 seconds
    automationService.startAutomationProcessor(30000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/store" element={<Store />} />
              <Route path="/store/:category" element={<Store />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/test-checkout" element={<TestCheckout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/client-area" element={<ClientArea />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/my-services" element={<MyServices />} />
              <Route path="/service/:serviceId/manage" element={<ServiceManage />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/account-security" element={<AccountSecurity />} />
              <Route path="/email-history" element={<EmailHistory />} />
              <Route path="/manage-client-pin" element={<ManageClientPIN />} />
              <Route path="/billing-support" element={<BillingSupport />} />
              <Route path="/affiliates" element={<Affiliates />} />
              <Route path="/my-quotes" element={<MyQuotes />} />
              <Route path="/unblock-ip" element={<UnblockIP />} />
              <Route path="/add-funds" element={<AddFunds />} />
              <Route path="/my-invoices" element={<MyInvoices />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/open-ticket" element={<OpenTicket />} />
              <Route path="/resolution-center" element={<ResolutionCenter />} />
              <Route path="/network-status" element={<NetworkStatus />} />
              <Route path="/reseller" element={<Reseller />} />
              <Route path="/news" element={<News />} />
              <Route path="/support" element={<Support />} />
              <Route path="/php-support" element={<PHPSupport />} />
              <Route path="/account-details" element={<AccountDetails />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/security-settings" element={<SecuritySettings />} />
              <Route path="/your-profile" element={<YourProfile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
