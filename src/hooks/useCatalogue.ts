import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Categorie = {
  id: number;
  code: string;
  nom: string;
  description: string | null;
  created_at: string;
};

export type ProduitCatalogue = {
  id: number;
  code: number;
  categorie_id: number;
  designation: string;
  stock_reel: number;
  stock_disponible: number;
  prix_achat: number;
  prix_moyen_achat: number;
  prix_vente: number;
  valeur_stock: number;
  taux_tva: number;
  coefficient: number;
  actif: boolean;
  created_at: string;
  updated_at: string;
  categories?: Categorie;
};

// Hook pour récupérer toutes les catégories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("code", { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Categorie[];
    },
  });
};

// Hook pour récupérer tous les produits avec leurs catégories (pour l'administration)
export const useProduitsCatalogue = () => {
  return useQuery({
    queryKey: ["catalogue-produits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalogue_produits")
        .select(`
          *,
          categories (
            id,
            code,
            nom,
            description
          )
        `)
        .eq("actif", true)
        .order("code", { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as ProduitCatalogue[];
    },
  });
};

// Hook pour récupérer les produits côté client (filtre stock > 0)
export const useProduitsCatalogueClient = () => {
  return useQuery({
    queryKey: ["catalogue-produits-client"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalogue_produits")
        .select(`
          *,
          categories (
            id,
            code,
            nom,
            description
          )
        `)
        .eq("actif", true)
        .gt("stock_disponible", 0) // Filtrer les produits avec stock > 0
        .order("code", { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as ProduitCatalogue[];
    },
  });
};

// Hook pour récupérer les produits par catégorie
export const useProduitsParCategorie = (categorieCode?: string) => {
  return useQuery({
    queryKey: ["catalogue-produits", "categorie", categorieCode],
    queryFn: async () => {
      let query = supabase
        .from("catalogue_produits")
        .select(`
          *,
          categories (
            id,
            code,
            nom,
            description
          )
        `)
        .eq("actif", true)
        .gt("stock_disponible", 0) // Filtrer les produits avec stock > 0
        .order("designation", { ascending: true });
      
      if (categorieCode && categorieCode !== "TOUS") {
        query = query.eq("categories.code", categorieCode);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as ProduitCatalogue[];
    },
  });
};

// Hook pour rechercher des produits
export const useRechercherProduits = (searchQuery?: string, categorieCode?: string) => {
  return useQuery({
    queryKey: ["catalogue-produits", "search", searchQuery, categorieCode],
    queryFn: async () => {
      let query = supabase
        .from("catalogue_produits")
        .select(`
          *,
          categories (
            id,
            code,
            nom,
            description
          )
        `)
        .eq("actif", true)
        .gt("stock_disponible", 0) // Filtrer les produits avec stock > 0
        .order("designation", { ascending: true });
      
      // Filtrer par catégorie si spécifiée
      if (categorieCode && categorieCode !== "TOUS") {
        query = query.eq("categories.code", categorieCode);
      }
      
      // Ajouter la recherche textuelle si spécifiée
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        query = query.textSearch("designation", searchTerm, {
          type: "websearch",
          config: "french"
        });
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as ProduitCatalogue[];
    },
  });
};

// Hook pour ajouter un produit
export const useAjouterProduit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (produit: Omit<ProduitCatalogue, 'id' | 'created_at' | 'updated_at' | 'categories'>) => {
      const { data, error } = await supabase
        .from("catalogue_produits")
        .insert([produit])
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogue-produits"] });
    },
  });
};

// Hook pour mettre à jour un produit
export const useMettreAJourProduit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProduitCatalogue> & { id: number }) => {
      const { data, error } = await supabase
        .from("catalogue_produits")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogue-produits"] });
    },
  });
};