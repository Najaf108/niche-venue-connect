import React, { useState, useEffect, useRef } from "react";
import { Check, MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearch } from "@/context/SearchContext";

const MOCK_LOCATIONS = [
  { label: "New York, NY", lat: 40.7128, lng: -74.0060 },
  { label: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  { label: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  { label: "Houston, TX", lat: 29.7604, lng: -95.3698 },
  { label: "Phoenix, AZ", lat: 33.4484, lng: -112.0740 },
  { label: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 },
  { label: "San Antonio, TX", lat: 29.4241, lng: -98.4936 },
  { label: "San Diego, CA", lat: 32.7157, lng: -117.1611 },
  { label: "Dallas, TX", lat: 32.7767, lng: -96.7970 },
  { label: "San Jose, CA", lat: 37.3382, lng: -121.8863 },
];

export function LocationSearch() {
  const { filters, updateFilter } = useSearch();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(filters.location);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with filters.location if it changes externally
  useEffect(() => {
    setInputValue(filters.location);
  }, [filters.location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    updateFilter("location", newValue);

    // Clear lat/long when user types manually (switching to text search)
    if (filters.latitude || filters.longitude) {
      updateFilter("latitude", undefined);
      updateFilter("longitude", undefined);
    }

    setOpen(true);
  };

  const handleSelectLocation = (location: typeof MOCK_LOCATIONS[0]) => {
    setInputValue(location.label);
    updateFilter("location", location.label);
    updateFilter("latitude", location.lat);
    updateFilter("longitude", location.lng);
    setOpen(false);
  };

  const clearSearch = () => {
    setInputValue("");
    updateFilter("location", "");
    updateFilter("latitude", undefined);
    updateFilter("longitude", undefined);
    inputRef.current?.focus();
  };

  // Filter suggestions based on input
  const filteredLocations = MOCK_LOCATIONS.filter(loc =>
    loc.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder="Search by name, city, or description..."
          className="pl-9 pr-8 border-none bg-transparent focus-visible:ring-0 text-foreground font-medium placeholder:text-muted-foreground/50"
          aria-label="Search spaces"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      {open && inputValue && filteredLocations.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border p-1">
          <ul className="text-sm">
            {filteredLocations.map((location) => (
              <li
                key={location.label}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1.5 rounded-sm flex items-center"
                onClick={() => handleSelectLocation(location)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {location.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
