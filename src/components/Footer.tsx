import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Restez informé de nos offres
              </h3>
              <p className="text-white/80 mb-6">
                Promotions exclusives, nouveautés et conseils d'experts directement dans votre boîte mail
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  S'inscrire
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">CSP Pneu</h3>
            <p className="text-primary-foreground/80 mb-6">
              Spécialiste pneus depuis 1995. Votre partenaire de confiance pour tous vos besoins en pneumatiques.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Pneus Auto</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Jantes</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">À propos</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Montage & Équilibrage</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Géométrie</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Réparation</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Stockage saisonnier</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Devis en ligne</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">Livraison</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-accent" />
                <div>
                  <p className="text-primary-foreground/80">123 Avenue des Pneus</p>
                  <p className="text-primary-foreground/80">75000 Paris, France</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <p className="text-primary-foreground/80">01 23 45 67 89</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <p className="text-primary-foreground/80">contact@csp-pneu.fr</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-0.5 text-accent" />
                <div>
                  <p className="text-primary-foreground/80">Lun-Ven: 8h-18h</p>
                  <p className="text-primary-foreground/80">Sam: 8h-17h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/80 text-sm">
              © 2024 CSP Pneu. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                Conditions générales
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;