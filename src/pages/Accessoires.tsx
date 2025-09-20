import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';
import { useProduitsParCategorie } from '@/hooks/useCatalogue';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

const Accessoires = () => {
  const { data: accessoires = [], isLoading } = useProduitsParCategorie('ACC');
  const { addToCart } = useCart();

  const handleAddToCart = (produit: any) => {
    // Pour les accessoires, on utilise un ID factice basé sur le code
    const pneuId = produit.code || produit.id;
    addToCart({ pneuId, quantite: 1 });
    toast.success(`${produit.designation} ajouté au panier`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Chargement des accessoires...</div>
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
            Accessoires Auto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Équipez votre véhicule avec nos accessoires de qualité : confort, sécurité et style garantis.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              {accessoires.length} accessoire(s) disponible(s)
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {accessoires.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Aucun accessoire disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {accessoires.map((accessoire) => (
                <Card key={accessoire.id} className="group hover:shadow-lg transition-all duration-300 border-border">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src="/images/accessoire-default.jpg" 
                        alt={accessoire.designation}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Code: {accessoire.code}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-accent">Stock: {accessoire.stock_disponible}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">4.6</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {accessoire.designation}
                    </CardTitle>
                    
                    <CardDescription className="mb-4">
                      {accessoire.categories?.description || "Accessoire automobile de qualité"}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{accessoire.prix_vente} TND</span>
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleAddToCart(accessoire)}
                        disabled={accessoire.stock_disponible === 0}
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
            <h2 className="text-3xl font-bold mb-4">Nos garanties accessoires</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold mb-2">Qualité garantie</h3>
              <p className="text-muted-foreground">Accessoires certifiés et testés pour votre sécurité</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold mb-2">Livraison rapide</h3>
              <p className="text-muted-foreground">Livraison gratuite dès 300 TND d'achat</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold mb-2">Installation offerte</h3>
              <p className="text-muted-foreground">Installation gratuite pour certains accessoires</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Accessoires;