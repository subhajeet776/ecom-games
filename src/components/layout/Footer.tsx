import Link from "next/link";
import { Mail } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "All Games", href: "/games" },
    { label: "Admin Console (Demo)", href: "/admin" },
  ],
  Support: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact Us", href: "/contact" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};


export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-neon text-xl">🎮</span>
              <div>
                <span className="text-white font-extrabold text-base leading-none block">
                  STEAM GAMES
                </span>
                <span className="text-neon font-extrabold text-base leading-none">
                  99
                </span>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Premium games at unbeatable prices. Your trusted destination for
              the best gaming deals.
            </p>
            <div className="flex items-center gap-2 text-muted text-sm">
              <Mail size={14} />
              <span>support@steamgames99.com</span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-foreground font-semibold text-sm mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted text-sm hover:text-neon transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} Steam Games 99. All rights reserved.
            This is a demo project.
          </p>
          <p className="text-muted/60 text-xs">
            Not affiliated with Valve Corporation or Steam.
          </p>
        </div>
      </div>
    </footer>
  );
}
