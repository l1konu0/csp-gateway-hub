-- Ajouter les nouvelles catégories pour Lubrifiants et Accessoires
INSERT INTO public.categories (nom, code, description) VALUES
('Lubrifiants', 'LUBR', 'Huiles moteur, liquides de refroidissement et autres lubrifiants automobiles'),
('Accessoires', 'ACC', 'Accessoires et équipements pour véhicules automobiles')
ON CONFLICT (code) DO NOTHING;

-- Ajouter quelques produits d'exemple pour les lubrifiants
INSERT INTO public.catalogue_produits (
  code, categorie_id, designation, prix_vente, stock_reel, stock_disponible, actif
) VALUES
  (
    50001, 
    (SELECT id FROM public.categories WHERE code = 'LUBR'),
    'Huile Moteur 5W30 Synthétique Castrol - 5L',
    45.00,
    50,
    50,
    true
  ),
  (
    50002,
    (SELECT id FROM public.categories WHERE code = 'LUBR'),
    'Huile Moteur 10W40 Semi-Synthétique Shell - 4L',
    38.00,
    30,
    30,
    true
  ),
  (
    50003,
    (SELECT id FROM public.categories WHERE code = 'LUBR'),
    'Liquide de Refroidissement Total - 2L',
    25.00,
    40,
    40,
    true
  ),
  (
    50004,
    (SELECT id FROM public.categories WHERE code = 'LUBR'),
    'Huile de Boîte de Vitesse Mobil - 2L',
    55.00,
    20,
    20,
    true
  )
ON CONFLICT (code) DO NOTHING;

-- Ajouter quelques produits d'exemple pour les accessoires
INSERT INTO public.catalogue_produits (
  code, categorie_id, designation, prix_vente, stock_reel, stock_disponible, actif
) VALUES
  (
    60001,
    (SELECT id FROM public.categories WHERE code = 'ACC'),
    'Tapis de Sol Universels WeatherTech',
    85.00,
    25,
    25,
    true
  ),
  (
    60002,
    (SELECT id FROM public.categories WHERE code = 'ACC'),
    'Housse de Protection Voiture Covercraft',
    120.00,
    15,
    15,
    true
  ),
  (
    60003,
    (SELECT id FROM public.categories WHERE code = 'ACC'),
    'Kit de Nettoyage Auto Chemical Guys',
    65.00,
    35,
    35,
    true
  ),
  (
    60004,
    (SELECT id FROM public.categories WHERE code = 'ACC'),
    'Organisateur de Coffre AutoExec',
    45.00,
    20,
    20,
    true
  ),
  (
    60005,
    (SELECT id FROM public.categories WHERE code = 'ACC'),
    'Chargeur Allume-Cigare USB Anker',
    35.00,
    50,
    50,
    true
  ),
  (
    60006,
    (SELECT id FROM public.categories WHERE code = 'ACC'),
    'Support Téléphone Magnétique Spigen',
    28.00,
    40,
    40,
    true
  )
ON CONFLICT (code) DO NOTHING;