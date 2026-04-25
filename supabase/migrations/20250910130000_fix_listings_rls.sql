
-- Fix listings RLS policies to allow hosts to manage their own listings correctly

-- 1. Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view all active listings" ON public.listings;
DROP POLICY IF EXISTS "Users can create their own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON public.listings;

-- 2. Anyone can view active listings (Public view)
CREATE POLICY "Anyone can view active listings" 
ON public.listings 
FOR SELECT 
USING (is_active = true);

-- 3. Owners can view their own listings (including inactive ones)
-- This is crucial for the Host Dashboard to show all of a host's spaces
CREATE POLICY "Owners can view their own listings" 
ON public.listings 
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Authenticated users can create their own listings
CREATE POLICY "Users can create their own listings" 
ON public.listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Owners can update their own listings
-- We use USING to find the row and WITH CHECK to ensure it still belongs to the user after update
CREATE POLICY "Users can update their own listings" 
ON public.listings 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Owners can delete their own listings
CREATE POLICY "Users can delete their own listings" 
ON public.listings 
FOR DELETE 
USING (auth.uid() = user_id);
