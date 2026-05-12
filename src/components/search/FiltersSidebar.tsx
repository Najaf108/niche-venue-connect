import React from "react";
import { useSearch } from "@/context/SearchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationSearch } from "./LocationSearch";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Gaming Room", label: "Gaming Rooms" },
  { value: "Podcast Studio", label: "Podcast Studios" },
  { value: "Art Studio", label: "Art Studios" },
  { value: "Meeting Room", label: "Meeting Rooms" },
  { value: "Music Studio", label: "Music Studios" },
  { value: "Photo Studio", label: "Photo Studios" },
  { value: "Fitness Space", label: "Fitness Spaces" },
  { value: "Study Room", label: "Study Rooms" },
];

const amenitiesList = [
  "WiFi",
  "Parking",
  "Air Conditioning",
  "Kitchen",
  "TV",
  "Sound System",
  "Green Screen",
  "Lighting Equipment",
];

export function FiltersSidebar() {
  const { filters, updateFilter, searchListings } = useSearch();

  const handlePriceChange = (value: number[]) => {
    updateFilter("priceRange", value as [number, number]);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    let newAmenities = [...filters.amenities];
    if (checked) {
      newAmenities.push(amenity);
    } else {
      newAmenities = newAmenities.filter((a) => a !== amenity);
    }
    updateFilter("amenities", newAmenities);
  };

  return (
    <div className="glass-card p-8 space-y-8 h-fit reveal">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tight">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary font-bold hover:bg-primary/5 rounded-full"
          onClick={() => window.location.reload()}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Location</Label>
          <div className="glass-input p-1 rounded-2xl">
            <LocationSearch />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Category</Label>
          <Select
            value={filters.spaceType}
            onValueChange={(val) => updateFilter("spaceType", val)}
          >
            <SelectTrigger className="rounded-2xl border-border/50 h-12 bg-background/50 backdrop-blur">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Capacity</Label>
          <Input
            type="number"
            min={1}
            className="rounded-2xl border-border/50 h-12 bg-background/50 backdrop-blur"
            value={filters.guests}
            onChange={(e) => updateFilter("guests", parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Price Range</Label>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
          </div>
          <Slider
            min={0}
            max={1000}
            step={10}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="mt-2"
          />
        </div>

        {/* <div className="space-y-3">
          <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Radius ({filters.radius} km)</Label>
          <Slider
            min={1}
            max={50}
            step={1}
            value={[filters.radius]}
            onValueChange={(val) => updateFilter("radius", val[0])}
            disabled={!filters.latitude}
            className="mt-2"
          />
          {!filters.latitude && (
            <p className="text-[10px] font-bold text-muted-foreground italic uppercase">Select a location to filter by distance</p>
          )}
        </div> */}

        {/* <div className="flex items-center justify-between glass-input p-4 rounded-2xl">
          <Label htmlFor="instant-booking" className="font-bold cursor-pointer">Instant Booking</Label>
          <Switch
            id="instant-booking"
            checked={filters.instantBooking}
            onCheckedChange={(checked) => updateFilter("instantBooking", checked)}
          />
        </div> */}

        <div className="space-y-4">
          <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Amenities</Label>
          <div className="grid grid-cols-1 gap-3">
            {amenitiesList.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center space-x-3 group cursor-pointer p-1 -ml-1 rounded-lg hover:bg-white/5 transition-colors"
                onClick={() => handleAmenityChange(amenity, !filters.amenities.includes(amenity))}
              >
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleAmenityChange(amenity, checked as boolean)
                  }
                  className="rounded-md border-white/20 data-[state=checked]:bg-primary transition-all shadow-sm"
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm font-bold text-slate-300 cursor-pointer group-hover:text-primary transition-colors"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-creative text-white font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
        onClick={() => searchListings()}
      >
        Apply Search
      </Button>
    </div>
  );
}
