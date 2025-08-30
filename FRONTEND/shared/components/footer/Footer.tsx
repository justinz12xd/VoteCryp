import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="mt-10 border-t py-6 bg-card"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary ml-6" aria-hidden="true" />
            <div>
              <h5 className="font-bold">VoteCrypt</h5>
              <p className="text-sm text-muted-foreground">
                Open-source project for private and verifiable voting
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
