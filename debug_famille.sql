-- Script de diagnostic pour la colonne famille
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier si la colonne famille existe
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'catalogue_produits' 
AND table_schema = 'public'
AND column_name = 'famille';

-- 2. Vérifier la structure complète de la table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'catalogue_produits' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Compter les enregistrements avec et sans famille
SELECT 
    COUNT(*) as total_produits,
    COUNT(famille) as avec_famille,
    COUNT(*) - COUNT(famille) as sans_famille
FROM public.catalogue_produits;

-- 4. Afficher quelques exemples de données
SELECT 
    id,
    code,
    famille,
    designation,
    created_at
FROM public.catalogue_produits 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Vérifier les index
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'catalogue_produits' 
AND schemaname = 'public';
