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