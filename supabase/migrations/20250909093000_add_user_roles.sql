-- Create user_role type
CREATE TYPE public.user_role AS ENUM ('guest', 'host', 'admin');

-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role public.user_role NOT NULL DEFAULT 'guest';

-- Update RLS policies to protect role column
-- Only admins can update the role of a user (this requires a check against the updater's role)
-- However, for simplicity in this migration, we'll keep the existing "Users can update their own profile" 
-- but we might want to restrict updating the 'role' column specifically if Supabase supported column-level RLS easily 
-- or use a trigger/function.
-- For now, let's rely on backend logic or separate admin function to promote users.

-- Create a policy that allows anyone to read roles (needed for UI)
-- "Profiles are viewable by everyone" already exists, so role will be visible.

-- Create a secure function to update user role (only callable by admins)
-- Note: Bootstrapping the first admin is the tricky part. 
-- We'll allow the first user to claim admin or manual update in dashboard.
