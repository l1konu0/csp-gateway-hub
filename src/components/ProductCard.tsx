import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    size: string;
    features: string[];
    inStock: boolean;
    stockCount: number;
    isPromo?: boolean;
    image: string;
  };
  onAddToCart: (productId: string) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { user } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour ajouter des produits au panier.",
        action: (
          <Button variant="outline" size="sm" asChild>
            <Link to="/auth">Se connecter</Link>
          </Button>
        ),
      });
      return;
    }

    addToCart({ pneuId: parseInt(product.id) });
  };

  return (
    <Card className="group overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
      <div className="relative">
        {/* Product image */}
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isPromo && (
              <Badge variant="destructive" className="bg-accent text-accent-foreground font-semibold">
                -{discount}%
              </Badge>
            )}
            {product.stockCount <= 5 && product.inStock && (
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                <Zap className="h-3 w-3 mr-1" />
                Stock limité
              </Badge>
            )}
          </div>

          {/* Stock indicator */}
          <div className="absolute bottom-3 right-3">
            <Badge 
              variant={product.inStock ? "default" : "secondary"}
              className={`${product.inStock ? 'bg-green-500' : 'bg-gray-400'} text-white font-medium`}
            >
              {product.inStock ? `${product.stockCount} en stock` : 'Rupture'}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Brand */}
        <p className="text-sm font-medium text-primary mb-1">{product.brand}</p>
        
        {/* Product name */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Size */}
        <p className="text-muted-foreground text-sm mb-3">{product.size}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.features.slice(0, 2).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {product.features.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{product.features.length - 2}
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">
            {product.price} DT
          </span>
          {product.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {product.originalPrice} DT
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {!product.inStock 
            ? 'Rupture de stock' 
            : isAddingToCart 
              ? 'Ajout...' 
              : 'Ajouter au panier'
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;