-- Créer la table des catégories de produits
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insérer les catégories de base
INSERT INTO public.categories (code, nom, description) VALUES 
('FA0001', 'Pneus', 'Pneus automobiles et utilitaires'),
('FA0002', 'Jantes', 'Jantes en alliage et acier'),
('FA0003', 'Filtres et Huiles', 'Filtres à air, huile, gasoil et huiles moteur'),
('FA0004', 'Batteries', 'Batteries automobiles'),
('FA0005', 'Valves et Accessoires', 'Valves, colliers de serrage, accessoires pneus'),
('FA0006', 'Chambres à Air', 'Chambres à air et flaps');

-- Créer la table des produits catalogue
CREATE TABLE public.catalogue_produits (
  id SERIAL PRIMARY KEY,
  code INTEGER NOT NULL UNIQUE,
  categorie_id INTEGER NOT NULL REFERENCES public.categories(id),
  designation VARCHAR(300) NOT NULL,
  stock_reel INTEGER NOT NULL DEFAULT 0,
  stock_disponible INTEGER NOT NULL DEFAULT 0,
  prix_achat DECIMAL(10,2) NOT NULL DEFAULT 0,
  prix_moyen_achat DECIMAL(10,2) NOT NULL DEFAULT 0,
  prix_vente DECIMAL(10,2) NOT NULL DEFAULT 0,
  valeur_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  taux_tva INTEGER NOT NULL DEFAULT 19,
  coefficient DECIMAL(5,2) NOT NULL DEFAULT 1,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_produits ENABLE ROW LEVEL SECURITY;

-- Politiques pour les catégories
CREATE POLICY "Lecture publique des catégories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins peuvent gérer les catégories" 
ON public.categories 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Politiques pour le catalogue produits
CREATE POLICY "Lecture publique du catalogue" 
ON public.catalogue_produits 
FOR SELECT 
USING (true);

CREATE POLICY "Admins peuvent gérer le catalogue" 
ON public.catalogue_produits 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Créer trigger pour updated_at
CREATE TRIGGER update_catalogue_produits_updated_at
BEFORE UPDATE ON public.catalogue_produits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX idx_catalogue_produits_categorie ON public.catalogue_produits(categorie_id);
CREATE INDEX idx_catalogue_produits_stock ON public.catalogue_produits(stock_disponible);
CREATE INDEX idx_catalogue_produits_designation ON public.catalogue_produits USING gin(to_tsvector('french', designation));