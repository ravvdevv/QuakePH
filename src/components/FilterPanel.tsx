import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Filter, X } from "lucide-react";

interface FilterPanelProps {
  onFilter: (minMag?: number, maxMag?: number, location?: string) => void;
  onClear: () => void;
}

const FilterPanel = ({ onFilter, onClear }: FilterPanelProps) => {
  const [magnitudeRange, setMagnitudeRange] = useState<[number, number]>([0, 10]);
  const [location, setLocation] = useState("");

  const handleApply = () => {
    onFilter(
      magnitudeRange[0] > 0 ? magnitudeRange[0] : undefined,
      magnitudeRange[1] < 10 ? magnitudeRange[1] : undefined,
      location || undefined
    );
  };

  const handleClear = () => {
    setMagnitudeRange([0, 10]);
    setLocation("");
    onClear();
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Accordion type="single" collapsible className="w-full" defaultValue="filters">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-card-foreground">Filters</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-end mb-2">
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <X className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">
                  Magnitude Range: {magnitudeRange[0]} - {magnitudeRange[1]}
                </Label>
                <Slider
                  value={magnitudeRange}
                  onValueChange={(value) => setMagnitudeRange(value as [number, number])}
                  min={0}
                  max={10}
                  step={0.5}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Batangas, Manila..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <Button onClick={handleApply} className="w-full" style={{ minHeight: 'var(--min-touch-target, 44px)' }}>
                Apply Filters
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterPanel;
