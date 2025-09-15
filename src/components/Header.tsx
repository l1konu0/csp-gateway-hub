import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Menu, Phone, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    // Recherche en temps réel après 2 caractères
    if (onSearch && value.length >= 2) {
      onSearch(value);
    } else if (onSearch && value.length === 0) {
      // Réinitialiser la recherche si le champ est vide
      onSearch("");
    }
  };

  return (
    <header className="bg-card shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="border-b border-border py-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Spécialiste pneus depuis 1995
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span>Livraison gratuite dès 300 DT</span>
              <span>•</span>
              <span>Montage professionnel</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="block">
                <img 
                  src="/src/assets/csp-logo.svg" 
                  alt="CSP Chahbani Star Pneus" 
                  className="h-12 md:h-16 w-auto transition-smooth hover:scale-105"
                />
              </Link>
            </div>

            {/* Search bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Rechercher par marque, dimension..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Auth buttons */}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user.email}
                  </span>
                  {isAdmin && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin-auth">
                        <User className="h-4 w-4 mr-2" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Déconnexion</span>
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Link>
                </Button>
              )}

              {/* Cart */}
              <Button variant="outline" size="sm" className="relative" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cartCount}
                    </Badge>
                  )}
                  <span className="ml-2 hidden sm:inline">Panier</span>
                </Link>
              </Button>

              {/* Mobile menu */}
              <Button variant="outline" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-border py-3">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" className="font-medium" asChild>
                <Link to="/pneus-auto">Pneus Auto</Link>
              </Button>
              <Button variant="ghost" className="font-medium" asChild>
                <Link to="/jantes">Jantes</Link>
              </Button>
              <Button variant="ghost" className="font-medium" asChild>
                <Link to="/services">Services</Link>
              </Button>
              <Button variant="ghost" className="font-medium" asChild>
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
            
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="md:hidden flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
              </div>
            </form>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;