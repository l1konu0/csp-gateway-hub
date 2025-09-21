-- Mettre à jour la fonction handle_new_user pour gérer les types de compte
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Créer le profil avec le type de compte
  INSERT INTO public.profiles (
    id, 
    nom, 
    prenom, 
    type_compte,
    raison_sociale,
    siret,
    secteur_activite
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'nom',
    NEW.raw_user_meta_data ->> 'prenom',
    COALESCE((NEW.raw_user_meta_data ->> 'type_compte')::type_compte, 'particulier'),
    NEW.raw_user_meta_data ->> 'raison_sociale',
    NEW.raw_user_meta_data ->> 'siret',
    NEW.raw_user_meta_data ->> 'secteur_activite'
  );
  
  -- Assigner le rôle client par défaut
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

-- Ajouter le trigger s'il n'existe pas déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();