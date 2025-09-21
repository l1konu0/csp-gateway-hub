import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import BrandPartners from "@/components/BrandPartners";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { VehicleSelector } from "@/components/VehicleSelector";

// Fonction utilitaire pour debounce (éviter re-render à chaque touche)
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [compatibleDimensions, setCompatibleDimensions] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<{
    marque: string;
    modele: string;
    annee: number;
  } | null>(null);

  // Recherche par référence de pneu
  const handleSearch = useCallback(
    debounce((query: string) => {
      const normalized = query.trim().toLowerCase();
      setSearchQuery(normalized);
      setCompatibleDimensions([]);
      setSelectedVehicle(null);

      if (normalized) {
        const productSection = document.getElementById("products");
        if (productSection) {
          productSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 300),
    []
  );

  // Recherche par véhicule
  const handleVehicleSearch = (vehicleInfo: {
    marque: string;
    modele: string;
    annee: number;
  }) => {
    setSelectedVehicle(vehicleInfo);
    setSearchQuery(""); // pas de conflit avec recherche texte

    const productSection = document.getElementById("products");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Dimensions trouvées pour véhicule
  const handleDimensionsFound = (dimensions: string[]) => {
    setCompatibleDimensions(dimensions.map((d) => d.toLowerCase().trim()));
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

      {/* Produits */}
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
