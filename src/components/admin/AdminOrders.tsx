import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, FileText, Eye } from 'lucide-react';
import { FactureModal } from './FactureModal';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Commande {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  adresse: string | null;
  total: number;
  statut: string;
  created_at: string;
  numero_facture: string | null;
  date_facture: string | null;
  facture_generee: boolean;
}

export const AdminOrders = () => {
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Commande | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<Array<{
    id: number;
    quantite: number;
    prix_unitaire: number;
    produit: {
      id: number;
      designation: string;
      prix_vente: number;
      categories?: {
        nom: string;
      };
    };
  }>>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commandes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Commande[];
    },
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const { data, error } = await supabase.rpc('generer_facture_commande', {
        commande_id: orderId
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Facture générée",
        description: "La facture a été générée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de générer la facture.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateInvoice = (orderId: number) => {
    generateInvoiceMutation.mutate(orderId);
  };

  const handleViewInvoice = async (order: Commande) => {
    if (!order.numero_facture) return;
    
    try {
      // Récupérer les détails de la commande
      const { data: details, error } = await supabase
        .from('commande_details')
        .select(`
          *,
          produit:catalogue_produits(id, designation, prix_vente, categories(nom))
        `)
        .eq('commande_id', order.id);

      if (error) throw error;

      setInvoiceDetails(details || []);
      setSelectedOrderForInvoice(order);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la facture.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'secondary';
      case 'confirmee':
        return 'default';
      case 'expediee':
        return 'outline';
      case 'livree':
        return 'default';
      case 'annulee':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'confirmee':
        return 'Confirmée';
      case 'expediee':
        return 'Expédiée';
      case 'livree':
        return 'Livrée';
      case 'annulee':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestion des commandes</h2>
        <p className="text-muted-foreground">
          Suivez et gérez toutes les commandes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Commandes récentes
          </CardTitle>
          <CardDescription>
            {orders?.length || 0} commandes au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Facture</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.nom}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.telephone && (
                            <div>{order.telephone}</div>
                          )}
                          {order.adresse && (
                            <div className="text-muted-foreground text-xs">
                              {order.adresse}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {Number(order.total).toFixed(3)} TND
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.statut)}>
                          {getStatusText(order.statut)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.facture_generee ? (
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs">
                              {order.numero_facture}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {order.date_facture && new Date(order.date_facture).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Pas de facture
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {order.facture_generee ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewInvoice(order)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateInvoice(order.id)}
                              disabled={generateInvoiceMutation.isPending}
                              className="h-8 w-8 p-0"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune commande pour le moment
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrderForInvoice && (
        <FactureModal
          isOpen={true}
          onClose={() => setSelectedOrderForInvoice(null)}
          commande={selectedOrderForInvoice}
          details={invoiceDetails}
        />
      )}
    </div>
  );
};