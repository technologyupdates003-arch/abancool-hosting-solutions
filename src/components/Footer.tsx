import { Link } from "react-router-dom";

const footerLinks = {
  Products: [
    { name: "Web Hosting", href: "/store?category=Web Hosting" },
    { name: "WordPress Hosting", href: "/store?category=WordPress Hosting" },
    { name: "VPS Hosting", href: "/store?category=Cloud Servers Linux" },
    { name: "Reseller Hosting", href: "/reseller" },
    { name: "Domain Registration", href: "/store?category=Domains" },
    { name: "Email Hosting", href: "/store?category=Professional Email" },
    { name: "SSL Certificates", href: "/store?category=SSL Certificates" }
  ],
  Company: [
    { name: "About Us", href: "/news" },
    { name: "News & Updates", href: "/news" },
    { name: "PHP Support", href: "/php-support" },
    { name: "Contact", href: "/support" },
    { name: "Partners", href: "/affiliates" }
  ],
  Support: [
    { name: "Help Center", href: "/support" },
    { name: "Open a Ticket", href: "/open-ticket" },
    { name: "Network Status", href: "/network-status" },
    { name: "Resolution Center", href: "/resolution-center" },
    { name: "Billing Support", href: "/billing-support" }
  ],
  Legal: [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Acceptable Use Policy", href: "#" },
    { name: "SLA", href: "#" }
  ],
};

const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
                AC
              </div>
              <span className="text-lg font-bold tracking-tight text-footer-foreground">
                Aban<span className="text-primary">Cool</span>
              </span>
            </div>
            <p className="text-sm text-footer-foreground/60 leading-relaxed">
              Your trusted partner in hosting. Fast, reliable, and always here for you.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-footer-foreground/90 mb-4 text-sm">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-sm text-footer-foreground/50 hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-footer-foreground/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-footer-foreground/40">
            © {new Date().getFullYear()} AbanCool Technology. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-footer-foreground/40 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-footer-foreground/40 hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-xs text-footer-foreground/40 hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
