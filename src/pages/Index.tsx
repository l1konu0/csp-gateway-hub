import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import BrandPartners from "@/components/BrandPartners";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { VehicleSelector } from "@/components/VehicleSelector";

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
