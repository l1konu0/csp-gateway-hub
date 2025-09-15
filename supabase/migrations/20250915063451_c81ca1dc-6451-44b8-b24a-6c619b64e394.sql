-- Mettre à jour les URLs d'images avec les nouvelles images générées
UPDATE public.pneus SET image_url = '/images/michelin-pilot-sport.jpg' WHERE marque = 'Michelin' AND modele = 'Pilot Sport 4';
UPDATE public.pneus SET image_url = '/images/michelin-crossclimate.jpg' WHERE marque = 'Michelin' AND modele = 'CrossClimate 2';
UPDATE public.pneus SET image_url = '/images/bridgestone-potenza.jpg' WHERE marque = 'Bridgestone' AND modele = 'Potenza S001';
UPDATE public.pneus SET image_url = '/images/continental-premium.jpg' WHERE marque = 'Continental' AND modele = 'PremiumContact 6';
UPDATE public.pneus SET image_url = '/images/pirelli-pzero.jpg' WHERE marque = 'Pirelli' AND modele = 'P Zero';
UPDATE public.pneus SET image_url = '/images/goodyear-eagle.jpg' WHERE marque = 'Goodyear' AND modele = 'Eagle F1 Asymmetric 5';