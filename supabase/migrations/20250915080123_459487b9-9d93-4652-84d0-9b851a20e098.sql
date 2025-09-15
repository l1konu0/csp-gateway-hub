-- Corriger le problème de sécurité : accès public aux messages clients
-- PROBLÈME: La table messages est accessible publiquement avec des données sensibles

-- 1. Supprimer la politique de lecture publique dangereuse
DROP POLICY IF EXISTS "Lecture publique des messages" ON public.messages;

-- 2. Créer une politique de lecture sécurisée pour les admins uniquement
CREATE POLICY "Seuls les admins peuvent lire les messages" 
ON public.messages 
FOR SELECT 
USING (is_admin());

-- 3. Permettre aux admins de marquer les messages comme lus
CREATE POLICY "Seuls les admins peuvent modifier les messages" 
ON public.messages 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

-- 4. S'assurer que seuls les admins peuvent supprimer les messages
CREATE POLICY "Seuls les admins peuvent supprimer les messages" 
ON public.messages 
FOR DELETE 
USING (is_admin());

-- La politique d'insertion reste inchangée pour permettre aux visiteurs d'envoyer des messages
-- "Création des messages" avec WITH CHECK (true) est correcte