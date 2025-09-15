import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePneusSearch } from "@/hooks/usePneus";
import tireSample from "@/assets/tire-sample.jpg";

interface Pneu {
  id: number;
  marque: string;
  modele: string;
  dimensions: string;
  type: string;
  prix: number;
  stock: number;
  description: string | null;
  image_url: string | null;
}

interface ProductGridProps {
  searchQuery?: string;
}

const ProductGrid = ({ searchQuery }: ProductGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  
  // Utiliser le hook de recherche au lieu de l'état local
  const { data: products = [], isLoading: loading, error } = usePneusSearch(searchQuery, selectedBrand || undefined);

  // Les produits sont maintenant récupérés via le hook usePneusSearch

  const handleAddToCart = (productId: string) => {
    console.log("Ajouter au panier:", productId);
    // TODO: Implement with Supabase
  };

  // Convertir les données pour le composant ProductCard
  const convertToProductCard = (product: Pneu) => ({
    id: product.id.toString(),
    name: product.modele,
    brand: product.marque,
    price: product.prix,
    rating: 4.5 + Math.random() * 0.5, // Note simulée
    reviews: Math.floor(Math.random() * 300) + 50,
    size: product.dimensions,
    features: [product.type, 'Qualité premium', 'Garantie constructeur'],
    inStock: product.stock > 0,
    stockCount: product.stock,
    isPromo: false,
    image: product.image_url || tireSample
  });

  // La fonction applyFilters n'est plus nécessaire car le filtrage est géré par le hook

  const uniqueBrands = Array.from(new Set(products.map(p => p.marque))).sort();

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Chargement du catalogue...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-destructive">Erreur lors du chargement</h2>
            <p className="text-muted-foreground">Impossible de charger les produits</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Catalogue Pneus</h2>
            <p className="text-muted-foreground">
              {products.length} pneus disponibles • Stock temps réel
              {searchQuery && ` • Recherche: "${searchQuery}"`}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
            </Button>

            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <Card className="w-80 h-fit animate-fade-in">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </h3>
                
                <div className="space-y-6">
                  {/* Marques */}
                  <div>
                    <h4 className="font-medium mb-3">Marques</h4>
                    <div className="space-y-2">
                      {uniqueBrands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={selectedBrand === brand}
                            onChange={(e) => {
                              setSelectedBrand(e.target.checked ? brand : null);
                            }}
                          />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Prix */}
                  <div>
                    <h4 className="font-medium mb-3">Prix</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          onChange={(e) => console.log('Filtre prix 0-120:', e.target.checked)}
                        />
                        <span className="text-sm">0 DT - 120 DT</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          onChange={(e) => console.log('Filtre prix 120-180:', e.target.checked)}
                        />
                        <span className="text-sm">120 DT - 180 DT</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          onChange={(e) => console.log('Filtre prix 180-240:', e.target.checked)}
                        />
                        <span className="text-sm">180 DT - 240 DT</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          onChange={(e) => console.log('Filtre prix 240+:', e.target.checked)}
                        />
                        <span className="text-sm">240 DT+</span>
                      </label>
                    </div>
                  </div>

                  {/* Disponibilité */}
                  <div>
                    <h4 className="font-medium mb-3">Disponibilité</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          onChange={(e) => console.log('Filtre stock:', e.target.checked)}
                        />
                        <span className="text-sm">En stock</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard 
                    product={convertToProductCard(product)} 
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun pneu trouvé avec les filtres sélectionnés.</p>
              </div>
            )}

            {/* Load more */}
            {products.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="min-w-48">
                  Charger plus de produits
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;