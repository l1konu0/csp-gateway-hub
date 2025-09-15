import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { cspCatalog, getProductsInStock, getProductsOnSale, searchProducts } from "@/data/cspCatalog";
import tireSample from "@/assets/tire-sample.jpg";

const ProductGrid = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [products] = useState(cspCatalog);
  const [filteredProducts, setFilteredProducts] = useState(cspCatalog);

  const handleAddToCart = (productId: string) => {
    console.log("Ajouter au panier:", productId);
    // TODO: Implement with Supabase
  };

  // Convertir les données pour le composant ProductCard
  const convertToProductCard = (product: any) => ({
    id: product.id,
    name: product.modele,
    brand: product.marque,
    price: product.prixPromo || product.prixUnitaire,
    originalPrice: product.prixPromo ? product.prixUnitaire : undefined,
    rating: 4.5 + Math.random() * 0.5, // Note simulée
    reviews: Math.floor(Math.random() * 300) + 50,
    size: product.dimension,
    features: product.caracteristiques.slice(0, 3),
    inStock: product.enStock,
    stockCount: product.stock,
    isPromo: !!product.prixPromo,
    image: tireSample
  });

  const applyFilters = (brand?: string, priceRange?: string, inStockOnly?: boolean) => {
    let filtered = [...products];
    
    if (brand) {
      filtered = filtered.filter(p => p.marque.toLowerCase() === brand.toLowerCase());
    }
    
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        const price = p.prixPromo || p.prixUnitaire;
        return price >= min && (max ? price <= max : true);
      });
    }
    
    if (inStockOnly) {
      filtered = filtered.filter(p => p.enStock);
    }
    
    setFilteredProducts(filtered);
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Catalogue Pneus</h2>
            <p className="text-muted-foreground">
              {filteredProducts.length} pneus disponibles • Stock temps réel
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
                      {['Michelin', 'Continental', 'Bridgestone', 'Pirelli', 'Goodyear', 'Hankook'].map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            onChange={(e) => applyFilters(e.target.checked ? brand : undefined)}
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
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">0 DT - 120 DT</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">120 DT - 180 DT</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">180 DT - 240 DT</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">240 DT+</span>
                      </label>
                    </div>
                  </div>

                  {/* Disponibilité */}
                  <div>
                    <h4 className="font-medium mb-3">Disponibilité</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">En stock</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Promotion</span>
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
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard 
                    product={convertToProductCard(product)} 
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>

            {/* Load more */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="min-w-48">
                Charger plus de produits
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;