import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MarqueVoiture {
  id: number;
  nom: string;
  logo_url?: string;
}

export interface ModeleVoiture {
  id: number;
  marque_id: number;
  nom: string;
  annee_debut: number;
  annee_fin?: number;
  dimensions_pneus: string[];
}

// Hook pour récupérer toutes les marques
export const useMarquesVoitures = () => {
  return useQuery({
    queryKey: ['marques-voitures'],
    queryFn: async (): Promise<MarqueVoiture[]> => {
      const { data, error } = await supabase
        .from('marques_voitures')
        .select('*')
        .order('nom');

      if (error) throw error;
      return data || [];
    },
  });
};

// Hook pour récupérer les modèles d'une marque
export const useModelesVoitures = (marqueId?: number) => {
  return useQuery({
    queryKey: ['modeles-voitures', marqueId],
    queryFn: async (): Promise<ModeleVoiture[]> => {
      if (!marqueId) return [];

      const { data, error } = await supabase
        .from('modeles_voitures')
        .select('*')
        .eq('marque_id', marqueId)
        .order('nom');

      if (error) throw error;
      return data || [];
    },
    enabled: !!marqueId,
  });
};

// Hook pour récupérer les années disponibles pour un modèle
export const useAnneesDisponibles = (modeleId?: number) => {
  return useQuery({
    queryKey: ['annees-disponibles', modeleId],
    queryFn: async (): Promise<number[]> => {
      if (!modeleId) return [];

      const { data, error } = await supabase
        .from('modeles_voitures')
        .select('annee_debut, annee_fin')
        .eq('id', modeleId)
        .single();

      if (error) throw error;
      if (!data) return [];

      const annees: number[] = [];
      const currentYear = new Date().getFullYear();
      const anneeFin = data.annee_fin || currentYear;
      
      for (let annee = data.annee_debut; annee <= anneeFin; annee++) {
        annees.push(annee);
      }
      
      return annees.reverse(); // Plus récentes en premier
    },
    enabled: !!modeleId,
  });
};

// Hook pour récupérer les dimensions compatibles avec un véhicule
export const useDimensionsCompatibles = (modeleId?: number) => {
  return useQuery({
    queryKey: ['dimensions-compatibles', modeleId],
    queryFn: async (): Promise<string[]> => {
      if (!modeleId) return [];

      const { data, error } = await supabase
        .from('modeles_voitures')
        .select('dimensions_pneus')
        .eq('id', modeleId)
        .single();

      if (error) throw error;
      return data?.dimensions_pneus || [];
    },
    enabled: !!modeleId,
  });
};