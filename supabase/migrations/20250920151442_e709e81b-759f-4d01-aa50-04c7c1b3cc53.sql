-- Corriger toutes les fonctions restantes sans search_path
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Créer le profil
  INSERT INTO public.profiles (id, nom, prenom)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'nom',
    NEW.raw_user_meta_data ->> 'prenom'
  );
  
  -- Assigner le rôle client par défaut
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$function$;