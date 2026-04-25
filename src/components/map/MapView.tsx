import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import { useSearch } from "@/context/SearchContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

export function MapView() {
  const { listings, filters } = useSearch();
  const [selectedListing, setSelectedListing] = useState<any>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds();

    // If we have listings with coordinates, fit bounds to them
    const hasCoordinates = listings.some(l => l.latitude && l.longitude);

    if (hasCoordinates) {
      listings.forEach((listing) => {
        if (listing.latitude && listing.longitude) {
          bounds.extend({ lat: listing.latitude, lng: listing.longitude });
        }
      });
      map.fitBounds(bounds);
    } else if (filters.latitude && filters.longitude) {
      // If no listings but we have a search location, center there
      map.setCenter({ lat: filters.latitude, lng: filters.longitude });
      map.setZoom(12);
    }

    setMap(map);
  }, [listings, filters]);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-full min-h-[400px] bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Error loading map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-[400px] bg-muted flex items-center justify-center rounded-lg animate-pulse">
        <p className="text-muted-foreground">Loading Map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] sticky top-24">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          filters.latitude && filters.longitude
            ? { lat: filters.latitude, lng: filters.longitude }
            : defaultCenter
        }
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {listings.map((listing) => (
                listing.latitude && listing.longitude && (
                  <Marker
                    key={listing.id}
                    position={{ lat: listing.latitude, lng: listing.longitude }}
                    clusterer={clusterer}
                    onClick={() => setSelectedListing(listing)}
                    animation={window.google.maps.Animation.DROP}
                  />
                )
              ))}
            </>
          )}
        </MarkerClusterer>

        {selectedListing && (
          <InfoWindow
            position={{
              lat: selectedListing.latitude,
              lng: selectedListing.longitude,
            }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <div className="w-64 p-0">
              <div className="relative h-32 w-full">
                <img
                  src={selectedListing.images?.[0] || "/placeholder.svg"}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1">{selectedListing.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {selectedListing.location}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">
                    ${selectedListing.price_per_night}/night
                  </span>
                  <Link to={`/spaces/${selectedListing.id}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

