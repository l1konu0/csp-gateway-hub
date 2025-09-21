-- Mettre à jour la table commande_details pour utiliser produit_id au lieu de pneu_id
ALTER TABLE public.commande_details DROP CONSTRAINT IF EXISTS commande_details_pneu_id_fkey;
ALTER TABLE public.commande_details RENAME COLUMN pneu_id TO produit_id;
ALTER TABLE public.commande_details ADD CONSTRAINT commande_details_produit_id_fkey 
  FOREIGN KEY (produit_id) REFERENCES public.catalogue_produits(id);