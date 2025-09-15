import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface CartItem {
  id: string;
  pneu_id: number;
  quantite: number;
  pneu: {
    id: number;
    marque: string;
    modele: string;
    dimensions: string;
    prix: number;
    image_url: string | null;
  };
}

export const useCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('panier')
        .select(`
          id,
          pneu_id,
          quantite,
          pneus (
            id,
            marque,
            modele,
            dimensions,
            prix,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        pneu_id: item.pneu_id,
        quantite: item.quantite,
        pneu: item.pneus as any
      })) as CartItem[];
    },
    enabled: !!user?.id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ pneuId, quantite = 1 }: { pneuId: number; quantite?: number }) => {
      if (!user?.id) throw new Error('Utilisateur non connecté');

      // Vérifier si le produit est déjà dans le panier
      const { data: existingItem } = await supabase
        .from('panier')
        .select('*')
        .eq('user_id', user.id)
        .eq('pneu_id', pneuId)
        .single();

      if (existingItem) {
        // Mettre à jour la quantité
        const { error } = await supabase
          .from('panier')
          .update({ quantite: existingItem.quantite + quantite })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Ajouter un nouvel item
        const { error } = await supabase
          .from('panier')
          .insert({
            user_id: user.id,
            pneu_id: pneuId,
            quantite
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Produit ajouté au panier",
        description: "Le produit a été ajouté à votre panier avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantite }: { itemId: string; quantite: number }) => {
      if (quantite <= 0) {
        const { error } = await supabase
          .from('panier')
          .delete()
          .eq('id', itemId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('panier')
          .update({ quantite })
          .eq('id', itemId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('panier')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré de votre panier.",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('panier')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
  });

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.pneu.prix * item.quantite);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantite, 0);

  return {
    cartItems,
    cartTotal,
    cartCount,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
};