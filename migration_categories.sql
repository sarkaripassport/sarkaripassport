-- =========================================================================
-- RUN THIS SQL IN YOUR SUPABASE DASHBOARD SQL EDITOR
-- TO CREATE THE MISSING 'categories' TABLE
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow all access to authenticated service role" ON public.categories;

-- Create policies for public reading and service role/admin management
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow all access to authenticated service role" ON public.categories USING (true);

-- Grant privileges
GRANT ALL PRIVILEGES ON public.categories TO postgres;
GRANT ALL PRIVILEGES ON public.categories TO service_role;
GRANT ALL PRIVILEGES ON public.categories TO anon;
GRANT ALL PRIVILEGES ON public.categories TO authenticated;
