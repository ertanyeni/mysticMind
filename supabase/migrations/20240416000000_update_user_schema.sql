-- Update users table schema to include additional registration fields
-- This migration documents changes that have already been applied to the database

-- Create gender type enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
        CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
    END IF;
END$$;

-- Add columns to users table if they don't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username varchar UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name varchar;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name varchar;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender gender_type;

-- Add comment explaining this migration
COMMENT ON TABLE public.users IS 'Stores user information and preferences including required registration fields (username, first_name, last_name, birth_date, gender)'; 