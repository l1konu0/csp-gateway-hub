import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Car } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMarquesVoitures, useModelesVoitures, type MarqueVoiture, type ModeleVoiture } from '@/hooks/useVehicles';

export const AdminVehicles = () => {
  const [isAddMarqueOpen, setIsAddMarqueOpen] = useState(false);
  const [isAddModeleOpen, setIsAddModeleOpen] = useState(false);
  const [selectedMarqueForModeles, setSelectedMarqueForModeles] = useState<number | undefined>();
  const [newMarque, setNewMarque] = useState({ nom: '', logo_url: '' });
  const [newModele, setNewModele] = useState({
    marque_id: 0,
    nom: '',
    annee_debut: new Date().getFullYear(),
    annee_fin: undefined as number | undefined,
    dimensions_pneus: [] as string[]
  });
  const [dimensionInput, setDimensionInput] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: marques = [], isLoading: loadingMarques } = useMarquesVoitures();
  const { data: modeles = [], isLoading: loadingModeles } = useModelesVoitures(selectedMarqueForModeles);

  // Mutation pour ajouter une marque
  const addMarqueMutation = useMutation({
    mutationFn: async (marque: { nom: string; logo_url?: string }) => {
      const { data, error } = await supabase
        .from('marques_voitures')
        .insert([marque])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marques-voitures'] });
      setIsAddMarqueOpen(false);
      setNewMarque({ nom: '', logo_url: '' });
      toast({ title: "Succès", description: "Marque ajoutée avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible d'ajouter la marque: ${error.message}`, variant: "destructive" });
    }
  });

  // Mutation pour ajouter un modèle
  const addModeleMutation = useMutation({
    mutationFn: async (modele: Omit<ModeleVoiture, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('modeles_voitures')
        .insert([modele])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modeles-voitures'] });
      setIsAddModeleOpen(false);
      setNewModele({
        marque_id: 0,
        nom: '',
        annee_debut: new Date().getFullYear(),
        annee_fin: undefined,
        dimensions_pneus: []
      });
      setDimensionInput('');
      toast({ title: "Succès", description: "Modèle ajouté avec succès" });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible d'ajouter le modèle: ${error.message}`, variant: "destructive" });
    }
  });

  const handleAddMarque = () => {
    if (!newMarque.nom.trim()) {
      toast({ title: "Erreur", description: "Le nom de la marque est requis", variant: "destructive" });
      return;
    }
    addMarqueMutation.mutate(newMarque);
  };

  const handleAddModele = () => {
    if (!newModele.nom.trim() || !newModele.marque_id || newModele.dimensions_pneus.length === 0) {
      toast({ title: "Erreur", description: "Tous les champs sont requis", variant: "destructive" });
      return;
    }
    addModeleMutation.mutate(newModele);
  };

  const addDimension = () => {
    if (dimensionInput.trim() && !newModele.dimensions_pneus.includes(dimensionInput.trim())) {
      setNewModele({
        ...newModele,
        dimensions_pneus: [...newModele.dimensions_pneus, dimensionInput.trim()]
      });
      setDimensionInput('');
    }
  };

  const removeDimension = (dimension: string) => {
    setNewModele({
      ...newModele,
      dimensions_pneus: newModele.dimensions_pneus.filter(d => d !== dimension)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Véhicules</h2>
          <p className="text-muted-foreground">Gérez les marques et modèles de véhicules</p>
        </div>
        <div className="space-x-2">
          <Button onClick={() => setIsAddMarqueOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Marque
          </Button>
          <Button onClick={() => setIsAddModeleOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Modèle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Marques ({marques.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMarques ? (
              <div className="text-center py-8">Chargement...</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {marques.map((marque) => (
                  <div key={marque.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {marque.logo_url && (
                        <img src={marque.logo_url} alt={marque.nom} className="w-8 h-8 object-contain" />
                      )}
                      <span className="font-medium">{marque.nom}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedMarqueForModeles(marque.id)}
                    >
                      Voir modèles
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modèles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Modèles {selectedMarqueForModeles && `(${marques.find(m => m.id === selectedMarqueForModeles)?.nom})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedMarqueForModeles ? (
              <div className="text-center py-8 text-muted-foreground">
                Sélectionnez une marque pour voir les modèles
              </div>
            ) : loadingModeles ? (
              <div className="text-center py-8">Chargement...</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {modeles.map((modele) => (
                  <div key={modele.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{modele.nom}</h4>
                      <Badge variant="outline">
                        {modele.annee_debut} - {modele.annee_fin || 'En cours'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Dimensions compatibles :</p>
                      <div className="flex flex-wrap gap-1">
                        {modele.dimensions_pneus.map((dimension) => (
                          <Badge key={dimension} variant="secondary" className="text-xs">
                            {dimension}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour ajouter une marque */}
      <Dialog open={isAddMarqueOpen} onOpenChange={setIsAddMarqueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une marque</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="marque-nom">Nom de la marque *</Label>
              <Input
                id="marque-nom"
                value={newMarque.nom}
                onChange={(e) => setNewMarque({ ...newMarque, nom: e.target.value })}
                placeholder="Ex: Toyota"
              />
            </div>
            <div>
              <Label htmlFor="marque-logo">URL du logo (optionnel)</Label>
              <Input
                id="marque-logo"
                value={newMarque.logo_url}
                onChange={(e) => setNewMarque({ ...newMarque, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddMarqueOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddMarque} disabled={addMarqueMutation.isPending}>
                {addMarqueMutation.isPending ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour ajouter un modèle */}
      <Dialog open={isAddModeleOpen} onOpenChange={setIsAddModeleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un modèle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="modele-marque">Marque *</Label>
              <Select 
                value={newModele.marque_id.toString()} 
                onValueChange={(value) => setNewModele({ ...newModele, marque_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une marque" />
                </SelectTrigger>
                <SelectContent>
                  {marques.map((marque) => (
                    <SelectItem key={marque.id} value={marque.id.toString()}>
                      {marque.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="modele-nom">Nom du modèle *</Label>
              <Input
                id="modele-nom"
                value={newModele.nom}
                onChange={(e) => setNewModele({ ...newModele, nom: e.target.value })}
                placeholder="Ex: Corolla"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annee-debut">Année de début *</Label>
                <Input
                  id="annee-debut"
                  type="number"
                  value={newModele.annee_debut}
                  onChange={(e) => setNewModele({ ...newModele, annee_debut: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="annee-fin">Année de fin (optionnel)</Label>
                <Input
                  id="annee-fin"
                  type="number"
                  value={newModele.annee_fin || ''}
                  onChange={(e) => setNewModele({ ...newModele, annee_fin: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dimensions">Dimensions de pneus *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="dimensions"
                  value={dimensionInput}
                  onChange={(e) => setDimensionInput(e.target.value)}
                  placeholder="Ex: 195/65R15"
                  onKeyPress={(e) => e.key === 'Enter' && addDimension()}
                />
                <Button type="button" onClick={addDimension}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newModele.dimensions_pneus.map((dimension) => (
                  <Badge 
                    key={dimension} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeDimension(dimension)}
                  >
                    {dimension} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddModeleOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddModele} disabled={addModeleMutation.isPending}>
                {addModeleMutation.isPending ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};