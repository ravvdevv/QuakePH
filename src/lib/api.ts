// PHIVOLCS API configuration
const API_BASE_URL = "https://phivocs-api.vercel.app";

export interface Earthquake {
  date: string;
  time: string;
  latitude: string;
  longitude: string;
  depth: string;
  magnitude: string;
  location: string;
  magnitudeNumeric: number;
}

export interface EarthquakeStats {
  total_count: number;
  magnitude: {
    max: number;
    min: number;
    average: number;
  };
  depth: {
    max: number;
    min: number;
    average: number;
  };
  most_recent: Earthquake;
  strongest: Earthquake;
}

export interface ApiResponse<T> {
  meta: {
    timestamp: string;
    count: number;
    cache_age_seconds?: number;
    requested?: number;
    total_available?: number;
    filters?: {
      min_magnitude?: number;
      max_magnitude?: number;
      location?: string;
    };
  };
  data: T;
}

export async function fetchEarthquakes(limit?: number, offset?: number): Promise<ApiResponse<Earthquake[]>> {
  const params = new URLSearchParams();
  if (limit) params.set("limit", limit.toString());
  if (offset) params.set("offset", offset.toString());
  
  const url = `${API_BASE_URL}/earthquakes${params.toString() ? `?${params}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch earthquakes");
  return response.json();
}

export async function fetchTopEarthquakes(count: number): Promise<ApiResponse<Earthquake[]>> {
  const response = await fetch(`${API_BASE_URL}/earthquakes/top/${count}`);
  if (!response.ok) throw new Error("Failed to fetch top earthquakes");
  return response.json();
}

export async function fetchRecentEarthquakes(count: number): Promise<ApiResponse<Earthquake[]>> {
  const response = await fetch(`${API_BASE_URL}/earthquakes/recent/${count}`);
  if (!response.ok) throw new Error("Failed to fetch recent earthquakes");
  return response.json();
}

export async function fetchEarthquakeStats(): Promise<ApiResponse<EarthquakeStats>> {
  const response = await fetch(`${API_BASE_URL}/earthquakes/stats`);
  if (!response.ok) throw new Error("Failed to fetch earthquake stats");
  return response.json();
}

export async function filterEarthquakes(
  minMagnitude?: number,
  maxMagnitude?: number,
  location?: string
): Promise<ApiResponse<Earthquake[]>> {
  const params = new URLSearchParams();
  if (minMagnitude) params.set("min_magnitude", minMagnitude.toString());
  if (maxMagnitude) params.set("max_magnitude", maxMagnitude.toString());
  if (location) params.set("location", location);
  
  const response = await fetch(`${API_BASE_URL}/earthquakes/filter?${params}`);
  if (!response.ok) throw new Error("Failed to filter earthquakes");
  return response.json();
}

export function parseCoordinate(coord: string): number {
  // Handle plain number format (e.g., "13.80")
  const plainNumber = parseFloat(coord);
  if (!isNaN(plainNumber)) return plainNumber;
  
  // Handle degree format (e.g., "10.50°N")
  const match = coord.match(/([\d.]+)°([NSEW])/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const direction = match[2];
  return direction === "S" || direction === "W" ? -value : value;
}

export function getMagnitudeColor(magnitude: number): string {
  if (magnitude < 3) return "hsl(var(--magnitude-low))";
  if (magnitude < 5) return "hsl(var(--magnitude-medium))";
  return "hsl(var(--magnitude-high))";
}

export function getMagnitudeClass(magnitude: number): string {
  if (magnitude < 3) return "magnitude-low";
  if (magnitude < 5) return "magnitude-medium";
  return "magnitude-high";
}
