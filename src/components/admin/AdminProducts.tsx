import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Pneu {
  id: number;
  marque: string;
  modele: string;
  dimensions: string;
  type: string;
  prix: number;
  stock: number;
  description: string | null;
  image_url: string | null;
}

export const AdminProducts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Pneu | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pneus')
        .select('*')
        .order('marque', { ascending: true });

      if (error) throw error;
      return data as Pneu[];
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, newStock }: { id: number; newStock: number }) => {
      const { error } = await supabase
        .from('pneus')
        .update({ stock: newStock })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Stock mis à jour",
        description: "Le stock du produit a été modifié avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le stock.",
        variant: "destructive",
      });
    },
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, newPrice }: { id: number; newPrice: number }) => {
      const { error } = await supabase
        .from('pneus')
        .update({ prix: newPrice })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Prix mis à jour",
        description: "Le prix du produit a été modifié avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le prix.",
        variant: "destructive",
      });
    },
  });

  const handleStockChange = (product: Pneu, change: number) => {
    const newStock = Math.max(0, product.stock + change);
    updateStockMutation.mutate({ id: product.id, newStock });
  };

  const handlePriceUpdate = (productId: number, newPrice: number) => {
    if (newPrice > 0) {
      updatePriceMutation.mutate({ id: productId, newPrice });
    }
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive";
    if (stock <= 5) return "secondary";
    if (stock <= 10) return "outline";
    return "default";
  };

  const getStockBadgeText = (stock: number) => {
    if (stock === 0) return "Rupture";
    if (stock <= 5) return `Stock faible (${stock})`;
    return `En stock (${stock})`;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des produits</h2>
          <p className="text-muted-foreground">
            Gérez votre stock et vos prix
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Catalogue produits
          </CardTitle>
          <CardDescription>
            {products?.length || 0} produits au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prix (DT)</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {product.marque} {product.modele}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {product.dimensions}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue={product.prix}
                          className="w-20"
                          min="0"
                          step="0.01"
                          onBlur={(e) => {
                            const newPrice = parseFloat(e.target.value);
                            if (newPrice !== product.prix && newPrice > 0) {
                              handlePriceUpdate(product.id, newPrice);
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockChange(product, -1)}
                          disabled={product.stock === 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{product.stock}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockChange(product, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStockBadgeVariant(product.stock)}>
                        {getStockBadgeText(product.stock)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};