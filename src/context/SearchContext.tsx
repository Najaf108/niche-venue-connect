import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';

export interface SearchFilters {
  location: string;
  latitude?: number;
  longitude?: number;
  radius: number; // in km
  dateRange?: DateRange;
  guests: number;
  spaceType: string;
  priceRange: [number, number];
  rating: number; // minimum rating
  amenities: string[];
  instantBooking: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  space_type: string;
  max_guests: number;
  images: string[];
  amenities: string[];
  user_id: string;
  is_active: boolean;
  created_at: string;
  instant_booking: boolean;
  distance?: number; // Calculated distance
  reviews?: { rating: number }[];
}

interface SearchContextType {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  listings: Listing[];
  loading: boolean;
  searchListings: (newFilters?: SearchFilters) => Promise<void>;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
}

const defaultFilters: SearchFilters = {
  location: '',
  radius: 20,
  guests: 1,
  spaceType: 'all',
  priceRange: [0, 1000],
  rating: 0,
  amenities: [],
  instantBooking: false,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFiltersState] = useState<SearchFilters>(() => {
    // Initialize from URL params
    const location = searchParams.get('location') || '';
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 20;
    const guests = searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : 1;
    const spaceType = searchParams.get('type') || 'all';
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 1000;
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : 0;
    const amenities = searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [];
    const instantBooking = searchParams.get('instant') === 'true';

    // Date range handling from URL is tricky, usually we store start/end strings
    const start = searchParams.get('start') ? parseISO(searchParams.get('start')!) : undefined;
    const end = searchParams.get('end') ? parseISO(searchParams.get('end')!) : undefined;

    return {
      location,
      latitude: lat,
      longitude: lng,
      radius,
      guests,
      spaceType,
      priceRange: [minPrice, maxPrice],
      rating,
      amenities,
      instantBooking,
      dateRange: start && end ? { from: start, to: end } : undefined
    };
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync filters to URL
  useEffect(() => {
    const params: any = {};
    if (filters.location) params.location = filters.location;
    if (filters.latitude) params.lat = filters.latitude.toString();
    if (filters.longitude) params.lng = filters.longitude.toString();
    if (filters.radius !== 20) params.radius = filters.radius.toString();
    if (filters.guests !== 1) params.guests = filters.guests.toString();
    if (filters.spaceType !== 'all') params.type = filters.spaceType;
    if (filters.priceRange[0] !== 0) params.minPrice = filters.priceRange[0].toString();
    if (filters.priceRange[1] !== 1000) params.maxPrice = filters.priceRange[1].toString();
    if (filters.rating > 0) params.rating = filters.rating.toString();
    if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');
    if (filters.instantBooking) params.instant = 'true';
    if (filters.dateRange?.from) params.start = format(filters.dateRange.from, 'yyyy-MM-dd');
    if (filters.dateRange?.to) params.end = format(filters.dateRange.to, 'yyyy-MM-dd');

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFiltersState(prev => ({ ...prev, [key]: value }));
  };

  const setFilters = (newFilters: SearchFilters) => {
    setFiltersState(newFilters);
  };

  // Haversine distance calculation
  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const searchListings = async (newFilters?: SearchFilters) => {
    setLoading(true);
    const currentFilters = newFilters || filters;

    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          reviews(rating)
        `)
        .eq('is_active', true);

      // Filter by space type
      if (currentFilters.spaceType !== 'all') {
        query = query.eq('space_type', currentFilters.spaceType);
      }

      // Filter by guests
      if (currentFilters.guests > 1) {
        query = query.gte('max_guests', currentFilters.guests);
      }

      // Filter by price
      query = query.gte('price_per_night', currentFilters.priceRange[0]);
      query = query.lte('price_per_night', currentFilters.priceRange[1]);

      // Filter by amenities (client-side usually easier for array contains, or .contains())
      if (currentFilters.amenities.length > 0) {
        query = query.contains('amenities', currentFilters.amenities);
      }

      // Filter by instant booking
      if (currentFilters.instantBooking) {
        query = query.eq('instant_booking', true);
      }

      // Text search (if not using radius/coordinates)
      if (!currentFilters.latitude && !currentFilters.longitude && currentFilters.location) {
        const term = currentFilters.location;
        query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = (data || []) as Listing[];

      // Client-side filtering for Location (Radius)
      if (currentFilters.latitude && currentFilters.longitude) {
        filteredData = filteredData.map(item => {
          if (item.latitude && item.longitude && currentFilters.latitude && currentFilters.longitude) {
            const dist = getDistanceFromLatLonInKm(
              currentFilters.latitude,
              currentFilters.longitude,
              item.latitude,
              item.longitude
            );
            return { ...item, distance: dist };
          }
          return item;
        }).filter(item => {
          if (item.distance !== undefined) {
            return item.distance <= currentFilters.radius;
          }
          return true; // If no lat/long on item, keep it? Or exclude? Maybe exclude if location search is active.
        }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }
      // Note: Text search is now handled server-side above, but we keep the fallback just in case or for hybrid scenarios if needed.
      // Actually, if we use server-side OR, we don't need client-side filtering for this anymore.

      // Filter by Rating (Mocking rating since we don't have it in listings yet, or need to fetch reviews)
      // Ideally we should join with reviews or have a cached rating in listings table.
      // For now, ignoring rating filter or we can fetch reviews.

      setListings(filteredData);
    } catch (err) {
      console.error('Error searching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial search
  useEffect(() => {
    searchListings();
  }, []); // Run once on mount? Or when filters change?

  // Debounced search when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      searchListings();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <SearchContext.Provider value={{ filters, setFilters, listings, loading, searchListings, updateFilter }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
