
-- Update listings RLS to allow guests to see listings they have booked, even if they are inactive

-- 1. Drop the owner-specific select policy if it exists (we'll replace it with a more comprehensive one)
DROP POLICY IF EXISTS "Owners can view their own listings" ON public.listings;
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.listings;

-- 2. Anyone can view active listings (Public view)
CREATE POLICY "Anyone can view active listings" 
ON public.listings 
FOR SELECT 
USING (is_active = true);

-- 3. Owners can view their own listings (including inactive ones)
CREATE POLICY "Owners can view their own listings" 
ON public.listings 
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Guests can view listings they have a booking for (even if inactive)
-- This fixes the bug where guests see an error in "My Bookings" if a host deactivates a booked listing
CREATE POLICY "Guests can view their booked listings" 
ON public.listings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.listing_id = public.listings.id
    AND bookings.guest_id = auth.uid()
  )
);
