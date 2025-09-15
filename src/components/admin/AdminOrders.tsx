import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart } from 'lucide-react';

interface Commande {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  adresse: string | null;
  total: number;
  statut: string;
  created_at: string;
}

export const AdminOrders = () => {
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
                    <TableHead>Date</TableHead>
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
                        {Number(order.total).toFixed(2)} DT
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.statut)}>
                          {getStatusText(order.statut)}
                        </Badge>
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
    </div>
  );
};