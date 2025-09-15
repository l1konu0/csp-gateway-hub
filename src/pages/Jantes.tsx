import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';

const Jantes = () => {
  const jantes = [
    {
      id: 1,
      name: "Jante Alliage 16\" Sport",
      brand: "CSP Premium",
      price: 180,
      originalPrice: 220,
      size: "16 x 7J",
      et: "ET38",
      pcd: "5x112",
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 45,
      inStock: true,
      isPromo: true
    },
    {
      id: 2,
      name: "Jante Alliage 17\" Elite",
      brand: "CSP Premium",
      price: 220,
      size: "17 x 7.5J",
      et: "ET45",
      pcd: "5x114.3",
      image: "/api/placeholder/300/300",
      rating: 4.7,
      reviews: 32,
      inStock: true,
      isPromo: false
    },
    {
      id: 3,
      name: "Jante Alliage 18\" Racing",
      brand: "CSP Premium",
      price: 280,
      size: "18 x 8J",
      et: "ET35",
      pcd: "5x120",
      image: "/api/placeholder/300/300",
      rating: 4.9,
      reviews: 28,
      inStock: true,
      isPromo: false
    },
    {
      id: 4,
      name: "Jante Tôle 15\" Standard",
      brand: "CSP Standard",
      price: 85,
      size: "15 x 6J",
      et: "ET45",
      pcd: "4x100",
      image: "/api/placeholder/300/300",
      rating: 4.3,
      reviews: 67,
      inStock: true,
      isPromo: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Jantes Auto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Jantes en alliage et tôle pour tous véhicules. Qualité garantie et montage professionnel.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {['Toutes', 'Alliage 15"', 'Alliage 16"', 'Alliage 17"', 'Alliage 18"', 'Tôle'].map((category) => (
              <Button key={category} variant="outline" className="bg-background">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jantes.map((jante) => (
              <Card key={jante.id} className="group hover:shadow-lg transition-all duration-300 border-border">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={jante.image} 
                      alt={jante.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {jante.isPromo && (
                      <Badge className="absolute top-3 left-3 bg-destructive">
                        PROMO
                      </Badge>
                    )}
                    {!jante.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Rupture de stock</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {jante.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{jante.brand}</p>
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taille:</span>
                        <span className="font-medium">{jante.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Déport:</span>
                        <span className="font-medium">{jante.et}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entraxe:</span>
                        <span className="font-medium">{jante.pcd}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{jante.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({jante.reviews} avis)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">{jante.price} DT</span>
                        {jante.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {jante.originalPrice} DT
                          </span>
                        )}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90"
                      disabled={!jante.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {jante.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir nos jantes ?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-semibold mb-2">Qualité garantie</h3>
              <p className="text-muted-foreground">Jantes certifiées et testées selon les normes européennes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold mb-2">Montage professionnel</h3>
              <p className="text-muted-foreground">Service de montage et équilibrage par nos experts</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Prix compétitifs</h3>
              <p className="text-muted-foreground">Les meilleurs prix du marché avec garantie satisfait ou remboursé</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jantes;