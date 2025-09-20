import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';

const Accessoires = () => {
  const accessoires = [
    {
      id: 1,
      name: "Tapis de Sol Universels",
      brand: "WeatherTech",
      price: "85 TND",
      rating: 4.7,
      image: "/images/tapis-sol.jpg",
      description: "Tapis caoutchouc haute qualité, ajustement parfait",
      category: "Intérieur"
    },
    {
      id: 2,
      name: "Housse de Protection Voiture",
      brand: "Covercraft",
      price: "120 TND",
      rating: 4.6,
      image: "/images/housse-voiture.jpg",
      description: "Protection intégrale contre les intempéries",
      category: "Extérieur"
    },
    {
      id: 3,
      name: "Kit de Nettoyage Auto",
      brand: "Chemical Guys",
      price: "65 TND",
      rating: 4.8,
      image: "/images/kit-nettoyage.jpg",
      description: "Kit complet pour un nettoyage professionnel",
      category: "Entretien"
    },
    {
      id: 4,
      name: "Organisateur de Coffre",
      brand: "AutoExec",
      price: "45 TND",
      rating: 4.5,
      image: "/images/organisateur-coffre.jpg",
      description: "Rangement intelligent pour votre coffre",
      category: "Intérieur"
    },
    {
      id: 5,
      name: "Chargeur Allume-Cigare USB",
      brand: "Anker",
      price: "35 TND",
      rating: 4.9,
      image: "/images/chargeur-usb.jpg",
      description: "Charge rapide pour vos appareils mobiles",
      category: "Électronique"
    },
    {
      id: 6,
      name: "Support Téléphone Magnétique",
      brand: "Spigen",
      price: "28 TND",
      rating: 4.4,
      image: "/images/support-telephone.jpg",
      description: "Fixation magnétique sécurisée et pratique",
      category: "Électronique"
    }
  ];

  const categories = [
    { name: "Intérieur", count: 2 },
    { name: "Extérieur", count: 1 },
    { name: "Entretien", count: 1 },
    { name: "Électronique", count: 2 }
  ];

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
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button key={category.name} variant="outline" className="gap-2">
                {category.name}
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accessoires.map((accessoire) => (
              <Card key={accessoire.id} className="group hover:shadow-lg transition-all duration-300 border-border">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={accessoire.image} 
                      alt={accessoire.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {accessoire.category}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-accent">{accessoire.brand}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{accessoire.rating}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {accessoire.name}
                  </CardTitle>
                  
                  <CardDescription className="mb-4">
                    {accessoire.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{accessoire.price}</span>
                    <Button size="sm" className="gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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