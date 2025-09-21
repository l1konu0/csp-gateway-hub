-- Ajouter un type de compte pour différencier particuliers et sociétés
CREATE TYPE public.type_compte AS ENUM ('particulier', 'societe');

-- Ajouter une colonne type_compte à la table profiles
ALTER TABLE public.profiles ADD COLUMN type_compte type_compte DEFAULT 'particulier' NOT NULL;

-- Ajouter des colonnes spécifiques aux sociétés
ALTER TABLE public.profiles ADD COLUMN raison_sociale text;
ALTER TABLE public.profiles ADD COLUMN siret character varying(14);
ALTER TABLE public.profiles ADD COLUMN tva_intracommunautaire character varying(20);
ALTER TABLE public.profiles ADD COLUMN secteur_activite text;

-- Créer une fonction pour vérifier si un utilisateur est une société
CREATE OR REPLACE FUNCTION public.is_societe()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND type_compte = 'societe'
  )
$$;

-- Créer une politique spéciale pour les sociétés (exemple pour tarifs préférentiels)
CREATE POLICY "Les sociétés peuvent avoir des tarifs spéciaux"
ON public.catalogue_produits
FOR SELECT
USING (
  CASE 
    WHEN is_societe() THEN true  -- Les sociétés voient tout
    ELSE actif = true            -- Les particuliers ne voient que les produits actifs
  END
);