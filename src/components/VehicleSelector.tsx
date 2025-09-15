import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Car, Search } from 'lucide-react';
import { useMarquesVoitures, useModelesVoitures, useAnneesDisponibles, useDimensionsCompatibles } from '@/hooks/useVehicles';
import { Badge } from '@/components/ui/badge';

interface VehicleSelectorProps {
  onDimensionsFound?: (dimensions: string[]) => void;
  onSearch?: (vehicleInfo: { marque: string; modele: string; annee: number }) => void;
}

export const VehicleSelector = ({ onDimensionsFound, onSearch }: VehicleSelectorProps) => {
  const [selectedMarque, setSelectedMarque] = useState<number | undefined>();
  const [selectedModele, setSelectedModele] = useState<number | undefined>();
  const [selectedAnnee, setSelectedAnnee] = useState<number | undefined>();

  const { data: marques, isLoading: loadingMarques } = useMarquesVoitures();
  const { data: modeles, isLoading: loadingModeles } = useModelesVoitures(selectedMarque);
  const { data: annees, isLoading: loadingAnnees } = useAnneesDisponibles(selectedModele);
  const { data: dimensions } = useDimensionsCompatibles(selectedModele);

  // Reset des sélections dépendantes
  useEffect(() => {
    setSelectedModele(undefined);
    setSelectedAnnee(undefined);
  }, [selectedMarque]);

  useEffect(() => {
    setSelectedAnnee(undefined);
  }, [selectedModele]);

  // Notification des dimensions trouvées
  useEffect(() => {
    if (dimensions && dimensions.length > 0) {
      onDimensionsFound?.(dimensions);
    }
  }, [dimensions, onDimensionsFound]);

  const handleSearch = () => {
    if (selectedMarque && selectedModele && selectedAnnee) {
      const marque = marques?.find(m => m.id === selectedMarque);
      const modele = modeles?.find(m => m.id === selectedModele);
      
      if (marque && modele) {
        onSearch?.({
          marque: marque.nom,
          modele: modele.nom,
          annee: selectedAnnee
        });
      }
    }
  };

  const isSearchEnabled = selectedMarque && selectedModele && selectedAnnee;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-elegant">
      <CardHeader className="text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-foreground">
          <Car className="h-7 w-7 text-primary" />
          Trouvez vos pneus par véhicule
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Sélectionnez votre véhicule pour voir les pneus compatibles
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sélection de la marque */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Marque</label>
            <Select 
              value={selectedMarque?.toString() || ""} 
              onValueChange={(value) => setSelectedMarque(value ? parseInt(value) : undefined)}
            >
              <SelectTrigger className="h-12 bg-background border-border hover:border-primary transition-colors">
                <SelectValue placeholder={loadingMarques ? "Chargement..." : "Choisir une marque"} />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                {marques?.map((marque) => (
                  <SelectItem key={marque.id} value={marque.id.toString()}>
                    {marque.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection du modèle */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Modèle</label>
            <Select 
              value={selectedModele?.toString() || ""} 
              onValueChange={(value) => setSelectedModele(value ? parseInt(value) : undefined)}
              disabled={!selectedMarque}
            >
              <SelectTrigger className="h-12 bg-background border-border hover:border-primary transition-colors disabled:opacity-50">
                <SelectValue placeholder={
                  !selectedMarque ? "Choisir d'abord une marque" :
                  loadingModeles ? "Chargement..." : "Choisir un modèle"
                } />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                {modeles?.map((modele) => (
                  <SelectItem key={modele.id} value={modele.id.toString()}>
                    {modele.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection de l'année */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Année</label>
            <Select 
              value={selectedAnnee?.toString() || ""} 
              onValueChange={(value) => setSelectedAnnee(value ? parseInt(value) : undefined)}
              disabled={!selectedModele}
            >
              <SelectTrigger className="h-12 bg-background border-border hover:border-primary transition-colors disabled:opacity-50">
                <SelectValue placeholder={
                  !selectedModele ? "Choisir d'abord un modèle" :
                  loadingAnnees ? "Chargement..." : "Choisir une année"
                } />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                {annees?.map((annee) => (
                  <SelectItem key={annee} value={annee.toString()}>
                    {annee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Affichage des dimensions compatibles */}
        {dimensions && dimensions.length > 0 && (
          <div className="bg-accent/50 rounded-lg p-4 border border-border">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              Dimensions compatibles :
            </h4>
            <div className="flex flex-wrap gap-2">
              {dimensions.map((dimension) => (
                <Badge key={dimension} variant="secondary" className="text-sm font-medium">
                  {dimension}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Bouton de recherche */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSearch}
            disabled={!isSearchEnabled}
            size="lg"
            className="px-8 py-3 bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Search className="h-5 w-5 mr-2" />
            Voir les pneus compatibles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};