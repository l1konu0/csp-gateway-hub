-- Modifier la table panier pour utiliser les produits du catalogue au lieu des pneus
ALTER TABLE public.panier DROP CONSTRAINT IF EXISTS panier_pneu_id_fkey;
ALTER TABLE public.panier RENAME COLUMN pneu_id TO produit_id;
ALTER TABLE public.panier ADD CONSTRAINT panier_produit_id_fkey 
  FOREIGN KEY (produit_id) REFERENCES public.catalogue_produits(id);