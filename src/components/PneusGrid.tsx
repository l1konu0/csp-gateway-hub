/**
 * Composant spécialisé pour afficher les pneus classés par famille
 */

import { useState } from 'react';
import { useRechercherProduits } from '@/hooks/useCatalogue';
import ProductCard from './ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Grid, List, Filter } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import tireSample from '@/assets/tire-sample.jpg';

interface PneusGridProps {
  searchQuery?: string;
  compatibleDimensions?: string[];
  selectedVehicle?: {marque: string; modele: string; annee: number} | null;
}

const PneusGrid = ({ searchQuery, compatibleDimensions, selectedVehicle }: PneusGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFamille, setSelectedFamille] = useState<string | null>(null);
  
  // Hooks pour l'authentification et le panier
  const { user } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Récupérer uniquement les pneus (categorie_id = 1) avec stock > 0
  const { data: allProducts = [], isLoading: loading, error } = useRechercherProduits(searchQuery, 'FA0001');
  
  // Filtrer par famille si sélectionnée
  const filteredProducts = selectedFamille 
    ? allProducts.filter(p => (p as any).famille === selectedFamille)
    : allProducts;

  // Grouper les produits par famille
  const productsByFamille = allProducts.reduce((acc, product) => {
    const famille = (product as any).famille || 'Autres';
    if (!acc[famille]) {
      acc[famille] = [];
    }
    acc[famille].push(product);
    return acc;
  }, {} as Record<string, typeof allProducts>);

  // Obtenir les familles uniques
  const familles = Object.keys(productsByFamille).sort();

  const handleAddToCart = (productId: string) => {
    if (!user) {
      // Trouver le produit pour sauvegarder ses infos
      const product = allProducts.find(p => p.id.toString() === productId);
      if (product) {
        localStorage.setItem('pendingCartItem', JSON.stringify({
          productId: productId,
          productName: product.designation,
          productPrice: product.prix_vente
        }));
      }
      
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour ajouter des produits au panier.",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/auth')}
          >
            Se connecter
          </Button>
        ),
      });
      return;
    }

    addToCart({ produitId: parseInt(productId) });
  };

  // Convertir les données pour le composant ProductCard
  const convertToProductCard = (product: any) => ({
    id: product.id.toString(),
    name: product.designation.split(' ').slice(1, 4).join(' '), // Extraire le nom du produit de la désignation
    brand: product.designation.split(' ')[0] || 'Marque inconnue', // Première partie de la désignation
    price: product.prix_vente,
    rating: 4.5 + Math.random() * 0.5, // Note simulée
    reviews: Math.floor(Math.random() * 300) + 50,
    size: product.designation.match(/\d+[X/]\d+R?\d+/)?.[0] || 'N/A', // Extraire les dimensions si présentes
    features: [product.famille || 'Famille', 'Qualité premium', 'Garantie constructeur'],
    inStock: product.stock_disponible > 0,
    stockCount: product.stock_disponible,
    isPromo: false,
    image: tireSample // Utiliser l'image par défaut pour l'instant
  });

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="bg-muted h-4 rounded w-3/4" />
                  <div className="bg-muted h-4 rounded w-1/2" />
                  <div className="bg-muted h-6 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Erreur lors du chargement des pneus</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* En-tête avec filtres */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Pneus Automobiles</h2>
            <p className="text-muted-foreground">
              {selectedVehicle 
                ? `Pneus compatibles pour votre ${selectedVehicle.marque} ${selectedVehicle.modele} (${selectedVehicle.annee})`
                : `Découvrez notre gamme de ${allProducts.length} pneus automobiles`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Filtre par famille */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select 
                value={selectedFamille || ''} 
                onChange={(e) => setSelectedFamille(e.target.value || null)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Toutes les familles</option>
                {familles.map(famille => (
                  <option key={famille} value={famille}>
                    {famille} ({productsByFamille[famille].length})
                  </option>
                ))}
              </select>
            </div>

            {/* Boutons de vue */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Affichage par famille */}
        {!selectedFamille ? (
          // Affichage groupé par famille
          <div className="space-y-12">
            {familles.map(famille => (
              <div key={famille}>
                <div className="flex items-center gap-3 mb-6">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {famille}
                  </Badge>
                  <span className="text-muted-foreground">
                    {productsByFamille[famille].length} pneus
                  </span>
                </div>
                
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {productsByFamille[famille].map((product) => (
                    <div key={product.id} className="animate-fade-in">
                      <ProductCard 
                        product={convertToProductCard(product)} 
                        onAddToCart={handleAddToCart}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Affichage filtré par famille sélectionnée
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
        )}

        {/* Message si aucun produit */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedVehicle 
                ? `Aucun pneu compatible trouvé pour votre ${selectedVehicle.marque} ${selectedVehicle.modele} (${selectedVehicle.annee}).`
                : 'Aucun pneu trouvé avec les filtres sélectionnés.'
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PneusGrid;
