-- Corriger le problème de sécurité critique : les détails de commandes ne doivent pas être publics
DROP POLICY IF EXISTS "Lecture publique des détails de commande" ON public.commande_details;

-- Permettre aux utilisateurs de voir seulement leurs propres détails de commande
CREATE POLICY "Utilisateurs peuvent voir leurs détails de commande" 
ON public.commande_details 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.commandes 
    WHERE commandes.id = commande_details.commande_id 
    AND commandes.user_id = auth.uid()
  )
  OR is_admin()
);

-- Corriger les fonctions sans search_path
CREATE OR REPLACE FUNCTION public.generer_numero_facture()
 RETURNS character varying
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
    new_number character varying;
    year_part character varying;
    sequence_part integer;
BEGIN
    -- Obtenir l'année courante
    year_part := to_char(now(), 'YYYY');
    
    -- Obtenir le prochain numéro de séquence pour cette année
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_facture FROM '\d+$') AS integer)), 0) + 1
    INTO sequence_part
    FROM public.commandes 
    WHERE numero_facture LIKE 'FAC' || year_part || '%';
    
    -- Formater le numéro de facture: FAC2025-0001
    new_number := 'FAC' || year_part || '-' || LPAD(sequence_part::text, 4, '0');
    
    RETURN new_number;
END;
$function$;