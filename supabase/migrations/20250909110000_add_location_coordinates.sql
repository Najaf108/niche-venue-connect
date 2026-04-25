-- Add coordinates and instant_booking to listings
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS instant_booking BOOLEAN DEFAULT false;

-- Create an index for faster location queries (optional but good)
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings(latitude, longitude);
