import { Activity, RefreshCw } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <SidebarTrigger className="md:hidden flex-shrink-0" />
          <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary flex-shrink-0">
            <Activity className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-card-foreground truncate">QuakePH</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground truncate">
              PHIVOLCS Monitor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {lastUpdate && (
            <span className="hidden lg:inline text-xs text-muted-foreground">
              Last update: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isLoading}
            className="min-h-[44px] md:min-h-0"
          >
            <RefreshCw className={`h-4 w-4 md:mr-2 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;