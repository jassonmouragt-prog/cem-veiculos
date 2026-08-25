-- Fix sellers table: remove UNIQUE constraint on user_id and make it nullable
-- This allows multiple sellers to be created by the same admin user

-- Drop the UNIQUE constraint
ALTER TABLE public.sellers DROP CONSTRAINT IF EXISTS sellers_user_id_key;

-- Make user_id nullable (optional)
ALTER TABLE public.sellers ALTER COLUMN user_id DROP NOT NULL;