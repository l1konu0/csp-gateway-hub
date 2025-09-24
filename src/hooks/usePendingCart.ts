import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useCart } from './useCart';
import { useToast } from './use-toast';

export const usePendingCart = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Vérifier s'il y a un produit en attente dans localStorage
      const pendingItem = localStorage.getItem('pendingCartItem');
      
      if (pendingItem) {
        try {
          const { productId, productName, productPrice } = JSON.parse(pendingItem);
          
          // Ajouter le produit au panier
          addToCart({ produitId: parseInt(productId) });
          
          // Supprimer l'item en attente
          localStorage.removeItem('pendingCartItem');
          
          // Afficher une notification de succès
          toast({
            title: "Produit ajouté au panier !",
            description: `${productName} a été ajouté à votre panier.`,
          });
        } catch (error) {
          console.error('Erreur lors de l\'ajout du produit en attente:', error);
          localStorage.removeItem('pendingCartItem');
        }
      }
    }
  }, [user, addToCart, toast]);
};
