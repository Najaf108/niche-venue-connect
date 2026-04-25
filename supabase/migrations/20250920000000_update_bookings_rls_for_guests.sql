-- Allow guests to update their own bookings
CREATE POLICY "Guests can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = guest_id);
