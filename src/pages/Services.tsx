import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Award, Clock, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: "Montage de pneus",
      description: "Service professionnel de montage et équilibrage",
      price: "Dès 15 DT",
      features: ["Démontage de l'ancien pneu", "Montage du nouveau pneu", "Équilibrage des roues", "Contrôle de la pression"],
      icon: Wrench
    },
    {
      title: "Géométrie des roues",
      description: "Réglage précis de la géométrie pour une usure optimale",
      price: "35 DT",
      features: ["Contrôle de l'alignement", "Réglage de la convergence", "Contrôle des angles", "Rapport détaillé"],
      icon: Award
    },
    {
      title: "Permutation des pneus",
      description: "Rotation des pneus pour une usure uniforme",
      price: "25 DT",
      features: ["Démontage des 4 roues", "Permutation selon schéma", "Contrôle de l'usure", "Remontage et équilibrage"],
      icon: Clock
    },
    {
      title: "Réparation de pneus",
      description: "Réparation professionnelle des crevaisons",
      price: "Dès 10 DT",
      features: ["Diagnostic de la crevaison", "Réparation par l'intérieur", "Test d'étanchéité", "Garantie 6 mois"],
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nos Services
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Des services professionnels pour l'entretien et la maintenance de vos pneus
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {service.price}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Prestations incluses :</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre processus de service</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un service professionnel en 4 étapes pour garantir votre satisfaction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Diagnostic", desc: "Évaluation complète de vos pneus" },
              { step: "2", title: "Devis", desc: "Proposition transparente et détaillée" },
              { step: "3", title: "Service", desc: "Intervention par nos experts" },
              { step: "4", title: "Contrôle", desc: "Vérification finale et garantie" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;