-- Ajouter plus de modèles pour chaque marque

-- Renault - modèles supplémentaires
INSERT INTO public.modeles_voitures (marque_id, nom, annee_debut, annee_fin, dimensions_pneus) VALUES 
((SELECT id FROM public.marques_voitures WHERE nom = 'Renault'), 'Twingo', 2019, NULL, ARRAY['165/70R14', '185/55R15']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Renault'), 'Scenic', 2020, NULL, ARRAY['205/60R16', '215/55R17', '225/45R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Renault'), 'Kadjar', 2019, NULL, ARRAY['215/60R17', '225/55R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Renault'), 'Talisman', 2020, NULL, ARRAY['225/55R17', '235/45R18', '245/40R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Renault'), 'Arkana', 2021, NULL, ARRAY['215/60R17', '225/55R18']),

-- Peugeot - modèles supplémentaires
((SELECT id FROM public.marques_voitures WHERE nom = 'Peugeot'), '2008', 2020, NULL, ARRAY['205/60R16', '215/55R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Peugeot'), '508', 2019, NULL, ARRAY['225/55R17', '235/45R18', '245/40R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Peugeot'), '5008', 2021, NULL, ARRAY['215/65R17', '225/55R18', '235/50R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Peugeot'), '108', 2018, NULL, ARRAY['165/70R14', '175/65R14']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Peugeot'), 'Partner', 2019, NULL, ARRAY['195/65R15', '205/60R16']),

-- Citroën - nouveaux modèles
((SELECT id FROM public.marques_voitures WHERE nom = 'Citroën'), 'C3', 2020, NULL, ARRAY['185/65R15', '195/55R16', '205/45R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Citroën'), 'C4', 2021, NULL, ARRAY['205/55R16', '225/45R17', '225/40R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Citroën'), 'C5 Aircross', 2019, NULL, ARRAY['215/65R17', '225/55R18', '235/50R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Citroën'), 'Berlingo', 2019, NULL, ARRAY['195/65R15', '205/60R16']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Citroën'), 'C1', 2018, NULL, ARRAY['165/70R14', '175/65R14']),

-- BMW - modèles supplémentaires
((SELECT id FROM public.marques_voitures WHERE nom = 'BMW'), 'Série 1', 2020, NULL, ARRAY['195/55R16', '205/50R17', '225/45R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'BMW'), 'Série 5', 2019, NULL, ARRAY['225/55R17', '245/45R18', '275/40R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'BMW'), 'X1', 2020, NULL, ARRAY['225/55R17', '225/50R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'BMW'), 'X5', 2019, NULL, ARRAY['255/55R18', '275/45R19', '315/35R20']),
((SELECT id FROM public.marques_voitures WHERE nom = 'BMW'), 'i3', 2019, 2022, ARRAY['155/70R19', '175/60R19']),

-- Mercedes-Benz - nouveaux modèles
((SELECT id FROM public.marques_voitures WHERE nom = 'Mercedes-Benz'), 'Classe A', 2019, NULL, ARRAY['205/60R16', '225/45R17', '225/40R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Mercedes-Benz'), 'Classe C', 2021, NULL, ARRAY['225/55R17', '245/45R18', '245/40R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Mercedes-Benz'), 'GLA', 2020, NULL, ARRAY['215/60R17', '235/50R18', '235/45R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Mercedes-Benz'), 'GLC', 2019, NULL, ARRAY['235/60R17', '235/55R18', '255/45R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Mercedes-Benz'), 'Classe E', 2020, NULL, ARRAY['225/55R17', '245/45R18', '275/35R19']),

-- Audi - nouveaux modèles
((SELECT id FROM public.marques_voitures WHERE nom = 'Audi'), 'A3', 2020, NULL, ARRAY['205/60R16', '225/45R17', '225/40R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Audi'), 'A4', 2019, NULL, ARRAY['225/55R17', '245/45R18', '245/40R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Audi'), 'Q3', 2020, NULL, ARRAY['215/60R17', '235/50R18', '235/45R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Audi'), 'Q5', 2021, NULL, ARRAY['235/60R17', '235/55R18', '255/45R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Audi'), 'A1', 2019, NULL, ARRAY['185/60R15', '195/55R16', '215/45R16']),

-- Volkswagen - modèles supplémentaires
((SELECT id FROM public.marques_voitures WHERE nom = 'Volkswagen'), 'Polo', 2019, NULL, ARRAY['185/65R15', '195/55R16', '215/45R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Volkswagen'), 'Passat', 2020, NULL, ARRAY['215/60R16', '235/45R17', '235/40R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Volkswagen'), 'T-Cross', 2019, NULL, ARRAY['195/60R16', '215/55R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Volkswagen'), 'T-Roc', 2020, NULL, ARRAY['215/60R17', '225/50R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Volkswagen'), 'Arteon', 2021, NULL, ARRAY['235/45R18', '255/35R19']),

-- Ford - nouveaux modèles
((SELECT id FROM public.marques_voitures WHERE nom = 'Ford'), 'Fiesta', 2019, NULL, ARRAY['185/60R15', '195/55R16', '205/45R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Ford'), 'Focus', 2020, NULL, ARRAY['205/60R16', '225/45R17', '235/40R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Ford'), 'Kuga', 2021, NULL, ARRAY['215/65R17', '235/55R18', '235/50R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Ford'), 'Puma', 2020, NULL, ARRAY['195/60R17', '215/50R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Ford'), 'Mondeo', 2019, NULL, ARRAY['215/60R16', '235/45R17', '235/40R18']),

-- Toyota - nouveaux modèles
((SELECT id FROM public.marques_voitures WHERE nom = 'Toyota'), 'Yaris', 2020, NULL, ARRAY['175/65R15', '185/60R15', '195/50R16']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Toyota'), 'Corolla', 2019, NULL, ARRAY['195/65R15', '205/55R16', '225/45R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Toyota'), 'RAV4', 2020, NULL, ARRAY['225/65R17', '235/55R18', '235/55R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Toyota'), 'C-HR', 2019, NULL, ARRAY['215/60R17', '225/50R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Toyota'), 'Camry', 2021, NULL, ARRAY['215/60R16', '235/45R18']),

-- Nissan - nouveaux modèles
((SELECT id FROM public.marques_voitures WHERE nom = 'Nissan'), 'Micra', 2019, NULL, ARRAY['175/65R15', '185/55R16']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Nissan'), 'Qashqai', 2021, NULL, ARRAY['215/65R17', '225/55R18', '235/50R19']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Nissan'), 'Juke', 2020, NULL, ARRAY['205/60R16', '215/55R17']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Nissan'), 'X-Trail', 2019, NULL, ARRAY['225/65R17', '225/60R18']),
((SELECT id FROM public.marques_voitures WHERE nom = 'Nissan'), 'Leaf', 2020, NULL, ARRAY['205/55R16', '215/50R17']);