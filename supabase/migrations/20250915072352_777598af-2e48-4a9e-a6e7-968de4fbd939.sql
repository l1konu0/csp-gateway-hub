-- Fonction pour promouvoir un utilisateur au rang d'administrateur
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Trouver l'ID de l'utilisateur par email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    -- Vérifier si l'utilisateur existe
    IF target_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Ajouter ou mettre à jour le rôle admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN true;
END;
$$;