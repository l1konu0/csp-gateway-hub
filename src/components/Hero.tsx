import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Shield, Truck, Wrench } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Depuis 1995 • Plus de 25 ans d'expertise</span>
          </div>

          {/* Main title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Votre spécialiste
            <span className="block text-accent">pneus & jantes</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
            Stock en temps réel • Montage professionnel • Livraison gratuite dès 200€
          </p>

          {/* Search widget */}
          <Card className="max-w-2xl mx-auto p-6 bg-white/95 backdrop-blur-sm shadow-premium mb-12 animate-scale-in">
            <h3 className="text-lg font-semibold text-foreground mb-4">Trouvez vos pneus en 30 secondes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select className="px-4 py-3 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Largeur (ex: 205)</option>
                <option>185</option>
                <option>195</option>
                <option>205</option>
                <option>215</option>
                <option>225</option>
              </select>
              
              <select className="px-4 py-3 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Hauteur (ex: 55)</option>
                <option>45</option>
                <option>50</option>
                <option>55</option>
                <option>60</option>
                <option>65</option>
              </select>
              
              <select className="px-4 py-3 border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Diamètre (ex: 16)</option>
                <option>15</option>
                <option>16</option>
                <option>17</option>
                <option>18</option>
                <option>19</option>
              </select>
            </div>
            
            <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Rechercher mes pneus
            </Button>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Garantie qualité</h3>
              <p className="text-white/80 text-sm">Pneus neufs garantis, marques premium</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Livraison rapide</h3>
              <p className="text-white/80 text-sm">24-48h partout en France</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4">
                <Wrench className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Montage expert</h3>
              <p className="text-white/80 text-sm">Équilibrage et géométrie inclus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

export default Hero;