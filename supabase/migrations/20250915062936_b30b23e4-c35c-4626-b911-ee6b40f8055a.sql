-- Vider complètement la table d'abord
DELETE FROM public.pneus;

-- Supprimer toutes les contraintes existantes
ALTER TABLE public.pneus DROP CONSTRAINT IF EXISTS pneus_type_check;

-- Ajouter une nouvelle contrainte avec tous les types possibles
ALTER TABLE public.pneus ADD CONSTRAINT pneus_type_check 
CHECK (type IN ('Été', 'Hiver', 'Toutes saisons', 'Sport', 'Économique'));

-- Insérer des données complètes de pneus
INSERT INTO public.pneus (marque, modele, dimensions, type, prix, stock, description, image_url) VALUES
('Michelin', 'Pilot Sport 4', '225/45R17', 'Été', 180.00, 25, 'Pneu sport haute performance', '/images/michelin-pilot-sport.jpg'),
('Michelin', 'CrossClimate 2', '205/55R16', 'Toutes saisons', 145.00, 40, 'Pneu toutes saisons avec excellente adhérence', '/images/michelin-crossclimate.jpg'),
('Bridgestone', 'Potenza S001', '245/40R18', 'Sport', 220.00, 15, 'Pneu sport ultra haute performance', '/images/bridgestone-potenza.jpg'),
('Continental', 'PremiumContact 6', '225/55R17', 'Été', 170.00, 32, 'Pneu premium sécurité et performance', '/images/continental-premium.jpg'),
('Pirelli', 'P Zero', '245/45R18', 'Sport', 250.00, 14, 'Pneu sport prestige haute performance', '/images/pirelli-pzero.jpg'),
('Goodyear', 'Eagle F1 Asymmetric 5', '235/45R18', 'Sport', 200.00, 17, 'Pneu sport technologie avancée', '/images/goodyear-eagle.jpg');