import { Shield, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8 pb-6" role="contentinfo" aria-label="Footer">
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-2">
            <h6 className="font-semibold text-sm">Quick Links</h6>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </div>

          {/* Redes sociales */}
          <div className="flex flex-col gap-2">
            <h6 className="font-semibold text-sm">Social</h6>
            <div className="flex gap-3">
              <a href="https://github.com/justinz12xd/VoteCryp" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="mailto:contact@votecrypt.com" aria-label="Email">
                <Mail className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} VoteCrypt. All rights reserved for us
      </div>
    </footer>
  );
}
