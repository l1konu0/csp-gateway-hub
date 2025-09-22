import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      });

      setFormData({
        nom: "",
        email: "",
        telephone: "",
        sujet: "",
        message: ""
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre message.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Notre magasin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">CSP Chahbani Star Pneus</h3>
                  <p className="text-muted-foreground">
                    46 Avenue Habib Bourguiba<br />
                    2046 Ain Zaghouane, Tunis
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">GSM: 98 215 559 / 20 215 559</p>
                    <p className="font-medium">TEL/FAX: 75 760 925</p>
                    <p className="text-sm text-muted-foreground">Lignes directes magasin</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">chahbanistarpneus4@gmail.com</p>
                    <p className="text-sm text-muted-foreground">Email commercial</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Horaires d'ouverture</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Lundi - Vendredi: 8h00 - 18h00</p>
                      <p>Samedi: 8h00 - 16h00</p>
                      <p>Dimanche: Fermé</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carte Google Maps */}
            <Card>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
                <CardDescription>
                  Trouvez-nous facilement grâce à cette carte interactive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3288.9899775!2d10.760843476414!3d34.739564872880!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002d2b1b8b7b7b%3A0x7b8b7b7b7b7b7b7b!2sSfax%2C%20Tunisia!5e0!3m2!1sen!2s!4v1635789012345!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation CSP Chahbani Star Pneus"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Parking gratuit disponible devant le magasin
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de contact */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription>
                  Remplissez ce formulaire et nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom complet *</Label>
                      <Input
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
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
                        placeholder="+216 XX XXX XXX"
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
                      placeholder="votre.email@exemple.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sujet">Sujet</Label>
                    <Input
                      id="sujet"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleInputChange}
                      placeholder="Ex: Devis pour pneus, Prise de rendez-vous..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre demande en détail..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Envoi en cours...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informations supplémentaires */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Services d'urgence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-foreground">Dépannage 24h/24</p>
                    <p className="text-sm text-muted-foreground">
                      Pour les urgences : 98 215 559
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Intervention rapide</p>
                    <p className="text-sm text-muted-foreground">
                      Service de remorquage et réparation sur place
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;