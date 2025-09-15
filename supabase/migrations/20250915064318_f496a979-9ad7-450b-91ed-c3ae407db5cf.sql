-- Créer la table des profils utilisateurs
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  telephone VARCHAR(20),
  adresse TEXT,
  ville VARCHAR(50),
  code_postal VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Activer RLS sur les profils
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour les profils
CREATE POLICY "Utilisateurs peuvent voir leur propre profil" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Utilisateurs peuvent mettre à jour leur profil" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Insertion automatique du profil" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Créer les types pour les rôles
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

-- Créer la table des rôles utilisateur
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Activer RLS sur les rôles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction pour vérifier les rôles (évite la récursion RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Politiques RLS pour les rôles
CREATE POLICY "Utilisateurs peuvent voir leurs rôles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- Fonction pour créer automatiquement un profil et un rôle client
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Créer le profil
  INSERT INTO public.profiles (id, nom, prenom)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'nom',
    NEW.raw_user_meta_data ->> 'prenom'
  );
  
  -- Assigner le rôle client par défaut
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

-- Trigger pour créer automatiquement le profil et le rôle
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Créer la table panier
CREATE TABLE public.panier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pneu_id INTEGER REFERENCES public.pneus(id) ON DELETE CASCADE NOT NULL,
  quantite INTEGER NOT NULL CHECK (quantite > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, pneu_id)
);

-- Activer RLS sur le panier
ALTER TABLE public.panier ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour le panier
CREATE POLICY "Utilisateurs peuvent gérer leur panier" ON public.panier
FOR ALL USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();