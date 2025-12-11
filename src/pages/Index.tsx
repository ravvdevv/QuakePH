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

  const allEarthquakes = filteredEarthquakes || earthquakesData?.data || [];
  const mapEarthquakes = allEarthquakes.slice(0, 15); // Limit map markers to 15
  const stats = statsData?.data;
  const isLoading = isLoadingEarthquakes || isLoadingStats;

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        onRefresh={handleRefresh}
        isLoading={isLoading}
        lastUpdate={earthquakesData?.meta.timestamp}
      />

      <main className="flex-1 overflow-hidden p-4">
        <div className="grid h-full gap-4 lg:grid-cols-4">
          {/* Left Panel - Stats and Filters */}
          <div className="flex flex-col gap-4 overflow-y-auto lg:col-span-1">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
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

            <FilterPanel onFilter={handleFilter} onClear={handleClearFilter} />
          </div>

          {/* Center - Map */}
          <div className="h-[400px] lg:col-span-2 lg:h-full">
            <EarthquakeMap
              earthquakes={mapEarthquakes}
              onEarthquakeClick={handleEarthquakeClick}
            />
          </div>

          {/* Right Panel - Earthquake Lists */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="h-[300px] lg:h-1/2">
              <EarthquakeList
                earthquakes={recentData?.data || []}
                title="Recent Earthquakes"
                onEarthquakeClick={handleEarthquakeClick}
              />
            </div>
            <div className="h-[300px] lg:h-1/2">
              <EarthquakeList
                earthquakes={topData?.data || []}
                title="Top by Magnitude"
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
