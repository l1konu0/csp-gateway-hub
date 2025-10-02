import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PneusGrid from '@/components/PneusGrid';
import { VehicleSelector } from '@/components/VehicleSelector';

const PneusAuto = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [compatibleDimensions, setCompatibleDimensions] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<{marque: string; modele: string; annee: number} | null>(null);

  // Gérer les paramètres de recherche depuis l'URL
  useEffect(() => {
    const width = searchParams.get('width');
    const height = searchParams.get('height');
    const diameter = searchParams.get('diameter');
    
    if (width && height && diameter) {
      // Construire une requête de recherche basée sur les dimensions
      const dimensionQuery = `${width}/${height}R${diameter}`;
      setSearchQuery(dimensionQuery);
      setCompatibleDimensions([dimensionQuery]);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCompatibleDimensions([]);
    setSelectedVehicle(null);
  };

  const handleVehicleSearch = (vehicleInfo: {marque: string; modele: string; annee: number}) => {
    setSelectedVehicle(vehicleInfo);
    setSearchQuery("");
  };

  const handleDimensionsFound = (dimensions: string[]) => {
    setCompatibleDimensions(dimensions);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pneus Auto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Découvrez notre large gamme de pneus automobiles des plus grandes marques
          </p>
        </div>
      </section>

      {/* Sélecteur de véhicule */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <VehicleSelector 
            onDimensionsFound={handleDimensionsFound}
            onSearch={handleVehicleSearch}
          />
        </div>
      </section>

      {/* Catalogue de pneus */}
      <PneusGrid 
        searchQuery={searchQuery} 
        compatibleDimensions={compatibleDimensions}
        selectedVehicle={selectedVehicle}
      />

      <Footer />
    </div>
  );
};

export default PneusAuto;