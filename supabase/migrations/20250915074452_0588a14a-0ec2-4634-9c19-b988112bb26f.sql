-- Créer la table des marques de voitures
CREATE TABLE public.marques_voitures (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des modèles de voitures
CREATE TABLE public.modeles_voitures (
  id SERIAL PRIMARY KEY,
  marque_id INTEGER NOT NULL REFERENCES public.marques_voitures(id) ON DELETE CASCADE,
  nom VARCHAR(100) NOT NULL,
  annee_debut INTEGER NOT NULL,
  annee_fin INTEGER,
  dimensions_pneus TEXT[] NOT NULL, -- Array des dimensions compatibles ex: ['205/55R16', '225/50R17']
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(marque_id, nom, annee_debut)
);

-- Enable RLS
ALTER TABLE public.marques_voitures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modeles_voitures ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour lecture publique
CREATE POLICY "Lecture publique des marques de voitures" 
ON public.marques_voitures 
FOR SELECT 
USING (true);

CREATE POLICY "Lecture publique des modèles de voitures" 
ON public.modeles_voitures 
FOR SELECT 
USING (true);

-- Politiques pour les admins
CREATE POLICY "Admins peuvent gérer les marques de voitures" 
ON public.marques_voitures 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins peuvent gérer les modèles de voitures" 
ON public.modeles_voitures 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Insérer quelques marques populaires
INSERT INTO public.marques_voitures (nom) VALUES 
('Renault'),
('Peugeot'),
('Citroën'),
('BMW'),
('Mercedes-Benz'),
('Audi'),
('Volkswagen'),
('Ford'),
('Opel'),
('Toyota'),
('Nissan'),
('Hyundai'),
('Kia'),
('Seat'),
('Skoda');

-- Insérer quelques modèles populaires avec leurs dimensions
INSERT INTO public.modeles_voitures (marque_id, nom, annee_debut, annee_fin, dimensions_pneus) VALUES 
-- Renault
((SELECT id FROM public.marques_voitures WHERE nom = 'Renault'), 'Clio', 2019, NULL, ARRAY['195/65R15', '205/55R16', '215/45R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Renault'), 'Megane', 2020, NULL, ARRAY['205/60R16', '225/45R17', '225/40R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Renault'), 'Captur', 2019, NULL, ARRAY['205/60R16', '215/55R17']),

-- Peugeot
((SELECT id FROM public.marques_voitures WHERE nom = 'Peugeot'), '208', 2019, NULL, ARRAY['185/65R15', '195/55R16', '205/45R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Peugeot'), '308', 2021, NULL, ARRAY['205/55R16', '225/45R17', '225/40R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Peugeot'), '3008', 2020, NULL, ARRAY['215/65R17', '225/55R18', '235/50R19']),

-- BMW
((SELECT id FROM public.marques_voitures WHERE nom = 'BMW'), 'Série 3', 2019, NULL, ARRAY['205/60R16', '225/50R17', '225/45R18', '245/40R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'BMW'), 'X3', 2020, NULL, ARRAY['245/55R17', '245/50R18', '275/40R20']),

-- Volkswagen
((SELECT id FROM public.marques_voitures WHERE nom = 'Volkswagen'), 'Golf', 2019, NULL, ARRAY['195/65R15', '205/55R16', '225/45R17', '225/40R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Volkswagen'), 'Tiguan', 2020, NULL, ARRAY['215/65R17', '235/55R18', '255/45R19']);

-- Créer des index pour la performance
CREATE INDEX idx_modeles_marque_id ON public.modeles_voitures(marque_id);
CREATE INDEX idx_modeles_dimensions ON public.modeles_voitures USING GIN(dimensions_pneus);