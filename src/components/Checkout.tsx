import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Truck, CheckCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: user?.email || '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: ''
  });

  if (!user || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Accès non autorisé</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Vous devez être connecté et avoir des articles dans votre panier.</p>
            <Button asChild>
              <Link to="/cart">Retour au panier</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shippingCost = cartTotal >= 300 ? 0 : 15;
  const finalTotal = cartTotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Créer la commande
      const { data: commande, error: commandeError } = await supabase
        .from('commandes')
        .insert({
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          adresse: `${formData.adresse}, ${formData.ville} ${formData.codePostal}`,
          total: finalTotal,
          statut: 'en_attente',
          user_id: user.id  // Link order to authenticated user
        })
        .select()
        .single();

      if (commandeError) throw commandeError;

      // Créer les détails de commande
      const commandeDetails = cartItems.map(item => ({
        commande_id: commande.id,
            produit_id: item.produit_id,
            quantite: item.quantite,
            prix_unitaire: item.produit.prix_vente
      }));

      const { error: detailsError } = await supabase
        .from('commande_details')
        .insert(commandeDetails);

      if (detailsError) throw detailsError;

      // Vider le panier
      await clearCart();

      toast({
        title: "Commande confirmée !",
        description: `Votre commande #${commande.id} a été enregistrée avec succès.`,
      });

      // Rediriger vers une page de confirmation
      navigate('/order-success', { 
        state: { 
          orderId: commande.id,
          total: finalTotal 
        } 
      });

    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la commande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au panier
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Finaliser ma commande</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire de commande */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Informations de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom complet *</Label>
                      <Input
                        id="nom"
                        name="nom"
                        type="text"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse *</Label>
                    <Input
                      id="adresse"
                      name="adresse"
                      type="text"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ville">Ville *</Label>
                      <Input
                        id="ville"
                        name="ville"
                        type="text"
                        value={formData.ville}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codePostal">Code postal *</Label>
                      <Input
                        id="codePostal"
                        name="codePostal"
                        type="text"
                        value={formData.codePostal}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Mode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">Paiement à la livraison</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vous payerez en espèces lors de la livraison de votre commande.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé de commande */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Articles */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <img
                        src={item.pneu.image_url || '/placeholder.svg'}
                        alt={`${item.pneu.marque} ${item.pneu.modele}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {item.pneu.marque} {item.pneu.modele}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.pneu.dimensions}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">Qty: {item.quantite}</Badge>
                          <span className="text-sm font-medium">{item.pneu.prix.toFixed(3)} TND</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {(item.pneu.prix * item.quantite).toFixed(3)} TND
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totaux */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{cartTotal.toFixed(3)} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{shippingCost === 0 ? "Gratuite" : `${shippingCost.toFixed(3)} TND`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(3)} TND</span>
                  </div>
                </div>

                {cartTotal >= 300 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Livraison gratuite activée !</span>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Traitement en cours...
                    </div>
                  ) : (
                    `Confirmer la commande - ${finalTotal.toFixed(3)} TND`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;