import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Pneu = {
  id: number;
  marque: string;
  modele: string;
  dimensions: string;
  type: string;
  prix: number;
  stock: number;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export const usePneus = () => {
  return useQuery({
    queryKey: ["pneus"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pneus")
        .select("*")
        .order("marque", { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Pneu[];
    },
  });
};

export const usePneusByMarque = (marque?: string) => {
  return useQuery({
    queryKey: ["pneus", marque],
    queryFn: async () => {
      let query = supabase
        .from("pneus")
        .select("*")
        .order("modele", { ascending: true });
      
      if (marque && marque !== "Toutes") {
        query = query.eq("marque", marque);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Pneu[];
    },
  });
};

export const usePneusSearch = (searchQuery?: string, marque?: string) => {
  return useQuery({
    queryKey: ["pneus", "search", searchQuery, marque],
    queryFn: async () => {
      let query = supabase
        .from("pneus")
        .select("*")
        .order("marque", { ascending: true });
      
      // Filtrer par marque si spécifiée
      if (marque && marque !== "Toutes") {
        query = query.eq("marque", marque);
      }
      
      // Ajouter la recherche textuelle si spécifiée
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = searchQuery.trim().toLowerCase();
        query = query.or(`marque.ilike.%${searchTerm}%,modele.ilike.%${searchTerm}%,dimensions.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Pneu[];
    },
  });
};

// Hook pour récupérer les pneus compatibles avec des dimensions spécifiques
export const usePneusCompatibles = (dimensions: string[]) => {
  return useQuery({
    queryKey: ['pneus-compatibles', dimensions],
    queryFn: async (): Promise<Pneu[]> => {
      if (!dimensions || dimensions.length === 0) return [];

      const { data, error } = await supabase
        .from('pneus')
        .select('*')
        .in('dimensions', dimensions)
        .order('marque', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: dimensions && dimensions.length > 0,
  });
};