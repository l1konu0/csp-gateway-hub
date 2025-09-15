import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import BrandPartners from "@/components/BrandPartners";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Faire défiler vers les produits si une recherche est effectuée
    if (query.trim()) {
      const productSection = document.getElementById('products');
      if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <Hero />
      <AboutSection />
      <BrandPartners />
      <div id="products">
        <ProductGrid searchQuery={searchQuery} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
