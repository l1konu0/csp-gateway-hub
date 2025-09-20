import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, Trash2, Eye } from "lucide-react";

interface RendezVous {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  service: string;
  date_rdv: string;
  heure_debut: string;
  heure_fin: string;
  statut: string;
  commentaire?: string;
  created_at: string;
}

const AdminRendezVous = () => {
  const [selectedRdv, setSelectedRdv] = useState<RendezVous | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rendezVous = [], isLoading, error } = useQuery({
    queryKey: ['admin-rendez-vous'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rendez_vous')
        .select('*')
        .order('date_rdv', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
      const { error } = await supabase
        .from('rendez_vous')
        .update({ statut })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rendez-vous'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du rendez-vous a été modifié avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  });

  const deleteRdvMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rendez_vous')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rendez-vous'] });
      setSelectedRdv(null);
      setDialogOpen(false);
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le rendez-vous",
        variant: "destructive"
      });
    }
  });

  const handleViewRdv = (rdv: RendezVous) => {
    setSelectedRdv(rdv);
    setDialogOpen(true);
  };

  const handleDeleteRdv = () => {
    if (selectedRdv) {
      deleteRdvMutation.mutate(selectedRdv.id);
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <Badge variant="secondary">En attente</Badge>;
      case 'confirme':
        return <Badge variant="default">Confirmé</Badge>;
      case 'termine':
        return <Badge variant="outline">Terminé</Badge>;
      case 'annule':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des rendez-vous...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erreur lors du chargement des rendez-vous</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gestion des Rendez-vous
          </CardTitle>
          <CardDescription>
            Gérez les rendez-vous pris par vos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rendezVous.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun rendez-vous enregistré
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rendezVous.map((rdv) => (
                    <TableRow key={rdv.id}>
                      <TableCell className="font-medium">
                        {formatDate(rdv.date_rdv)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rdv.heure_debut} - {rdv.heure_fin}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rdv.nom}</div>
                          <div className="text-sm text-muted-foreground">{rdv.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{rdv.service}</TableCell>
                      <TableCell>
                        <Select
                          value={rdv.statut}
                          onValueChange={(newStatut) =>
                            updateStatusMutation.mutate({ id: rdv.id, statut: newStatut })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="confirme">Confirmé</SelectItem>
                            <SelectItem value="termine">Terminé</SelectItem>
                            <SelectItem value="annule">Annulé</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRdv(rdv)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour voir les détails */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
            <DialogDescription>
              Informations complètes du rendez-vous
            </DialogDescription>
          </DialogHeader>
          
          {selectedRdv && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date & Heure</h4>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedRdv.date_rdv)}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedRdv.heure_debut} - {selectedRdv.heure_fin}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Statut</h4>
                  {getStatusBadge(selectedRdv.statut)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Service</h4>
                <p className="font-medium">{selectedRdv.service}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Informations client</h4>
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedRdv.nom}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedRdv.email}
                  </p>
                  {selectedRdv.telephone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedRdv.telephone}
                    </p>
                  )}
                </div>
              </div>

              {selectedRdv.commentaire && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Commentaire</h4>
                  <p className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5" />
                    {selectedRdv.commentaire}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Date de création</h4>
                <p>{formatDateTime(selectedRdv.created_at)}</p>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteRdv}
                  disabled={deleteRdvMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRendezVous;