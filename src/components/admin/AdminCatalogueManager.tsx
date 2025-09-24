/**
 * Gestionnaire de catalogue - Interface de modification directe des produits du catalogue
 */

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { 
  Plus, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw,
  Package,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProduitCatalogue {
  id: number;
  code: number;
  categorie_id: number;
  famille: string | null;
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
  created_at: string;
  updated_at: string;
  categories?: {
    id: number;
    code: string;
    nom: string;
    description: string | null;
  };
}

export const AdminCatalogueManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Activer la synchronisation en temps réel
  useRealtimeSync();
  
  // États locaux
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProduitCatalogue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProduitCatalogue | null>(null);
  
  // Nouveau produit
  const [newProduct, setNewProduct] = useState({
    code: 0,
    categorie_id: 1,
    famille: '',
    designation: '',
    stock_reel: 0,
    stock_disponible: 0,
    prix_achat: 0,
    prix_moyen_achat: 0,
    prix_vente: 0,
    valeur_stock: 0,
    taux_tva: 19,
    coefficient: 1.0,
    actif: true
  });

  // Récupérer les catégories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('nom', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Récupérer les produits du catalogue
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['catalogue-produits-admin', searchQuery, selectedCategory, showInactive],
    queryFn: async () => {
      let query = supabase
        .from('catalogue_produits')
        .select(`
          *,
          categories (
            id,
            code,
            nom,
            description
          )
        `)
        .order('code', { ascending: true });

      // Filtre par recherche
      if (searchQuery) {
        query = query.or(`designation.ilike.%${searchQuery}%,code.eq.${parseInt(searchQuery) || 0}`);
      }

      // Filtre par catégorie
      if (selectedCategory !== 'all') {
        query = query.eq('categorie_id', parseInt(selectedCategory));
      }

      // Filtre par statut actif
      if (!showInactive) {
        query = query.eq('actif', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ProduitCatalogue[];
    }
  });

  // Mutation pour ajouter un produit
  const addProductMutation = useMutation({
    mutationFn: async (product: typeof newProduct) => {
      const { error } = await supabase
        .from('catalogue_produits')
        .insert([product]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits-admin'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits'] });
      setIsAddDialogOpen(false);
      setNewProduct({
        code: 0,
        categorie_id: 1,
        famille: '',
        designation: '',
        stock_reel: 0,
        stock_disponible: 0,
        prix_achat: 0,
        prix_moyen_achat: 0,
        prix_vente: 0,
        valeur_stock: 0,
        taux_tva: 19,
        coefficient: 1.0,
        actif: true
      });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté au catalogue avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter le produit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation pour modifier un produit
  const updateProductMutation = useMutation({
    mutationFn: async (product: ProduitCatalogue) => {
      const { error } = await supabase
        .from('catalogue_produits')
        .update(product)
        .eq('id', product.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits-admin'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits'] });
      queryClient.invalidateQueries({ queryKey: ['pneus'] }); // Invalider aussi les pneus
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
        description: `Impossible de modifier le produit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation pour supprimer un produit
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await supabase
        .from('catalogue_produits')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits-admin'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits'] });
      queryClient.invalidateQueries({ queryKey: ['pneus'] }); // Invalider aussi les pneus
      setProductToDelete(null);
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé du catalogue.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le produit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation pour basculer le statut actif
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, actif }: { id: number; actif: boolean }) => {
      const { error } = await supabase
        .from('catalogue_produits')
        .update({ actif })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits-admin'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits'] });
      queryClient.invalidateQueries({ queryKey: ['pneus'] }); // Invalider aussi les pneus
      toast({
        title: "Statut modifié",
        description: "Le statut du produit a été modifié.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de modifier le statut: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleAddProduct = () => {
    if (!newProduct.code || !newProduct.designation || newProduct.prix_vente <= 0) {
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

  const handleToggleActive = (product: ProduitCatalogue) => {
    toggleActiveMutation.mutate({ id: product.id, actif: !product.actif });
  };

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.designation.toLowerCase().includes(searchLower) ||
        product.code.toString().includes(searchQuery) ||
        (product.famille && product.famille.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  // Calculer les statistiques
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.actif).length;
  const productsInStock = products.filter(p => p.actif && p.stock_disponible > 0).length;
  const productsOutOfStock = products.filter(p => p.actif && p.stock_disponible === 0).length;
  const inactiveProducts = products.filter(p => !p.actif).length;

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
      {/* En-tête avec contrôles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion du Catalogue</h2>
          <p className="text-muted-foreground">
            Modifiez directement les produits du catalogue - Mises à jour en temps réel
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showInactive ? 'Masquer inactifs' : 'Afficher inactifs'}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du produit à ajouter au catalogue.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    type="number"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({...newProduct, code: parseInt(e.target.value) || 0})}
                    placeholder="Code unique du produit"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categorie_id">Catégorie *</Label>
                  <Select 
                    value={newProduct.categorie_id.toString()} 
                    onValueChange={(value) => setNewProduct({...newProduct, categorie_id: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nom} ({cat.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="famille">Famille</Label>
                  <Input
                    id="famille"
                    value={newProduct.famille}
                    onChange={(e) => setNewProduct({...newProduct, famille: e.target.value})}
                    placeholder="Code famille (ex: FA0001)"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="designation">Désignation *</Label>
                  <Input
                    id="designation"
                    value={newProduct.designation}
                    onChange={(e) => setNewProduct({...newProduct, designation: e.target.value})}
                    placeholder="Désignation complète du produit"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prix_achat">Prix d'achat (TND)</Label>
                  <Input
                    id="prix_achat"
                    type="number"
                    min="0"
                    step="0.001"
                    value={newProduct.prix_achat}
                    onChange={(e) => setNewProduct({...newProduct, prix_achat: parseFloat(e.target.value) || 0})}
                    placeholder="0.000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prix_vente">Prix de vente (TND) *</Label>
                  <Input
                    id="prix_vente"
                    type="number"
                    min="0"
                    step="0.001"
                    value={newProduct.prix_vente}
                    onChange={(e) => setNewProduct({...newProduct, prix_vente: parseFloat(e.target.value) || 0})}
                    placeholder="0.000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock_reel">Stock réel</Label>
                  <Input
                    id="stock_reel"
                    type="number"
                    min="0"
                    value={newProduct.stock_reel}
                    onChange={(e) => setNewProduct({...newProduct, stock_reel: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock_disponible">Stock disponible</Label>
                  <Input
                    id="stock_disponible"
                    type="number"
                    min="0"
                    value={newProduct.stock_disponible}
                    onChange={(e) => setNewProduct({...newProduct, stock_disponible: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taux_tva">Taux TVA (%)</Label>
                  <Input
                    id="taux_tva"
                    type="number"
                    min="0"
                    max="100"
                    value={newProduct.taux_tva}
                    onChange={(e) => setNewProduct({...newProduct, taux_tva: parseInt(e.target.value) || 19})}
                    placeholder="19"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coefficient">Coefficient</Label>
                  <Input
                    id="coefficient"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.coefficient}
                    onChange={(e) => setNewProduct({...newProduct, coefficient: parseFloat(e.target.value) || 1.0})}
                    placeholder="1.00"
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

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par code, désignation ou famille..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Produits visibles sur le site</p>
                <p className="text-2xl font-bold text-green-600">{productsInStock}</p>
                <p className="text-xs text-muted-foreground">En stock et actifs</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Produits en rupture</p>
                <p className="text-2xl font-bold text-orange-600">{productsOutOfStock}</p>
                <p className="text-xs text-muted-foreground">Actifs mais stock = 0</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total produits actifs</p>
                <p className="text-2xl font-bold text-blue-600">{activeProducts}</p>
                <p className="text-xs text-muted-foreground">Actifs (stock supérieur à 0 + stock = 0)</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Total catalogue</p>
                <p className="text-2xl font-bold text-gray-600">{totalProducts}</p>
                <p className="text-xs text-muted-foreground">Actifs + Inactifs</p>
              </div>
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des produits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produits du catalogue
          </CardTitle>
          <CardDescription>
            {filteredProducts.length} produits trouvés
            {searchQuery && ` pour "${searchQuery}"`}
            {selectedCategory !== 'all' && ` dans la catégorie sélectionnée`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Famille</TableHead>
                  <TableHead>Désignation</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix Vente</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.code}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.famille || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={product.designation}>
                        {product.designation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {product.categories?.nom || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.prix_vente.toFixed(3)} TND</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        {product.stock_disponible > 0 ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {product.stock_disponible}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            {product.stock_disponible}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={product.actif ? "default" : "outline"}
                        onClick={() => handleToggleActive(product)}
                        disabled={toggleActiveMutation.isPending}
                      >
                        {product.actif ? 'Actif' : 'Inactif'}
                      </Button>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations du produit sélectionné.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code</Label>
                <Input
                  id="edit-code"
                  type="number"
                  value={editingProduct.code}
                  onChange={(e) => setEditingProduct({...editingProduct, code: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-categorie_id">Catégorie</Label>
                <Select 
                  value={editingProduct.categorie_id.toString()} 
                  onValueChange={(value) => setEditingProduct({...editingProduct, categorie_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nom} ({cat.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-famille">Famille</Label>
                <Input
                  id="edit-famille"
                  value={editingProduct.famille || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, famille: e.target.value})}
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-designation">Désignation</Label>
                <Input
                  id="edit-designation"
                  value={editingProduct.designation}
                  onChange={(e) => setEditingProduct({...editingProduct, designation: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-prix_achat">Prix d'achat (TND)</Label>
                <Input
                  id="edit-prix_achat"
                  type="number"
                  min="0"
                  step="0.001"
                  value={editingProduct.prix_achat}
                  onChange={(e) => setEditingProduct({...editingProduct, prix_achat: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-prix_vente">Prix de vente (TND)</Label>
                <Input
                  id="edit-prix_vente"
                  type="number"
                  min="0"
                  step="0.001"
                  value={editingProduct.prix_vente}
                  onChange={(e) => setEditingProduct({...editingProduct, prix_vente: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-stock_reel">Stock réel</Label>
                <Input
                  id="edit-stock_reel"
                  type="number"
                  min="0"
                  value={editingProduct.stock_reel}
                  onChange={(e) => setEditingProduct({...editingProduct, stock_reel: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-stock_disponible">Stock disponible</Label>
                <Input
                  id="edit-stock_disponible"
                  type="number"
                  min="0"
                  value={editingProduct.stock_disponible}
                  onChange={(e) => setEditingProduct({...editingProduct, stock_disponible: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-taux_tva">Taux TVA (%)</Label>
                <Input
                  id="edit-taux_tva"
                  type="number"
                  min="0"
                  max="100"
                  value={editingProduct.taux_tva}
                  onChange={(e) => setEditingProduct({...editingProduct, taux_tva: parseInt(e.target.value) || 19})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-coefficient">Coefficient</Label>
                <Input
                  id="edit-coefficient"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingProduct.coefficient}
                  onChange={(e) => setEditingProduct({...editingProduct, coefficient: parseFloat(e.target.value) || 1.0})}
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
              Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.designation}" ?
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
