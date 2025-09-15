-- Activer RLS sur les tables qui n'en ont pas
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour la table admins
CREATE POLICY "Seuls les admins peuvent voir les autres admins" 
ON public.admins 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Seuls les admins peuvent modifier les admins" 
ON public.admins 
FOR ALL 
USING (is_admin());