-- Créer un utilisateur admin par défaut et lui donner le rôle admin

-- D'abord, insérer un profil admin dans la table profiles
INSERT INTO public.profiles (id, nom, prenom) 
VALUES (
  'admin-csp-pneu-2025'::uuid,
  'Administrateur',
  'CSP Pneu'
);

-- Ensuite, créer le rôle admin pour cet utilisateur
INSERT INTO public.user_roles (user_id, role)
VALUES (
  'admin-csp-pneu-2025'::uuid,
  'admin'
);

-- Créer une fonction pour vérifier les droits admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
$$;

-- Mettre à jour les politiques RLS pour les pneus pour permettre à l'admin de gérer
CREATE POLICY "Admins peuvent tout faire sur les pneus" 
ON public.pneus 
FOR ALL 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Politique pour que les admins puissent voir tous les utilisateurs
CREATE POLICY "Admins peuvent voir tous les profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.is_admin() OR auth.uid() = id);

-- Politique pour que les admins puissent voir toutes les commandes
CREATE POLICY "Admins peuvent voir toutes les commandes" 
ON public.commandes 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Politique pour que les admins puissent voir tous les détails de commandes
CREATE POLICY "Admins peuvent voir tous les détails de commande" 
ON public.commande_details 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Politique pour que les admins puissent modifier le statut des commandes
CREATE POLICY "Admins peuvent modifier les commandes" 
ON public.commandes 
FOR UPDATE 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());