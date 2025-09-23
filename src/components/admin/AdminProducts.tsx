import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Package, Save, X, Trash2, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showOnlyOutOfStock, setShowOnlyOutOfStock] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Pneu | null>(null);
  const [newProduct, setNewProduct] = useState({
    marque: '',
    modele: '',
    dimensions: '',
    type: 'pneu',
    prix: 0,
    stock: 0,
    description: '',
    image_url: ''
  });

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

  const addProductMutation = useMutation({
    mutationFn: async (product: typeof newProduct) => {
      const { error } = await supabase
        .from('pneus')
        .insert([product]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['pneus'] }); // Invalider aussi pour le site public
      setIsAddDialogOpen(false);
      setNewProduct({
        marque: '',
        modele: '',
        dimensions: '',
        type: 'pneu',
        prix: 0,
        stock: 0,
        description: '',
        image_url: ''
      });
      toast({
        title: "Produit ajouté",
        description: "Le nouveau produit a été ajouté avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (product: Pneu) => {
      const { error } = await supabase
        .from('pneus')
        .update(product)
        .eq('id', product.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['pneus'] }); // Invalider aussi pour le site public
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le produit.",
        variant: "destructive",
      });
    },
  });

<<<<<<< HEAD
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await supabase
        .from('pneus')
        .delete()
        .eq('id', productId);
=======
  const deleteProductsMutation = useMutation({
    mutationFn: async (productIds: number[]) => {
      const { error } = await supabase
        .from('pneus')
        .delete()
        .in('id', productIds);
>>>>>>> 5ec9ae76dcb74645cf7cf0413f52bc3af8a1ac86

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
<<<<<<< HEAD
      queryClient.invalidateQueries({ queryKey: ['pneus'] }); // Invalider aussi pour le site public
      setProductToDelete(null);
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
=======
      queryClient.invalidateQueries({ queryKey: ['pneus'] });
      setSelectedProducts([]);
      setShowDeleteMode(false);
      toast({
        title: "Produits supprimés",
        description: `${selectedProducts.length} produit(s) supprimé(s) avec succès.`,
>>>>>>> 5ec9ae76dcb74645cf7cf0413f52bc3af8a1ac86
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
<<<<<<< HEAD
        description: "Impossible de supprimer le produit.",
=======
        description: "Impossible de supprimer les produits.",
>>>>>>> 5ec9ae76dcb74645cf7cf0413f52bc3af8a1ac86
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

  const handleAddProduct = () => {
    if (!newProduct.marque || !newProduct.modele || !newProduct.dimensions || newProduct.prix <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    addProductMutation.mutate(newProduct);
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      updateProductMutation.mutate(editingProduct);
    }
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id);
    }
  };

  // Filtrer les produits selon le filtre sélectionné
  const filteredProducts = products?.filter(product => {
    if (showOnlyOutOfStock) {
      return product.stock === 0;
    }
    return true;
  }) || [];

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

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products?.map(p => p.id) || []);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      deleteProductsMutation.mutate(selectedProducts);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des produits</h2>
          <p className="text-muted-foreground">
            Gérez votre stock et vos prix
          </p>
        </div>
<<<<<<< HEAD
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Button
              variant={showOnlyOutOfStock ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyOutOfStock(!showOnlyOutOfStock)}
            >
              {showOnlyOutOfStock ? "Tous les produits" : "Produits en rupture"}
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
=======
        <div className="flex gap-2">
          {!showDeleteMode ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteMode(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </>
          ) : (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={selectedProducts.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer ({selectedProducts.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer {selectedProducts.length} produit(s) ? 
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteSelected}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteMode(false);
                  setSelectedProducts([]);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </>
          )}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
>>>>>>> 5ec9ae76dcb74645cf7cf0413f52bc3af8a1ac86
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau produit</DialogTitle>
              <DialogDescription>
                Remplissez les informations du produit à ajouter au catalogue.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de produit</Label>
                <Select 
                  value={newProduct.type} 
                  onValueChange={(value) => setNewProduct({...newProduct, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pneu">Pneu</SelectItem>
                    <SelectItem value="jante">Jante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="marque">Marque *</Label>
                <Input
                  id="marque"
                  value={newProduct.marque}
                  onChange={(e) => setNewProduct({...newProduct, marque: e.target.value})}
                  placeholder="Ex: Michelin, BBS..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modele">Modèle *</Label>
                <Input
                  id="modele"
                  value={newProduct.modele}
                  onChange={(e) => setNewProduct({...newProduct, modele: e.target.value})}
                  placeholder="Ex: Pilot Sport, LM..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions *</Label>
                <Input
                  id="dimensions"
                  value={newProduct.dimensions}
                  onChange={(e) => setNewProduct({...newProduct, dimensions: e.target.value})}
                  placeholder="Ex: 225/45R17, 17x8 ET35..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prix">Prix (TND) *</Label>
                <Input
                  id="prix"
                  type="number"
                  min="0"
                  step="0.001"
                  value={newProduct.prix}
                  onChange={(e) => setNewProduct({...newProduct, prix: parseFloat(e.target.value) || 0})}
                  placeholder="0.000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock initial</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="image_url">URL de l'image</Label>
                <Input
                  id="image_url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Description détaillée du produit..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                onClick={handleAddProduct}
                disabled={addProductMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {addProductMutation.isPending ? 'Ajout...' : 'Ajouter le produit'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Catalogue produits
          </CardTitle>
          <CardDescription>
            {filteredProducts.length} produits {showOnlyOutOfStock ? 'en rupture' : 'au total'}
            {showOnlyOutOfStock && products && (
              <span className="text-muted-foreground ml-2">
                (sur {products.length} produits total)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {showDeleteMode && (
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedProducts.length === products?.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  <TableHead>Produit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prix (TND)</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    {showDeleteMode && (
                      <TableCell>
                        <Checkbox 
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                      </TableCell>
                    )}
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
                          step="0.001"
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
                      <div className="flex items-center gap-2">
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setProductToDelete(product)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de modification */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations du produit sélectionné.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type de produit</Label>
                <Select 
                  value={editingProduct.type} 
                  onValueChange={(value) => setEditingProduct({...editingProduct, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pneu">Pneu</SelectItem>
                    <SelectItem value="jante">Jante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-marque">Marque</Label>
                <Input
                  id="edit-marque"
                  value={editingProduct.marque}
                  onChange={(e) => setEditingProduct({...editingProduct, marque: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-modele">Modèle</Label>
                <Input
                  id="edit-modele"
                  value={editingProduct.modele}
                  onChange={(e) => setEditingProduct({...editingProduct, modele: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-dimensions">Dimensions</Label>
                <Input
                  id="edit-dimensions"
                  value={editingProduct.dimensions}
                  onChange={(e) => setEditingProduct({...editingProduct, dimensions: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-prix">Prix (TND)</Label>
                <Input
                  id="edit-prix"
                  type="number"
                  min="0"
                  step="0.001"
                  value={editingProduct.prix}
                  onChange={(e) => setEditingProduct({...editingProduct, prix: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-image_url">URL de l'image</Label>
                <Input
                  id="edit-image_url"
                  value={editingProduct.image_url || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button 
              onClick={handleUpdateProduct}
              disabled={updateProductMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProductMutation.isPending ? 'Modification...' : 'Modifier le produit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.marque} {productToDelete?.modele}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setProductToDelete(null)}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={deleteProductMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteProductMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};