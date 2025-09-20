import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, Wrench, Car, RotateCcw } from "lucide-react";

interface Service {
  id: string;
  nom: string;
  description: string;
  duree_minutes: number;
  prix: number;
}

const RendezVous = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    commentaire: ""
  });
  const [loading, setLoading] = useState(false);
  const [availableTimes] = useState([
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ]);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ""
      }));
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('actif', true)
        .order('nom');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Services loaded:', data);
      setServices(data || []);
      
      // Si pas de services dans la DB, on ajoute des services par défaut
      if (!data || data.length === 0) {
        const defaultServices = [
          {
            id: 'default-1',
            nom: 'Montage de pneu + valve + équilibrage',
            description: 'Montage complet des pneus avec valve neuve et équilibrage',
            duree_minutes: 45,
            prix: 25.00
          },
          {
            id: 'default-2', 
            nom: 'Parallélisme',
            description: 'Réglage du parallélisme des roues',
            duree_minutes: 30,
            prix: 35.00
          },
          {
            id: 'default-3',
            nom: 'Vidange',
            description: 'Vidange moteur avec filtre à huile', 
            duree_minutes: 30,
            prix: 45.00
          }
        ];
        setServices(defaultServices);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      
      // En cas d'erreur, on utilise des services par défaut
      const defaultServices = [
        {
          id: 'default-1',
          nom: 'Montage de pneu + valve + équilibrage',
          description: 'Montage complet des pneus avec valve neuve et équilibrage',
          duree_minutes: 45,
          prix: 25.00
        },
        {
          id: 'default-2', 
          nom: 'Parallélisme',
          description: 'Réglage du parallélisme des roues',
          duree_minutes: 30,
          prix: 35.00
        },
        {
          id: 'default-3',
          nom: 'Vidange',
          description: 'Vidange moteur avec filtre à huile', 
          duree_minutes: 30,
          prix: 45.00
        }
      ];
      setServices(defaultServices);
      
      toast({
        title: "Services chargés en mode hors ligne",
        description: "Les services par défaut ont été chargés",
        variant: "default"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedService || !formData.nom || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const service = services.find(s => s.id === selectedService);
      if (!service) throw new Error("Service non trouvé");

      // Calculer l'heure de fin
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + service.duree_minutes);

      const rdvData = {
        user_id: user?.id || null,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        service: service.nom,
        date_rdv: startTime.toISOString(),
        heure_debut: selectedTime,
        heure_fin: format(endTime, 'HH:mm'),
        commentaire: formData.commentaire || null
      };

      const { error } = await supabase
        .from('rendez_vous')
        .insert([rdvData]);

      if (error) throw error;

      toast({
        title: "Rendez-vous confirmé !",
        description: `Votre rendez-vous pour ${service.nom} le ${format(selectedDate, 'dd/MM/yyyy', { locale: fr })} à ${selectedTime} a été enregistré.`
      });

      // Réinitialiser le formulaire
      setSelectedDate(undefined);
      setSelectedTime("");
      setSelectedService("");
      setFormData({ nom: "", email: user?.email || "", telephone: "", commentaire: "" });

    } catch (error: any) {
      console.error('Erreur lors de la prise de rendez-vous:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la prise de rendez-vous",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('montage') || serviceName.toLowerCase().includes('pneu')) {
      return <Wrench className="h-5 w-5" />;
    }
    if (serviceName.toLowerCase().includes('parallélisme')) {
      return <RotateCcw className="h-5 w-5" />;
    }
    if (serviceName.toLowerCase().includes('vidange')) {
      return <Car className="h-5 w-5" />;
    }
    return <Wrench className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex justify-center mb-4">
              <CalendarIcon className="h-12 w-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Prise de rendez-vous
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Réservez facilement votre créneau pour nos services automobiles professionnels
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Services disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Nos Services</CardTitle>
              <CardDescription>
                Sélectionnez le service souhaité pour votre rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all ${
                      selectedService === service.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getServiceIcon(service.nom)}
                          <div className="flex-1">
                            <h3 className="font-semibold">{service.nom}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {service.duree_minutes}min
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {service.prix.toFixed(2)}€
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de réservation */}
          <Card>
            <CardHeader>
              <CardTitle>Réserver votre rendez-vous</CardTitle>
              <CardDescription>
                Choisissez votre date et heure préférées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Calendrier */}
                <div>
                  <Label className="text-sm font-medium">Date souhaitée</Label>
                  <div className="mt-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                {/* Heure */}
                {selectedDate && (
                  <div>
                    <Label htmlFor="time">Heure souhaitée</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un créneau" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Service */}
                <div>
                  <Label htmlFor="service">Service</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.nom} - {service.prix.toFixed(2)}€
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Informations client */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nom">Nom complet *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="commentaire">Commentaire (optionnel)</Label>
                  <Textarea
                    id="commentaire"
                    name="commentaire"
                    value={formData.commentaire}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Précisions sur votre demande..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Réservation en cours..." : "Confirmer le rendez-vous"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RendezVous;