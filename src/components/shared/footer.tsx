import Link from "next/link";
import { SITE_NAME, NAV_LINKS, WHATSAPP_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary text-secondary-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-heading font-bold">{SITE_NAME}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Fresh organic produce grown with care in Maharashtra. Farm to table,
            naturally.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground transition-colors"
              >
                WhatsApp: +91XXXXXXXXXX
              </a>
            </li>
            <li>Email: hello@bholefarms.com</li>
            <li>Bhole Farms, Maharashtra</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-muted/20 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
