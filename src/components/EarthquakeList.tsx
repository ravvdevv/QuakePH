import { Earthquake, getMagnitudeClass } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowDown } from "lucide-react";

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  title: string;
  onEarthquakeClick?: (earthquake: Earthquake) => void;
}

const EarthquakeList = ({ earthquakes, title, onEarthquakeClick }: EarthquakeListProps) => {
  const getMagnitudeBadgeVariant = (magnitude: number) => {
    if (magnitude >= 5) return "destructive";
    if (magnitude >= 3) return "default";
    return "secondary";
  };

  // Minimum touch target height for mobile accessibility
  const MIN_TOUCH_HEIGHT = "80px";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-3 md:px-4 py-2.5 md:py-3 sticky top-0 z-10">
        <h3 className="font-semibold text-sm md:text-base text-card-foreground">{title}</h3>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar">
        {earthquakes.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground p-4">
            <p className="text-sm">No earthquakes found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {earthquakes.map((eq, index) => (
              <div
                key={`${eq.date}-${eq.time}-${index}`}
                className="cursor-pointer p-3 md:p-4 transition-colors hover:bg-muted/50 active:bg-muted md:min-h-0"
                style={{ minHeight: `min(${MIN_TOUCH_HEIGHT}, 100%)` }}
                onClick={() => onEarthquakeClick?.(eq)}
              >
                <div className="flex items-start justify-between gap-2 md:gap-3">
                  <div className="flex-1 space-y-1.5 md:space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getMagnitudeBadgeVariant(eq.magnitudeNumeric)} className="text-xs">
                        M {eq.magnitudeNumeric}
                      </Badge>
                      <span className="text-[11px] md:text-xs text-muted-foreground">
                        {eq.depth} deep
                      </span>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-card-foreground line-clamp-2">
                      {eq.location}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-[10px] md:text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{eq.date} {eq.time}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{eq.latitude}, {eq.longitude}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EarthquakeList;
