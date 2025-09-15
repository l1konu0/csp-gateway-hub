import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Wrench, Award } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Expertise Professionnelle",
      description: "Plus de 20 ans d'expérience dans le secteur pneumatique"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Service Client",
      description: "Une équipe dédiée pour vous conseiller et vous accompagner"
    },
    {
      icon: <Wrench className="h-6 w-6 text-primary" />,
      title: "Installation Expert",
      description: "Montage professionnel et équilibrage de précision"
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Marques Premium",
      description: "Partenaire officiel des plus grandes marques"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            À Propos de Nous
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            CSP Chahbani Star Pneu
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Votre spécialiste pneumatique de confiance à Tunis. Depuis notre création, 
            nous nous engageons à fournir des pneus de qualité supérieure et un service 
            exceptionnel à tous nos clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-foreground">
              Notre Mission
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Chez CSP Chahbani Star Pneu, nous croyons que chaque véhicule mérite 
              les meilleurs pneus pour assurer sécurité, performance et confort. 
              Notre équipe d'experts vous guide dans le choix optimal selon vos 
              besoins et votre budget.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Situés au cœur de Tunis, nous servons fièrement la communauté locale 
              avec des produits authentiques et un service de montage professionnel 
              qui respecte les standards les plus élevés de l'industrie.
            </p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">20+</div>
                  <div className="text-sm text-muted-foreground">Années d'Expérience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                  <div className="text-sm text-muted-foreground">Clients Satisfaits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <div className="text-sm text-muted-foreground">Marques Partenaires</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Produits Authentiques</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="font-semibold mb-2 text-foreground">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;