import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';
import { useProduitsParCategorie } from '@/hooks/useCatalogue';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

const Lubrifiants = () => {
  const { data: lubrifiants = [], isLoading } = useProduitsParCategorie('LUBR');
  const { addToCart } = useCart();

  const handleAddToCart = (produit: any) => {
    // Pour les lubrifiants, on utilise un ID factice basé sur le code
    const pneuId = produit.code || produit.id;
    addToCart({ pneuId, quantite: 1 });
    toast.success(`${produit.designation} ajouté au panier`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Chargement des lubrifiants...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Lubrifiants Auto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Huiles moteur, liquides de refroidissement et lubrifiants de qualité supérieure pour l'entretien de votre véhicule.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {lubrifiants.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Aucun lubrifiant disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lubrifiants.map((lubrifiant) => (
                <Card key={lubrifiant.id} className="group hover:shadow-lg transition-all duration-300 border-border">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src="/images/huile-moteur-default.jpg" 
                        alt={lubrifiant.designation}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-accent">Code: {lubrifiant.code}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">4.7</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {lubrifiant.designation}
                    </CardTitle>
                    
                    <CardDescription className="mb-3">
                      {lubrifiant.categories?.description || "Lubrifiant de qualité supérieure"}
                    </CardDescription>
                    
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">En stock:</span>
                        <span className="font-medium">{lubrifiant.stock_disponible} unités</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{lubrifiant.prix_vente} TND</span>
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleAddToCart(lubrifiant)}
                        disabled={lubrifiant.stock_disponible === 0}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir nos lubrifiants ?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold mb-2">Protection maximale</h3>
              <p className="text-muted-foreground">Lubrifiants haute performance pour une protection optimale du moteur</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏭</span>
              </div>
              <h3 className="font-semibold mb-2">Marques reconnues</h3>
              <p className="text-muted-foreground">Castrol, Shell, Total, Mobil et autres grandes marques</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold mb-2">Conseil expert</h3>
              <p className="text-muted-foreground">Nos experts vous conseillent le lubrifiant adapté à votre véhicule</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Lubrifiants;