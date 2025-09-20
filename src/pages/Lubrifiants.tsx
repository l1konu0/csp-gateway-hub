import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';

const Lubrifiants = () => {
  const lubrifiants = [
    {
      id: 1,
      name: "Huile Moteur 5W30 Synthétique",
      brand: "Castrol",
      price: "45 TND",
      rating: 4.8,
      image: "/images/huile-moteur-5w30.jpg",
      description: "Huile moteur haute performance pour véhicules modernes",
      viscosity: "5W30",
      volume: "5L"
    },
    {
      id: 2,
      name: "Huile Moteur 10W40 Semi-Synthétique",
      brand: "Shell",
      price: "38 TND",
      rating: 4.6,
      image: "/images/huile-moteur-10w40.jpg",
      description: "Protection optimale pour tous types de moteurs",
      viscosity: "10W40",
      volume: "4L"
    },
    {
      id: 3,
      name: "Liquide de Refroidissement",
      brand: "Total",
      price: "25 TND",
      rating: 4.7,
      image: "/images/liquide-refroidissement.jpg",
      description: "Protection antigel longue durée",
      viscosity: "-",
      volume: "2L"
    },
    {
      id: 4,
      name: "Huile de Boîte de Vitesse",
      brand: "Mobil",
      price: "55 TND",
      rating: 4.9,
      image: "/images/huile-boite-vitesse.jpg",
      description: "Lubrification optimale des transmissions",
      viscosity: "75W90",
      volume: "2L"
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lubrifiants.map((lubrifiant) => (
              <Card key={lubrifiant.id} className="group hover:shadow-lg transition-all duration-300 border-border">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={lubrifiant.image} 
                      alt={lubrifiant.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-accent">{lubrifiant.brand}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{lubrifiant.rating}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {lubrifiant.name}
                  </CardTitle>
                  
                  <CardDescription className="mb-3">
                    {lubrifiant.description}
                  </CardDescription>
                  
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Viscosité:</span>
                      <span className="font-medium">{lubrifiant.viscosity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Volume:</span>
                      <span className="font-medium">{lubrifiant.volume}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{lubrifiant.price}</span>
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