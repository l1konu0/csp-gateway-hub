-- Supprimer l'ancienne contrainte de clé étrangère
ALTER TABLE public.commande_details 
DROP CONSTRAINT IF EXISTS commande_details_produit_id_fkey;

-- Recréer la contrainte avec CASCADE pour permettre la suppression
ALTER TABLE public.commande_details 
ADD CONSTRAINT commande_details_produit_id_fkey 
FOREIGN KEY (produit_id) 
REFERENCES public.catalogue_produits(id) 
ON DELETE CASCADE;