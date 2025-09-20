import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import BrandPartners from "@/components/BrandPartners";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { VehicleSelector } from "@/components/VehicleSelector";
import { OrderTest } from "@/components/OrderTest";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [compatibleDimensions, setCompatibleDimensions] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<{marque: string; modele: string; annee: number} | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCompatibleDimensions([]); // Reset vehicle search
    setSelectedVehicle(null);
    // Faire défiler vers les produits si une recherche est effectuée
    if (query.trim()) {
      const productSection = document.getElementById('products');
      if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleVehicleSearch = (vehicleInfo: {marque: string; modele: string; annee: number}) => {
    setSelectedVehicle(vehicleInfo);
    setSearchQuery(""); // Reset text search
    // Faire défiler vers les produits
    const productSection = document.getElementById('products');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDimensionsFound = (dimensions: string[]) => {
    setCompatibleDimensions(dimensions);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <Hero />
      
      {/* Sélecteur de véhicule */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <VehicleSelector 
            onDimensionsFound={handleDimensionsFound}
            onSearch={handleVehicleSearch}
          />
        </div>
      </section>

      <AboutSection />
      <BrandPartners />
      
      {/* Test de commande - Section temporaire pour les tests */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Test du Système</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Testez le système de commande pour vous assurer que tout fonctionne correctement
            </p>
          </div>
          <OrderTest />
        </div>
      </section>
      
      <div id="products">
        <ProductGrid 
          searchQuery={searchQuery} 
          compatibleDimensions={compatibleDimensions}
          selectedVehicle={selectedVehicle}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
