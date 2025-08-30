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
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-around  gap-6">
        {/* Logo and description */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Shield className="h-10 w-10 text-primary" aria-hidden="true" />
          <div className="text-center md:text-left">
            <h5 className="font-bold text-lg">VoteCrypt</h5>
            <p className="text-sm text-muted-foreground">
              Open-source project for private and verifiable voting
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full md:w-auto">
          <div className="flex flex-col gap-2 items-center sm:items-start">
            <h6 className="font-semibold text-lg text-center sm:text-left">
              Quick Links
            </h6>

            {quickLinks.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                className="group text-md text-muted-foreground flex gap-2 items-center transition-colors hover:text-primary"
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {label}
                <Icon
                  className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} VoteCrypt. All rights reserved.
      </div>
    </footer>
  );
}
