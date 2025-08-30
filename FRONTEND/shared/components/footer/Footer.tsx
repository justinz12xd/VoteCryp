import { Shield, Github, MessageCircle } from "lucide-react";

const quickLinks = [
  {
    label: "GitHub",
    href: "https://github.com/justinz12xd/VoteCryp",
    Icon: Github,
    external: true,
  },
  {
    label: "Contact",
    href: "tel:+593997399441",
    Icon: MessageCircle,
    external: false,
  },
];

export function Footer() {
  return (
    <footer
      className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8 pb-6 bg-card"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Logo y descripción */}
        <div className="flex items-center gap-3">
          <Shield className="h-10 w-10 text-primary" aria-hidden="true" />
          <div>
            <h5 className="font-bold text-lg">VoteCrypt</h5>
            <p className="text-sm text-muted-foreground">
              Open-source project for private and verifiable voting
            </p>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div className="flex flex-col sm:flex-row gap-4 mr-10">
          <div className="flex flex-col gap-2">
            <h6 className="font-semibold text-sm">Quick Links</h6>

            {quickLinks.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex gap-2 items-center"
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {label}
                <Icon
                  className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} VoteCrypt. All rights reserved for us
      </div>
    </footer>
  );
}
