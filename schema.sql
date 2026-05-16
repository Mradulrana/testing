-- =========================================
-- CLEAN OLD DATABASE OBJECTS
-- =========================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

DROP TABLE IF EXISTS public.media CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TYPE IF EXISTS public.media_type CASCADE;
DROP TYPE IF EXISTS public.property_type CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- =========================================
-- CREATE ENUM TYPES
-- =========================================

CREATE TYPE public.user_role AS ENUM (
  'admin',
  'agent',
  'buyer',
  'seller'
);

CREATE TYPE public.property_type AS ENUM (
  'plot',
  'land',
  'house'
);

CREATE TYPE public.media_type AS ENUM (
  'image',
  'video',
  'audio'
);

-- =========================================
-- CREATE PROFILES TABLE
-- =========================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  full_name TEXT DEFAULT '',

  phone_number TEXT DEFAULT '',

  user_role public.user_role
    NOT NULL
    DEFAULT 'buyer',

  created_at TIMESTAMPTZ
    NOT NULL
    DEFAULT NOW(),

  updated_at TIMESTAMPTZ
    NOT NULL
    DEFAULT NOW()
);

-- =========================================
-- CREATE PROPERTIES TABLE
-- =========================================

CREATE TABLE public.properties (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  owner_id UUID
    NOT NULL
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,

  title TEXT NOT NULL,

  description TEXT DEFAULT '',

  property_type public.property_type
    NOT NULL,

  price NUMERIC NOT NULL,

  location TEXT NOT NULL,

  area_size NUMERIC NOT NULL,

  created_at TIMESTAMPTZ
    NOT NULL
    DEFAULT NOW(),

  updated_at TIMESTAMPTZ
    NOT NULL
    DEFAULT NOW()
);

-- =========================================
-- CREATE MEDIA TABLE
-- =========================================

CREATE TABLE public.media (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  property_id BIGINT
    NOT NULL
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  media_url TEXT NOT NULL,

  media_type public.media_type
    NOT NULL,

  created_at TIMESTAMPTZ
    NOT NULL
    DEFAULT NOW()
);

-- =========================================
-- ENABLE ROW LEVEL SECURITY
-- =========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- =========================================
-- DROP OLD POLICIES
-- =========================================

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Properties viewable by everyone" ON public.properties;
DROP POLICY IF EXISTS "Users can insert own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can delete own properties" ON public.properties;

DROP POLICY IF EXISTS "Media viewable by everyone" ON public.media;
DROP POLICY IF EXISTS "Users can insert media" ON public.media;
DROP POLICY IF EXISTS "Users can update own media" ON public.media;
DROP POLICY IF EXISTS "Users can delete own media" ON public.media;

-- =========================================
-- PROFILES POLICIES
-- =========================================

CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- =========================================
-- PROPERTIES POLICIES
-- =========================================

CREATE POLICY "Properties viewable by everyone"
ON public.properties
FOR SELECT
USING (true);

CREATE POLICY "Users can insert own properties"
ON public.properties
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own properties"
ON public.properties
FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own properties"
ON public.properties
FOR DELETE
USING (auth.uid() = owner_id);

-- =========================================
-- MEDIA POLICIES
-- =========================================

CREATE POLICY "Media viewable by everyone"
ON public.media
FOR SELECT
USING (true);

CREATE POLICY "Users can insert media"
ON public.media
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update own media"
ON public.media
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.properties
    WHERE properties.id = media.property_id
    AND properties.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own media"
ON public.media
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.properties
    WHERE properties.id = media.property_id
    AND properties.owner_id = auth.uid()
  )
);

-- =========================================
-- UPDATED_AT FUNCTION
-- =========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =========================================
-- UPDATED_AT TRIGGERS
-- =========================================

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- SAFE USER SIGNUP FUNCTION
-- =========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  safe_role public.user_role;
BEGIN

  safe_role :=
    CASE
      WHEN NEW.raw_user_meta_data->>'user_role' = 'seller'
        THEN 'seller'::public.user_role

      WHEN NEW.raw_user_meta_data->>'user_role' = 'agent'
        THEN 'agent'::public.user_role

      WHEN NEW.raw_user_meta_data->>'user_role' = 'admin'
        THEN 'admin'::public.user_role

      ELSE 'buyer'::public.user_role
    END;

  INSERT INTO public.profiles (
    id,
    full_name,
    phone_number,
    user_role
  )
  VALUES (
    NEW.id,

    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      ''
    ),

    COALESCE(
      NEW.raw_user_meta_data->>'phone_number',
      ''
    ),

    safe_role
  );

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- =========================================
-- CREATE AUTH TRIGGER
-- =========================================

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- GRANT PERMISSIONS
-- =========================================

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.properties TO authenticated;
GRANT ALL ON public.media TO authenticated;

-- =========================================
-- SUCCESS
-- =========================================

SELECT 'SUPABASE DATABASE READY' AS status;