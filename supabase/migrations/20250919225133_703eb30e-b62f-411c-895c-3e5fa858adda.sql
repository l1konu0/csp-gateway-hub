-- Add user_id column to link orders to authenticated users
ALTER TABLE public.commandes ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create index for better performance
CREATE INDEX idx_commandes_user_id ON public.commandes(user_id);

-- Drop the overly permissive policy that exposes all customer data
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leurs commandes" ON public.commandes;

-- Create secure policy: customers can only see their own orders
CREATE POLICY "Customers can view their own orders" 
ON public.commandes 
FOR SELECT 
USING (
  auth.uid() = user_id OR is_admin()
);

-- Update existing orders to allow gradual migration (set user_id to null for now)
-- Existing orders without user_id will only be visible to admins
-- New orders will require proper user_id linkage