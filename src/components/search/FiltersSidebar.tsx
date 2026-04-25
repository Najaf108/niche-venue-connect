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
import { DateRangePicker } from "./DateRangePicker";
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
    <div className="space-y-6 p-4 bg-card rounded-lg border shadow-sm h-fit">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <Button 
          variant="outline" 
          className="w-full mb-4"
          onClick={() => {
            // Reset logic could go here or separate function
            // For now just re-trigger search
            searchListings();
          }}
        >
          Apply Filters
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Location</Label>
          <LocationSearch />
        </div>

        <div className="space-y-2">
          <Label>Date Range</Label>
          <DateRangePicker />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.spaceType}
            onValueChange={(val) => updateFilter("spaceType", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Guests</Label>
          <Input
            type="number"
            min={1}
            value={filters.guests}
            onChange={(e) => updateFilter("guests", parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="space-y-2">
          <Label>Price Range (${filters.priceRange[0]} - ${filters.priceRange[1]})</Label>
          <Slider
            min={0}
            max={1000}
            step={10}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <Label>Minimum Rating ({filters.rating} stars)</Label>
          <div className="flex items-center space-x-2">
            <Slider
              min={0}
              max={5}
              step={1}
              value={[filters.rating]}
              onValueChange={(val) => updateFilter("rating", val[0])}
              className="mt-2 flex-1"
            />
            <span className="text-sm w-8 text-right">{filters.rating > 0 ? filters.rating : 'Any'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Distance Radius ({filters.radius} km)</Label>
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
            <p className="text-xs text-muted-foreground">Select a location to filter by distance</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="instant-booking"
            checked={filters.instantBooking}
            onCheckedChange={(checked) => updateFilter("instantBooking", checked)}
          />
          <Label htmlFor="instant-booking">Instant Booking</Label>
        </div>

        <div className="space-y-2">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesList.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleAmenityChange(amenity, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
