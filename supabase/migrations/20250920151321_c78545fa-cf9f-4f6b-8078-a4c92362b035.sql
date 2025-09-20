-- Corriger la dernière fonction sans search_path
CREATE OR REPLACE FUNCTION public.generer_facture_commande(commande_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Corriger les autres fonctions manquantes
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;