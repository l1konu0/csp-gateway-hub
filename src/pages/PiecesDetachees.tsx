import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Construction } from 'lucide-react';

const PiecesDetachees = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pièces Détachées Auto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Section en cours de développement
          </p>
        </div>
      </section>

      {/* Development Notice */}
      <section className="py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
              <Construction className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">En cours de développement</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Cette section sera bientôt disponible avec notre catalogue complet de pièces détachées automobiles.
            </p>
            <p className="text-sm text-muted-foreground">
              Pour toute demande de pièce spécifique, n'hésitez pas à nous contacter directement.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PiecesDetachees;