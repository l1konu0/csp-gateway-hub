-- Créer la table des rendez-vous
CREATE TABLE public.rendez_vous (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  nom character varying NOT NULL,
  email character varying NOT NULL,
  telephone character varying,
  service character varying NOT NULL,
  date_rdv timestamp with time zone NOT NULL,
  heure_debut time NOT NULL,
  heure_fin time NOT NULL,
  statut character varying DEFAULT 'en_attente'::character varying,
  commentaire text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.rendez_vous ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les rendez-vous
CREATE POLICY "Utilisateurs peuvent créer des rendez-vous" 
ON public.rendez_vous 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Utilisateurs peuvent voir leurs rendez-vous" 
ON public.rendez_vous 
FOR SELECT 
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins peuvent modifier les rendez-vous" 
ON public.rendez_vous 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins peuvent supprimer les rendez-vous" 
ON public.rendez_vous 
FOR DELETE 
USING (is_admin());

-- Créer la table des services
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom character varying NOT NULL,
  description text,
  duree_minutes integer NOT NULL DEFAULT 60,
  prix numeric(10,2),
  actif boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS pour les services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les services
CREATE POLICY "Lecture publique des services" 
ON public.services 
FOR SELECT 
USING (actif = true);

CREATE POLICY "Admins peuvent gérer les services" 
ON public.services 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Insérer les services par défaut
INSERT INTO public.services (nom, description, duree_minutes, prix) VALUES
('Montage de pneu + valve + équilibrage', 'Montage complet des pneus avec valve neuve et équilibrage', 45, 25.00),
('Parallélisme', 'Réglage du parallélisme des roues', 30, 35.00),
('Vidange', 'Vidange moteur avec filtre à huile', 30, 45.00);

-- Trigger pour mise à jour automatique du timestamp
CREATE TRIGGER update_rendez_vous_updated_at
  BEFORE UPDATE ON public.rendez_vous
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();