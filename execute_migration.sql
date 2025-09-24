-- Script pour ajouter la colonne famille à catalogue_produits
-- À exécuter dans l'interface Supabase SQL Editor

-- Vérifier d'abord si la colonne existe
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'catalogue_produits' 
AND table_schema = 'public'
AND column_name = 'famille';

-- Ajouter la colonne famille si elle n'existe pas
ALTER TABLE public.catalogue_produits 
ADD COLUMN IF NOT EXISTS famille TEXT;

-- Ajouter un index sur la colonne famille pour les performances
CREATE INDEX IF NOT EXISTS idx_catalogue_produits_famille 
ON public.catalogue_produits(famille);

-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'catalogue_produits' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Afficher un message de confirmation
SELECT 'Colonne famille ajoutée avec succès !' as message;
