-- Corriger les problèmes de sécurité

-- 1. Activer RLS sur toutes les tables publiques (le problème principal)
ALTER TABLE public.pneus ENABLE ROW LEVEL SECURITY;

-- 2. Créer les bonnes politiques RLS pour la table pneus (lecture publique uniquement)
CREATE POLICY "Lecture publique des pneus" ON public.pneus
FOR SELECT USING (true);

-- 3. Corriger la fonction update_updated_at_column avec le bon search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;