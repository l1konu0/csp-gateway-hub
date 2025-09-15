-- Mettre à jour toutes les URLs d'images pour pointer vers les images existantes
-- Pour les produits qui n'ont pas d'image spécifique, on utilise une image générale

UPDATE public.pneus SET image_url = CASE 
  WHEN marque = 'Michelin' AND modele = 'Pilot Sport 4' THEN '/images/michelin-pilot-sport.jpg'
  WHEN marque = 'Michelin' AND modele = 'CrossClimate 2' THEN '/images/michelin-crossclimate.jpg'
  WHEN marque = 'Bridgestone' AND modele = 'Potenza S001' THEN '/images/bridgestone-potenza.jpg'
  WHEN marque = 'Continental' AND modele = 'PremiumContact 6' THEN '/images/continental-premium.jpg'
  WHEN marque = 'Pirelli' AND modele = 'P Zero' THEN '/images/pirelli-pzero.jpg'
  WHEN marque = 'Goodyear' AND modele = 'Eagle F1 Asymmetric 5' THEN '/images/goodyear-eagle.jpg'
  -- Pour les autres produits Michelin, utiliser l'image Pilot Sport
  WHEN marque = 'Michelin' THEN '/images/michelin-pilot-sport.jpg'
  -- Pour les autres produits Bridgestone, utiliser l'image Potenza
  WHEN marque = 'Bridgestone' THEN '/images/bridgestone-potenza.jpg'
  -- Pour les autres produits Continental, utiliser l'image Premium
  WHEN marque = 'Continental' THEN '/images/continental-premium.jpg'
  -- Pour les autres produits Pirelli, utiliser l'image P Zero
  WHEN marque = 'Pirelli' THEN '/images/pirelli-pzero.jpg'
  -- Pour les autres produits Goodyear, utiliser l'image Eagle
  WHEN marque = 'Goodyear' THEN '/images/goodyear-eagle.jpg'
  -- Pour les autres marques, garder l'image par défaut
  ELSE '/images/michelin-pilot-sport.jpg'
END;