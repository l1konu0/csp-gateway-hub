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
import { useCSV } from '@/contexts/CSVContext';
import { TestCSV } from './TestCSV';
import { Plus, Edit, Package, Save, X, Trash2, Filter, Upload, Download, RefreshCw } from 'lucide-react';
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

interface ProduitCSV {
  id?: number;
  code: number;
  categorie_id: number;
  designation: string;
  stock_reel: number;
  stock_disponible: number;
  prix_achat: number;
  prix_moyen_achat: number;
  prix_vente: number;
  valeur_stock: number;
  taux_tva: number;
  coefficient: number;
  actif: boolean;
  synced?: boolean;
}

export const AdminProducts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { csvProducts, clearCsvProducts, removeCsvProduct, addCsvProducts } = useCSV();
  
  // Debug: Afficher le nombre de produits CSV
  console.log('AdminProducts - Nombre de produits CSV:', csvProducts.length);
  const [editingProduct, setEditingProduct] = useState<Pneu | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showOnlyOutOfStock, setShowOnlyOutOfStock] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Pneu | null>(null);
  const [showCSVProducts, setShowCSVProducts] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
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

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await supabase
        .from('pneus')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['pneus'] }); // Invalider aussi pour le site public
      setProductToDelete(null);
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit.",
        variant: "destructive",
      });
    },
  });

  const syncCSVToCatalogueMutation = useMutation({
    mutationFn: async (products: ProduitCSV[]) => {
      console.log('Début de synchronisation de', products.length, 'produits');
      console.log('Premier produit à synchroniser:', products[0]);
      
      const { data, error } = await supabase
        .from('catalogue_produits')
        .upsert(products, { 
          onConflict: 'code',
          ignoreDuplicates: false 
        });

      console.log('Résultat de la synchronisation:', { data, error });

      if (error) {
        console.error('Erreur de synchronisation:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      console.log('Synchronisation réussie:', data);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['pneus'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits'] });
      toast({
        title: "Synchronisation réussie",
        description: "Les produits CSV ont été synchronisés avec le catalogue.",
      });
    },
    onError: (error) => {
      console.error('Erreur de synchronisation:', error);
      toast({
        title: "Erreur de synchronisation",
        description: `Impossible de synchroniser les produits CSV: ${error.message}`,
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

  const handleCSVImport = (products: ProduitCSV[]) => {
    setShowCSVProducts(true);
    toast({
      title: "Import CSV réussi",
      description: `${products.length} produits importés depuis le CSV.`,
    });
  };

  const handleSyncToCatalogue = () => {
    console.log('Tentative de synchronisation de', csvProducts.length, 'produits');
    if (csvProducts.length > 0) {
      // Valider la structure des produits
      const invalidProducts = csvProducts.filter(p => 
        !p.code || !p.categorie_id || !p.designation
      );
      
      if (invalidProducts.length > 0) {
        console.error('Produits invalides trouvés:', invalidProducts);
        toast({
          title: "Erreur de validation",
          description: `${invalidProducts.length} produits ont des données manquantes.`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('Tous les produits sont valides, début de la synchronisation');
      setIsSyncing(true);
      syncCSVToCatalogueMutation.mutate(csvProducts, {
        onSettled: () => {
          console.log('Synchronisation terminée');
          setIsSyncing(false);
          clearCsvProducts();
          setShowCSVProducts(false);
        }
      });
    } else {
      console.log('Aucun produit CSV à synchroniser');
      toast({
        title: "Aucun produit",
        description: "Aucun produit CSV à synchroniser.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCSVProduct = (index: number) => {
    removeCsvProduct(index);
  };

  // Filtrer les produits selon le filtre sélectionné
  const filteredProducts = showCSVProducts ? csvProducts : (products?.filter(product => {
    if (showOnlyOutOfStock) {
      return product.stock === 0;
    }
    return true;
  }) || []);

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
      <TestCSV />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des produits</h2>
          <p className="text-muted-foreground">
            Gérez votre stock et vos prix - Version 2.0 avec CSV
          </p>
        </div>
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
          <div className="flex items-center gap-2">
            <Button
              variant={showCSVProducts ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCSVProducts(!showCSVProducts)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Produits CSV ({csvProducts.length})
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSyncToCatalogue}
              disabled={isSyncing}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isSyncing ? "Synchronisation..." : `Synchroniser (${csvProducts.length})`}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Test: ajouter un produit CSV de test
                const testProduct = {
                  code: 99999,
                  categorie_id: 1,
                  designation: "Test produit CSV",
                  stock_reel: 10,
                  stock_disponible: 10,
                  prix_achat: 100,
                  prix_moyen_achat: 100,
                  prix_vente: 150,
                  valeur_stock: 1000,
                  taux_tva: 19,
                  coefficient: 1.5,
                  actif: true
                };
                addCsvProducts([testProduct]);
                console.log('Produit de test ajouté:', testProduct);
              }}
            >
              Test CSV
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            {showCSVProducts ? (
              `${filteredProducts.length} produits CSV en attente de synchronisation`
            ) : (
              `${filteredProducts.length} produits ${showOnlyOutOfStock ? 'en rupture' : 'au total'}`
            )}
            {showOnlyOutOfStock && products && !showCSVProducts && (
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
                  {showCSVProducts ? (
                    <>
                      <TableHead>Code</TableHead>
                      <TableHead>Famille</TableHead>
                      <TableHead>Désignation</TableHead>
                      <TableHead>Prix Vente</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Produit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Prix (TND)</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <TableRow key={showCSVProducts ? `csv-${index}` : product.id}>
                    {showCSVProducts ? (
                      // Affichage pour les produits CSV
                      <>
                        <TableCell>
                          <div className="font-medium">{product.code}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Catégorie {product.categorie_id}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={product.designation}>
                            {product.designation}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{product.prix_vente.toFixed(3)} TND</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">{product.stock_reel}</div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveCSVProduct(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      // Affichage pour les produits normaux
                      <>
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
                      </>
                    )}
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