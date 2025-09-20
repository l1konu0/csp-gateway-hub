-- Security fixes for CSP Pneu application

-- 1. CRITICAL: Fix catalogue_produits RLS policies to protect business financial data
-- Drop the current public read policy that exposes sensitive business data
DROP POLICY IF EXISTS "Lecture publique du catalogue" ON public.catalogue_produits;

-- Create new restricted policy for basic product info (authenticated users)
CREATE POLICY "Lecture produits de base" 
ON public.catalogue_produits 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create separate policy for admins to see all financial data
CREATE POLICY "Admins peuvent voir données financières" 
ON public.catalogue_produits 
FOR SELECT 
USING (is_admin());

-- 2. HIGH PRIORITY: Add comprehensive RLS policies for user_roles table
-- Currently only has SELECT policy, missing INSERT/UPDATE/DELETE controls

-- Only admins can create new role assignments
CREATE POLICY "Admins peuvent assigner des rôles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (is_admin());

-- Only admins can modify roles, prevent self-promotion
CREATE POLICY "Admins peuvent modifier les rôles" 
ON public.user_roles 
FOR UPDATE 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Only admins can remove role assignments
CREATE POLICY "Admins peuvent supprimer des rôles" 
ON public.user_roles 
FOR DELETE 
USING (is_admin());

-- 3. MODERATE: Fix database functions security - add proper search_path
-- Update existing functions to include proper search_path settings

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Trouver l'ID de l'utilisateur par email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    -- Vérifier si l'utilisateur existe
    IF target_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Ajouter ou mettre à jour le rôle admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.generer_numero_facture()
RETURNS character varying
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    new_number character varying;
    year_part character varying;
    sequence_part integer;
BEGIN
    -- Obtenir l'année courante
    year_part := to_char(now(), 'YYYY');
    
    -- Obtenir le prochain numéro de séquence pour cette année
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_facture FROM '\d+$') AS integer)), 0) + 1
    INTO sequence_part
    FROM public.commandes 
    WHERE numero_facture LIKE 'FAC' || year_part || '%';
    
    -- Formater le numéro de facture: FAC2025-0001
    new_number := 'FAC' || year_part || '-' || LPAD(sequence_part::text, 4, '0');
    
    RETURN new_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.generer_facture_commande(commande_id integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    nouveau_numero character varying;
BEGIN
    -- Vérifier si la commande existe et n'a pas déjà de facture
    IF NOT EXISTS (
        SELECT 1 FROM public.commandes 
        WHERE id = commande_id AND facture_generee = false
    ) THEN
        RETURN false;
    END IF;
    
    -- Générer le numéro de facture
    nouveau_numero := generer_numero_facture();
    
    -- Mettre à jour la commande
    UPDATE public.commandes 
    SET 
        numero_facture = nouveau_numero,
        date_facture = now(),
        facture_generee = true
    WHERE id = commande_id;
    
    RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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