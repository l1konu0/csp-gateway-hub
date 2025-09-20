import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Wrench } from 'lucide-react';

const PiecesDetachees = () => {
  const pieces = [
    {
      id: 1,
      name: "Plaquettes de Frein AV",
      brand: "Brembo",
      price: "95 TND",
      rating: 4.8,
      image: "/images/plaquettes-frein.jpg",
      description: "Plaquettes céramique haute performance",
      category: "Freinage",
      compatibility: "Véhicules européens"
    },
    {
      id: 2,
      name: "Filtre à Air Moteur",
      brand: "Mann Filter",
      price: "32 TND",
      rating: 4.6,
      image: "/images/filtre-air.jpg",
      description: "Filtration optimale pour votre moteur",
      category: "Filtration",
      compatibility: "Universel"
    },
    {
      id: 3,
      name: "Amortisseurs Arrière",
      brand: "Bilstein",
      price: "180 TND",
      rating: 4.9,
      image: "/images/amortisseurs.jpg",
      description: "Confort et tenue de route exceptionnels",
      category: "Suspension",
      compatibility: "Sur mesure"
    },
    {
      id: 4,
      name: "Courroie de Distribution",
      brand: "Gates",
      price: "68 TND",
      rating: 4.7,
      image: "/images/courroie-distribution.jpg",
      description: "Fiabilité et durabilité garanties",
      category: "Distribution",
      compatibility: "Modèles spécifiques"
    },
    {
      id: 5,
      name: "Batterie 12V 70Ah",
      brand: "Varta",
      price: "145 TND",
      rating: 4.5,
      image: "/images/batterie-auto.jpg",
      description: "Démarrage garanti en toutes conditions",
      category: "Électrique",
      compatibility: "Véhicules essence/diesel"
    },
    {
      id: 6,
      name: "Disques de Frein AV",
      brand: "Zimmermann",
      price: "125 TND",
      rating: 4.8,
      image: "/images/disques-frein.jpg",
      description: "Freinage progressif et sécurisé",
      category: "Freinage",
      compatibility: "Véhicules européens"
    }
  ];

  const categories = [
    { name: "Freinage", count: 2, icon: "🛑" },
    { name: "Filtration", count: 1, icon: "🔍" },
    { name: "Suspension", count: 1, icon: "🏁" },
    { name: "Distribution", count: 1, icon: "⚙️" },
    { name: "Électrique", count: 1, icon: "⚡" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pièces Détachées Auto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Pièces d'origine et adaptables pour l'entretien et la réparation de votre véhicule. Qualité professionnelle garantie.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button key={category.name} variant="outline" className="gap-2">
                <span>{category.icon}</span>
                {category.name}
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-6 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-center">
            <Wrench className="h-6 w-6 text-primary" />
            <p className="text-lg font-medium">
              <span className="text-primary">Installation professionnelle disponible</span> - Contactez-nous pour un devis
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pieces.map((piece) => (
              <Card key={piece.id} className="group hover:shadow-lg transition-all duration-300 border-border">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={piece.image} 
                      alt={piece.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {piece.category}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-accent">{piece.brand}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{piece.rating}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {piece.name}
                  </CardTitle>
                  
                  <CardDescription className="mb-3">
                    {piece.description}
                  </CardDescription>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Compatibilité:</span>
                    </div>
                    <span className="text-sm font-medium">{piece.compatibility}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{piece.price}</span>
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

      {/* Services Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos services pièces détachées</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold mb-2">Diagnostic gratuit</h3>
              <p className="text-muted-foreground">Identification précise des pièces nécessaires à votre réparation</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="font-semibold mb-2">Installation professionnelle</h3>
              <p className="text-muted-foreground">Montage par nos mécaniciens expérimentés avec garantie</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="font-semibold mb-2">Commande sur mesure</h3>
              <p className="text-muted-foreground">Pièces spécifiques disponibles sur commande en 24-48h</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PiecesDetachees;