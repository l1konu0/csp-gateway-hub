import { Badge } from "@/components/ui/badge";

const BrandPartners = () => {
  const brands = [
    {
      name: "Bridgestone",
      logo: "/images/bridgestone-potenza.jpg",
      description: "Leader mondial du pneumatique"
    },
    {
      name: "Michelin",
      logo: "/images/michelin-pilot-sport.jpg",
      description: "Innovation et performance"
    },
    {
      name: "Continental",
      logo: "/images/continental-premium.jpg",
      description: "Technologie allemande"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Nos Partenaires
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Marques de Confiance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nous travaillons exclusivement avec les plus grandes marques mondiales 
            pour vous garantir qualité et performance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {brands.map((brand, index) => (
            <div 
              key={index} 
              className="group text-center p-8 rounded-lg border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                <img 
                  src={brand.logo} 
                  alt={`Logo ${brand.name}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{brand.name}</h3>
              <p className="text-muted-foreground text-sm">{brand.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Et bien d'autres marques de référence : Pirelli, Goodyear, Dunlop, Yokohama...
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandPartners;