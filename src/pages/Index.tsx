import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, TrendingUp, TrendingDown, Waves, MapPin } from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/Header";
import EarthquakeMap from "@/components/EarthquakeMap";
import StatsCard from "@/components/StatsCard";
import EarthquakeList from "@/components/EarthquakeList";
import FilterPanel from "@/components/FilterPanel";
import {
  fetchEarthquakes,
  fetchEarthquakeStats,
  fetchRecentEarthquakes,
  fetchTopEarthquakes,
  filterEarthquakes,
  Earthquake,
} from "@/lib/api";

const Index = () => {
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [filteredEarthquakes, setFilteredEarthquakes] = useState<Earthquake[] | null>(null);

  const {
    data: earthquakesData,
    isLoading: isLoadingEarthquakes,
    refetch: refetchEarthquakes,
    error: earthquakesError,
  } = useQuery({
    queryKey: ["earthquakes"],
    queryFn: () => fetchEarthquakes(50),
    refetchInterval: 60000, // Refresh every minute
  });

  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchEarthquakeStats,
    refetchInterval: 60000,
  });

  const {
    data: recentData,
    refetch: refetchRecent,
  } = useQuery({
    queryKey: ["recent"],
    queryFn: () => fetchRecentEarthquakes(10),
    refetchInterval: 60000,
  });

  const {
    data: topData,
    refetch: refetchTop,
  } = useQuery({
    queryKey: ["top"],
    queryFn: () => fetchTopEarthquakes(5),
    refetchInterval: 60000,
  });

  const handleRefresh = useCallback(() => {
    Promise.all([refetchEarthquakes(), refetchStats(), refetchRecent(), refetchTop()])
      .then(() => toast.success("Data refreshed successfully"))
      .catch(() => toast.error("Failed to refresh data"));
  }, [refetchEarthquakes, refetchStats, refetchRecent, refetchTop]);

  const handleFilter = async (minMag?: number, maxMag?: number, location?: string) => {
    try {
      const response = await filterEarthquakes(minMag, maxMag, location);
      setFilteredEarthquakes(response.data);
      toast.success(`Found ${response.data.length} earthquakes`);
    } catch {
      toast.error("Failed to apply filters");
    }
  };

  const handleClearFilter = () => {
    setFilteredEarthquakes(null);
  };

  const handleEarthquakeClick = (earthquake: Earthquake) => {
    setSelectedEarthquake(earthquake);
    toast.info(`M${earthquake.magnitudeNumeric} - ${earthquake.location}`, {
      description: `${earthquake.date} ${earthquake.time}`,
    });
  };

  useEffect(() => {
    if (earthquakesError) {
      toast.error("Failed to load earthquake data");
    }
  }, [earthquakesError]);

  const allEarthquakes = filteredEarthquakes !== null ? filteredEarthquakes : earthquakesData?.data || [];
  const mapEarthquakes = allEarthquakes.slice(0, 30); // Limit map markers to 30
  const stats = statsData?.data;
  const isLoading = isLoadingEarthquakes || isLoadingStats;
  
  return (
    <div className="flex h-screen flex-col bg-background w-full">
      <Header
        onRefresh={handleRefresh}
        isLoading={isLoading}
        lastUpdate={earthquakesData?.meta.timestamp}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-3 md:p-4 space-y-4">
          {/* Stats Cards - 2 column on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <StatsCard
              title="Total Earthquakes"
              value={stats?.total_count || 0}
              subtitle="In the last 24 hours"
              icon={Activity}
              variant="primary"
            />
            <StatsCard
              title="Strongest"
              value={`M ${stats?.magnitude.max || 0}`}
              subtitle={stats?.strongest?.location?.slice(0, 30) || "N/A"}
              icon={TrendingUp}
              variant="destructive"
            />
            <StatsCard
              title="Average Magnitude"
              value={`M ${stats?.magnitude.average?.toFixed(1) || 0}`}
              subtitle="Across all recorded"
              icon={Waves}
            />
            <StatsCard
              title="Average Depth"
              value={`${stats?.depth.average?.toFixed(0) || 0} km`}
              subtitle="Below surface"
              icon={TrendingDown}
            />
          </div>

          {/* Filter Panel */}
          <FilterPanel onFilter={handleFilter} onClear={handleClearFilter} />

          {/* Map */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden border border-border">
            <EarthquakeMap
              earthquakes={mapEarthquakes}
              onEarthquakeClick={handleEarthquakeClick}
            />
            {/* Magnitude Legend - Smaller on mobile */}
            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-[1000] rounded-lg md:rounded-xl bg-card/95 p-2.5 md:p-4 backdrop-blur-md border border-border shadow-xl max-w-[160px] md:max-w-none">
              <p className="text-[10px] md:text-xs font-semibold text-foreground mb-2 md:mb-3 uppercase tracking-wide">Magnitude Scale</p>
              <div className="space-y-1.5 md:space-y-2.5">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-magnitude-high shadow-sm ring-2 ring-magnitude-high/30 flex-shrink-0" />
                  <span className="text-[10px] md:text-xs font-medium text-foreground">5.0+ Strong</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 rounded-full bg-magnitude-medium shadow-sm ring-2 ring-magnitude-medium/30 flex-shrink-0" />
                  <span className="text-[10px] md:text-xs font-medium text-foreground">3.0 - 4.9</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-magnitude-low shadow-sm ring-2 ring-magnitude-low/30 flex-shrink-0" />
                  <span className="text-[10px] md:text-xs font-medium text-foreground">&lt; 3.0</span>
                </div>
              </div>
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border">
                <p className="text-[9px] md:text-[10px] text-muted-foreground">{mapEarthquakes.length} events</p>
              </div>
            </div>
          </div>

          {/* Earthquake Lists - Stacked on mobile, side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-[280px] md:h-[320px] overflow-hidden rounded-lg border border-border">
              <EarthquakeList
                earthquakes={(topData?.data || []).slice(0, 5)}
                title="Top by Magnitude"
                onEarthquakeClick={handleEarthquakeClick}
              />
            </div>
            <div className="h-[280px] md:h-[320px] overflow-hidden rounded-lg border border-border">
              <EarthquakeList
                earthquakes={(recentData?.data || []).slice(0, 10)}
                title="Recent Earthquakes"
                onEarthquakeClick={handleEarthquakeClick}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
