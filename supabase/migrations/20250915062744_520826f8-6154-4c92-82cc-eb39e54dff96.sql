-- Vider la table pneus existante et ajouter des données réalistes
DELETE FROM public.pneus;

-- Insérer des données complètes de pneus avec références CSP
INSERT INTO public.pneus (marque, modele, dimensions, type, prix, stock, description, image_url) VALUES
-- Michelin
('Michelin', 'Pilot Sport 4', '225/45R17', 'Été', 180.00, 25, 'Pneu sport haute performance pour une conduite sportive', '/images/michelin-pilot-sport.jpg'),
('Michelin', 'CrossClimate 2', '205/55R16', 'Toutes saisons', 145.00, 40, 'Pneu toutes saisons avec excellente adhérence', '/images/michelin-crossclimate.jpg'),
('Michelin', 'Primacy 4', '215/60R16', 'Été', 125.00, 35, 'Pneu tourisme confort et sécurité', '/images/michelin-primacy.jpg'),
('Michelin', 'Alpin 6', '195/65R15', 'Hiver', 110.00, 20, 'Pneu hiver haute performance', '/images/michelin-alpin.jpg'),
('Michelin', 'Energy Saver+', '185/65R15', 'Été', 95.00, 30, 'Pneu économique faible résistance au roulement', '/images/michelin-energy.jpg'),

-- Bridgestone
('Bridgestone', 'Potenza S001', '245/40R18', 'Été', 220.00, 15, 'Pneu sport ultra haute performance', '/images/bridgestone-potenza.jpg'),
('Bridgestone', 'Turanza T005', '225/50R17', 'Été', 165.00, 28, 'Pneu premium confort et performance', '/images/bridgestone-turanza.jpg'),
('Bridgestone', 'Ecopia EP422 Plus', '195/65R15', 'Été', 85.00, 45, 'Pneu éco-responsable longue durée', '/images/bridgestone-ecopia.jpg'),
('Bridgestone', 'Blizzak LM005', '205/55R16', 'Hiver', 135.00, 22, 'Pneu hiver nouvelle génération', '/images/bridgestone-blizzak.jpg'),
('Bridgestone', 'DriveGuard', '225/45R17', 'Été', 155.00, 18, 'Pneu run-flat anti-crevaison', '/images/bridgestone-driveguard.jpg'),

-- Continental
('Continental', 'PremiumContact 6', '225/55R17', 'Été', 170.00, 32, 'Pneu premium sécurité et performance', '/images/continental-premium.jpg'),
('Continental', 'WinterContact TS 860', '195/65R15', 'Hiver', 120.00, 25, 'Pneu hiver confiance et contrôle', '/images/continental-winter.jpg'),
('Continental', 'EcoContact 6', '185/60R15', 'Été', 90.00, 38, 'Pneu écologique haute efficacité', '/images/continental-eco.jpg'),
('Continental', 'SportContact 6', '255/35R19', 'Été', 280.00, 12, 'Pneu sport extrême performance', '/images/continental-sport.jpg'),
('Continental', 'AllSeasonContact', '205/55R16', 'Toutes saisons', 140.00, 26, 'Pneu toutes saisons polyvalent', '/images/continental-allseason.jpg'),

-- Pirelli
('Pirelli', 'P Zero', '245/45R18', 'Été', 250.00, 14, 'Pneu sport prestige haute performance', '/images/pirelli-pzero.jpg'),
('Pirelli', 'Cinturato P7', '225/50R17', 'Été', 160.00, 29, 'Pneu green performance écologique', '/images/pirelli-cinturato.jpg'),
('Pirelli', 'Sottozero 3', '215/55R17', 'Hiver', 145.00, 21, 'Pneu hiver premium contrôle total', '/images/pirelli-sottozero.jpg'),
('Pirelli', 'Scorpion Verde', '235/60R18', 'Été', 185.00, 16, 'Pneu SUV éco-performance', '/images/pirelli-scorpion.jpg'),
('Pirelli', 'P1 Cinturato Verde', '195/65R15', 'Été', 100.00, 35, 'Pneu écologique abordable', '/images/pirelli-p1.jpg'),

-- Dunlop
('Dunlop', 'Sport Maxx RT2', '225/45R17', 'Été', 150.00, 24, 'Pneu sport performance équilibrée', '/images/dunlop-sportmaxx.jpg'),
('Dunlop', 'BluResponse', '205/55R16', 'Été', 110.00, 33, 'Pneu éco-efficient sécurité renforcée', '/images/dunlop-blue.jpg'),
('Dunlop', 'Winter Sport 5', '195/65R15', 'Hiver', 105.00, 27, 'Pneu hiver sécurité optimale', '/images/dunlop-winter.jpg'),
('Dunlop', 'Grandtrek PT3', '225/65R17', 'Été', 130.00, 19, 'Pneu SUV polyvalent et durable', '/images/dunlop-grandtrek.jpg'),
('Dunlop', 'StreetResponse 2', '185/65R15', 'Été', 75.00, 42, 'Pneu économique ville et route', '/images/dunlop-street.jpg'),

-- Goodyear
('Goodyear', 'Eagle F1 Asymmetric 5', '235/45R18', 'Été', 200.00, 17, 'Pneu sport technologie avancée', '/images/goodyear-eagle.jpg'),
('Goodyear', 'EfficientGrip Performance 2', '215/55R17', 'Été', 135.00, 31, 'Pneu performance durée de vie prolongée', '/images/goodyear-efficient.jpg'),
('Goodyear', 'UltraGrip Performance+', '205/55R16', 'Hiver', 125.00, 23, 'Pneu hiver adhérence maximale', '/images/goodyear-ultra.jpg'),
('Goodyear', 'Vector 4Seasons Gen-3', '195/65R15', 'Toutes saisons', 115.00, 28, 'Pneu 4 saisons dernière génération', '/images/goodyear-vector.jpg'),
('Goodyear', 'Assurance TripleMax 2', '185/60R15', 'Été', 85.00, 36, 'Pneu sécurité triple protection', '/images/goodyear-assurance.jpg');

-- Mettre à jour les timestamps
UPDATE public.pneus SET updated_at = NOW();