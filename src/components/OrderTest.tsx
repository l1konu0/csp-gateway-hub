import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, TestTube } from 'lucide-react';

export const OrderTest = () => {
  const { user } = useAuth();
  const { addToCart, cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleAddTestProduct = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des produits au panier",
        variant: "destructive"
      });
      return;
    }

    // Ajouter un produit de test (utiliser un pneu existant)
    const testPneuId = 627; // BATTERIE L1D 45/360AH ASSAD avec stock disponible
    
    addToCart({ pneuId: testPneuId, quantite: 1 });
  };

  const handleTestOrder = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour passer une commande",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits au panier avant de passer commande",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Créer la commande
      const { data: commande, error: commandeError } = await supabase
        .from('commandes')
        .insert({
          user_id: user.id,
          nom: user.user_metadata?.nom || 'Test User',
          email: user.email || 'test@example.com',
          telephone: '01 23 45 67 89',
          adresse: '123 Rue de Test, 75001 Paris',
          total: cartTotal + 15, // +15€ de livraison
          statut: 'en_attente'
        })
        .select()
        .single();

      if (commandeError) throw commandeError;

      // Ajouter les détails de la commande
      const orderDetails = cartItems.map(item => ({
        commande_id: commande.id,
        pneu_id: item.pneu_id,
        quantite: item.quantite,
        prix_unitaire: item.pneu.prix
      }));

      const { error: detailsError } = await supabase
        .from('commande_details')
        .insert(orderDetails);

      if (detailsError) throw detailsError;

      // Vider le panier
      await clearCart();

      setOrderPlaced(true);
      toast({
        title: "Commande test réussie !",
        description: `Commande #${commande.id} créée avec succès`,
      });

    } catch (error: any) {
      console.error('Erreur lors du test de commande:', error);
      toast({
        title: "Erreur lors du test",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setOrderPlaced(false);
    clearCart();
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test de Commande
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Vous devez être connecté pour tester le système de commande.
          </p>
          <Button onClick={() => window.location.href = '/auth'} className="w-full">
            Se connecter
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Test de Commande
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!orderPlaced ? (
          <>
            <div className="text-sm text-muted-foreground">
              <p><strong>Utilisateur:</strong> {user.email}</p>
              <p><strong>Panier:</strong> {cartItems.length} produit(s)</p>
              <p><strong>Total:</strong> {(cartTotal + 15).toFixed(2)}€ (livraison incluse)</p>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleAddTestProduct}
                variant="outline" 
                className="w-full"
                disabled={loading}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ajouter un produit test
              </Button>

              <Button 
                onClick={handleTestOrder}
                disabled={loading || cartItems.length === 0}
                className="w-full"
              >
                {loading ? "Test en cours..." : "Tester une commande"}
              </Button>
            </div>

            {cartItems.length > 0 && (
              <div className="border rounded-lg p-3 bg-muted/50">
                <h4 className="font-medium mb-2">Produits dans le panier:</h4>
                {cartItems.map(item => (
                  <div key={item.id} className="text-sm">
                    <p>{item.pneu.marque} {item.pneu.modele}</p>
                    <p className="text-muted-foreground">
                      Qté: {item.quantite} × {item.pneu.prix}€
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-lg font-semibold">
              ✅ Test réussi !
            </div>
            <p className="text-sm text-muted-foreground">
              La commande a été créée avec succès. Le système fonctionne correctement.
            </p>
            <Button onClick={resetTest} variant="outline" className="w-full">
              Nouveau test
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};