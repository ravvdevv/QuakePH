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

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <h3 className="font-semibold text-card-foreground">{title}</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {earthquakes.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No earthquakes found
          </div>
        ) : (
          <div className="divide-y divide-border">
            {earthquakes.map((eq, index) => (
              <div
                key={`${eq.date}-${eq.time}-${index}`}
                className="cursor-pointer p-4 transition-colors hover:bg-muted/50"
                onClick={() => onEarthquakeClick?.(eq)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getMagnitudeBadgeVariant(eq.magnitudeNumeric)}>
                        M {eq.magnitudeNumeric}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {eq.depth} deep
                      </span>
                    </div>
                    <p className="text-sm font-medium text-card-foreground line-clamp-2">
                      {eq.location}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {eq.date} {eq.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {eq.latitude}, {eq.longitude}
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
