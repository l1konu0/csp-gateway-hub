-- Script pour mettre à jour les données famille après import
-- À exécuter dans l'interface Supabase SQL Editor

-- Vérifier les données actuelles
SELECT code, famille, designation 
FROM public.catalogue_produits 
WHERE famille IS NULL 
LIMIT 10;

-- Mettre à jour les produits sans famille avec une valeur par défaut
UPDATE public.catalogue_produits 
SET famille = 'FA0001' 
WHERE famille IS NULL;

-- Vérifier le résultat
SELECT code, famille, designation 
FROM public.catalogue_produits 
LIMIT 10;

-- Compter les produits par famille
SELECT famille, COUNT(*) as nombre_produits
FROM public.catalogue_produits 
GROUP BY famille 
ORDER BY nombre_produits DESC;

SELECT 'Données famille mises à jour avec succès !' as message;
