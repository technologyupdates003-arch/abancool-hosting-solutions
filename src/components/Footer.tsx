const footerLinks = {
  Products: ["Web Hosting", "WordPress Hosting", "VPS Hosting", "Dedicated Servers", "Domain Registration", "Email Hosting", "SSL Certificates"],
  Company: ["About Us", "Blog", "Careers", "Contact", "Partners"],
  Support: ["Help Center", "Knowledge Base", "Open a Ticket", "Network Status", "How to Pay"],
  Legal: ["Terms of Service", "Privacy Policy", "Acceptable Use Policy", "SLA"],
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
                  <li key={link}>
                    <a href="#" className="text-sm text-footer-foreground/50 hover:text-primary transition-colors">
                      {link}
                    </a>
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
