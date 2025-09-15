import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, isLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Connexion requise</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Vous devez être connecté pour accéder à votre panier.</p>
            <Button asChild>
              <Link to="/auth">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement de votre panier...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Votre panier est vide</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Ajoutez des produits pour commencer vos achats.</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuer mes achats
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Mon Panier</h1>
          <Badge variant="secondary">{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.pneu.image_url || '/placeholder.svg'}
                        alt={`${item.pneu.marque} ${item.pneu.modele}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">
                        {item.pneu.marque} {item.pneu.modele}
                      </h3>
                      <p className="text-muted-foreground">{item.pneu.dimensions}</p>
                      <p className="font-semibold text-primary mt-1">
                        {item.pneu.prix.toFixed(2)} DT
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity({ itemId: item.id, quantite: item.quantite - 1 })}
                        disabled={item.quantite <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantite}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity({ itemId: item.id, quantite: item.quantite + 1 })}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {/* Item Total */}
                    <div className="text-right min-w-0">
                      <p className="font-semibold">
                        {(item.pneu.prix * item.quantite).toFixed(2)} DT
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{cartTotal.toFixed(2)} DT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{cartTotal >= 300 ? 'Gratuite' : '15.00 DT'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{(cartTotal + (cartTotal >= 300 ? 0 : 15)).toFixed(2)} DT</span>
                  </div>
                </div>

                {cartTotal < 300 && (
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                    <p>Ajoutez {(300 - cartTotal).toFixed(2)} DT pour bénéficier de la livraison gratuite !</p>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Procéder au paiement
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continuer mes achats
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;