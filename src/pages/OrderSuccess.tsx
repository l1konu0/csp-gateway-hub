import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, ShoppingCart } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, total } = location.state || {};

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Commande introuvable</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Aucune information de commande disponible.</p>
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Commande confirmée !
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-lg">
                Merci pour votre commande. Votre commande a été enregistrée avec succès.
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold">Numéro de commande: <span className="text-primary">#{orderId}</span></p>
                <p className="font-semibold">Montant total: <span className="text-primary">{total?.toFixed(2)} DT</span></p>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <h3 className="font-semibold text-lg text-center">Prochaines étapes :</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Confirmation par email</p>
                    <p className="text-sm text-muted-foreground">
                      Vous recevrez un email de confirmation sous peu avec les détails de votre commande.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Préparation de votre commande</p>
                    <p className="text-sm text-muted-foreground">
                      Notre équipe va préparer vos pneus et organiser la livraison.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Livraison et installation</p>
                    <p className="text-sm text-muted-foreground">
                      Nous vous contacterons pour organiser la livraison et l'installation de vos pneus.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <p className="text-muted-foreground">
                Notre équipe vous contactera dans les prochaines 24h pour confirmer les détails de livraison.
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Retour à l'accueil
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Continuer mes achats
                  </Link>
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Pour toute question concernant votre commande, n'hésitez pas à nous contacter au{' '}
                <span className="font-medium">+216 XX XXX XXX</span> en mentionnant votre numéro de commande.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccess;