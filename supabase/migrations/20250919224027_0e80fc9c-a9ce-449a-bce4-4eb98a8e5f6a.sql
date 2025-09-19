-- Ajouter les colonnes pour la facturation
ALTER TABLE public.commandes 
ADD COLUMN numero_facture character varying UNIQUE,
ADD COLUMN date_facture timestamp with time zone,
ADD COLUMN facture_generee boolean DEFAULT false;

-- Fonction pour générer un numéro de facture unique
CREATE OR REPLACE FUNCTION public.generer_numero_facture()
RETURNS character varying
LANGUAGE plpgsql
AS $$
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
$$;

-- Fonction pour générer une facture pour une commande
CREATE OR REPLACE FUNCTION public.generer_facture_commande(commande_id integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    nouveau_numero character varying;
BEGIN
    -- Vérifier si la commande existe et n'a pas déjà de facture
    IF NOT EXISTS (
        SELECT 1 FROM public.commandes 
        WHERE id = commande_id AND facture_generee = false
    ) THEN
        RETURN false;
    END IF;
    
    -- Générer le numéro de facture
    nouveau_numero := generer_numero_facture();
    
    -- Mettre à jour la commande
    UPDATE public.commandes 
    SET 
        numero_facture = nouveau_numero,
        date_facture = now(),
        facture_generee = true
    WHERE id = commande_id;
    
    RETURN true;
END;
$$;