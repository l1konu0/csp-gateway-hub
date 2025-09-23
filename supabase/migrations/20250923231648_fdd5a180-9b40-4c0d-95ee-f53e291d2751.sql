-- Ajouter la politique de suppression pour les pneus
CREATE POLICY "Admins peuvent supprimer les pneus" 
ON public.pneus 
FOR DELETE 
USING (is_admin());

-- Ajouter la politique de suppression pour le catalogue
CREATE POLICY "Admins peuvent supprimer du catalogue" 
ON public.catalogue_produits 
FOR DELETE 
USING (is_admin());