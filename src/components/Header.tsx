import { Activity, RefreshCw, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdate?: string;
}

const Header = ({
  onRefresh,
  isLoading,
  lastUpdate
}: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-card-foreground">​QuakePH</h1>
            <p className="text-xs text-muted-foreground">
              PHIVOLCS Earthquake Monitor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Last update: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;