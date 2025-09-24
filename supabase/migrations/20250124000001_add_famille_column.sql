-- Migration pour ajouter la colonne famille à catalogue_produits

-- Ajouter la colonne famille
ALTER TABLE public.catalogue_produits 
ADD COLUMN IF NOT EXISTS famille TEXT;

-- Ajouter un index sur la colonne famille pour les performances
CREATE INDEX IF NOT EXISTS idx_catalogue_produits_famille 
ON public.catalogue_produits(famille);

-- Mettre à jour les types TypeScript (commentaire pour référence)
-- La colonne famille sera ajoutée automatiquement aux types lors du prochain déploiement
