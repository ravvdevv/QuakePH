import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Earthquake, parseCoordinate, getMagnitudeColor } from "@/lib/api";

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  onEarthquakeClick?: (earthquake: Earthquake) => void;
}

const EarthquakeMap = ({ earthquakes, onEarthquakeClick }: EarthquakeMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      map.current?.remove();
      map.current = null;
      return;
    }

    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      center: [12, 122],
      zoom: 6,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [isOnline]);

  useEffect(() => {
    if (!map.current || !earthquakes.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    earthquakes.forEach((eq, index) => {
      const lat = parseCoordinate(eq.latitude);
      const lng = parseCoordinate(eq.longitude);

      if (lat === 0 && lng === 0) return;

      const size = Math.max(36, eq.magnitudeNumeric * 10);
      const color = getMagnitudeColor(eq.magnitudeNumeric);
      const delay = index * 0.15; // Stagger animation

      const icon = L.divIcon({
        className: "earthquake-marker-container",
        html: `
          <div class="eq-marker" style="--marker-color: ${color}; --marker-size: ${size}px; --pulse-delay: ${delay}s;">
            <div class="eq-pulse"></div>
            <div class="eq-dot">
              <span class="eq-mag">${eq.magnitudeNumeric.toFixed(1)}</span>
            </div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map.current!);

      marker.bindPopup(`
        <div style="color: #1a1a2e; padding: 8px; min-width: 180px; font-family: 'Inter', sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="background: ${color}; color: white; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 14px;">M ${eq.magnitudeNumeric}</span>
            <span style="font-size: 11px; color: #666;">${eq.depth} km deep</span>
          </div>
          <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 500; line-height: 1.4;">${eq.location}</p>
          <p style="margin: 0; font-size: 11px; color: #888;">${eq.date} at ${eq.time}</p>
        </div>
      `);

      marker.on("click", () => {
        onEarthquakeClick?.(eq);
      });

      markersRef.current.push(marker);
    });
  }, [earthquakes, onEarthquakeClick]);

  if (!isOnline) {
    return (
      <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <p className="text-center">Map is unavailable. Please check your internet connection.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      <style>{`
        .earthquake-marker-container {
          background: transparent !important;
          border: none !important;
        }
        
        .eq-marker {
          position: relative;
          width: var(--marker-size);
          height: var(--marker-size);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .eq-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--marker-color);
          opacity: 0.4;
          animation: eq-pulse 2.5s ease-out infinite;
          animation-delay: var(--pulse-delay);
        }
        
        .eq-dot {
          position: relative;
          width: 65%;
          height: 65%;
          border-radius: 50%;
          background: var(--marker-color);
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          z-index: 1;
        }
        
        .eq-marker:hover .eq-dot {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        
        .eq-marker:hover .eq-pulse {
          animation-play-state: paused;
          opacity: 0.6;
        }
        
        .eq-mag {
          color: white;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        @keyframes eq-pulse {
          0% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          70% {
            transform: scale(1);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
      
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-border" />
    </div>
  );
};

export default EarthquakeMap;