-- Script pour forcer l'ajout de la colonne famille
-- À exécuter dans Supabase SQL Editor

-- Supprimer la colonne si elle existe (pour repartir à zéro)
ALTER TABLE public.catalogue_produits DROP COLUMN IF EXISTS famille;

-- Ajouter la colonne famille
ALTER TABLE public.catalogue_produits ADD COLUMN famille TEXT;

-- Ajouter un index
CREATE INDEX IF NOT EXISTS idx_catalogue_produits_famille 
ON public.catalogue_produits(famille);

-- Mettre à jour tous les produits existants avec une famille par défaut
UPDATE public.catalogue_produits 
SET famille = 'FA0001' 
WHERE famille IS NULL;

-- Vérifier le résultat
SELECT 
    COUNT(*) as total,
    COUNT(famille) as avec_famille,
    MIN(famille) as premiere_famille,
    MAX(famille) as derniere_famille
FROM public.catalogue_produits;

-- Afficher quelques exemples
SELECT 
    code,
    famille,
    designation
FROM public.catalogue_produits 
LIMIT 10;

SELECT 'Colonne famille ajoutée et mise à jour !' as message;
