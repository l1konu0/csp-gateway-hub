-- Créer un bucket de stockage pour les images de pneus
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pneus-images', 'pneus-images', true);

-- Créer les politiques RLS pour le bucket pneus-images
CREATE POLICY "Images de pneus accessibles publiquement" ON storage.objects
FOR SELECT USING (bucket_id = 'pneus-images');

CREATE POLICY "Upload d'images de pneus autorisé" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'pneus-images');