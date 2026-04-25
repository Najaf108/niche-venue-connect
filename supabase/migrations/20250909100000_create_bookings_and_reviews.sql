-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts during development)
DROP POLICY IF EXISTS "Renters can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Hosts can view bookings for their listings" ON public.bookings;
DROP POLICY IF EXISTS "Renters can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Hosts can update booking status" ON public.bookings;
DROP POLICY IF EXISTS "Renters can cancel own bookings" ON public.bookings;

-- Renter can view own bookings
CREATE POLICY "Renters can view own bookings" ON public.bookings
FOR SELECT USING (auth.uid() = user_id);

-- Hosts can view bookings for their listings
CREATE POLICY "Hosts can view bookings for their listings" ON public.bookings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE listings.id = bookings.listing_id
    AND listings.user_id = auth.uid()
  )
);

-- Renters can create bookings
CREATE POLICY "Renters can create bookings" ON public.bookings
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Hosts can update booking status
CREATE POLICY "Hosts can update booking status" ON public.bookings
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE listings.id = bookings.listing_id
    AND listings.user_id = auth.uid()
  )
);

-- Renters can cancel (update) their own bookings
CREATE POLICY "Renters can cancel own bookings" ON public.bookings
FOR UPDATE USING (auth.uid() = user_id);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;

-- Everyone can read reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
FOR SELECT USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON public.reviews
FOR DELETE USING (auth.uid() = user_id);
