import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Search, Upload, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useCategories, 
  useProduitsCatalogue, 
  useAjouterProduit, 
  useMettreAJourProduit,
  ProduitCatalogue 
} from "@/hooks/useCatalogue";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ImportData from "./ImportData";

const AdminCatalogue = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProduitCatalogue | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    code: 0,
    categorie_id: 0,
    designation: "",
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

  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: produits, isLoading: loadingProduits } = useProduitsCatalogue();
  const ajouterProduit = useAjouterProduit();
  const mettreAJourProduit = useMettreAJourProduit();

  const deleteProductsMutation = useMutation({
    mutationFn: async (productIds: number[]) => {
      const { error } = await supabase
        .from('catalogue_produits')
        .delete()
        .in('id', productIds);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits'] });
      setSelectedProducts([]);
      setShowDeleteMode(false);
      toast({
        title: "Produits supprimés",
        description: `${selectedProducts.length} produit(s) supprimé(s) avec succès.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les produits.",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = produits?.filter(produit =>
    produit.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produit.code.toString().includes(searchQuery) ||
    produit.categories?.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async () => {
    try {
      await ajouterProduit.mutateAsync(newProduct);
      toast({
        title: "Succès",
        description: "Produit ajouté avec succès",
      });
      setIsAddDialogOpen(false);
      setNewProduct({
        code: 0,
        categorie_id: 0,
        designation: "",
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
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du produit",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      await mettreAJourProduit.mutateAsync(editingProduct);
      toast({
        title: "Succès",
        description: "Produit modifié avec succès",
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du produit",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { variant: "destructive" as const, text: "Rupture" };
    if (stock < 5) return { variant: "secondary" as const, text: "Faible" };
    return { variant: "default" as const, text: "En stock" };
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
      setSelectedProducts(filteredProducts?.map(p => p.id) || []);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      deleteProductsMutation.mutate(selectedProducts);
    }
  };

  if (loadingCategories || loadingProduits) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestion du Catalogue
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
                  <Button 
                    variant="outline" 
                    onClick={() => setShowImport(!showImport)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import SQL
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
              {!showDeleteMode && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Produit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajouter un Produit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="code">Code Produit</Label>
                      <Input
                        id="code"
                        type="number"
                        value={newProduct.code}
                        onChange={(e) => setNewProduct({...newProduct, code: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="categorie">Catégorie</Label>
                      <Select
                        value={newProduct.categorie_id.toString()}
                        onValueChange={(value) => setNewProduct({...newProduct, categorie_id: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.code} - {cat.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="designation">Désignation</Label>
                      <Textarea
                        id="designation"
                        value={newProduct.designation}
                        onChange={(e) => setNewProduct({...newProduct, designation: e.target.value})}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prix_vente">Prix de Vente (TND)</Label>
                        <Input
                          id="prix_vente"
                          type="number"
                          step="0.001"
                          value={newProduct.prix_vente}
                          onChange={(e) => setNewProduct({...newProduct, prix_vente: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock_disponible">Stock</Label>
                        <Input
                          id="stock_disponible"
                          type="number"
                          value={newProduct.stock_disponible}
                          onChange={(e) => setNewProduct({...newProduct, stock_disponible: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>

                    <Button onClick={handleAddProduct} className="w-full">
                      Ajouter le Produit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showImport && (
            <div className="mb-6">
              <ImportData />
            </div>
          )}
          
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {showDeleteMode && (
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedProducts.length === filteredProducts?.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>Code</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Désignation</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts?.map((produit) => {
                const stockStatus = getStockStatus(produit.stock_disponible);
                return (
                  <TableRow key={produit.id}>
                    {showDeleteMode && (
                      <TableCell>
                        <Checkbox 
                          checked={selectedProducts.includes(produit.id)}
                          onCheckedChange={(checked) => handleSelectProduct(produit.id, checked as boolean)}
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-mono">{produit.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {produit.categories?.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {produit.designation}
                    </TableCell>
                    <TableCell>{produit.prix_vente.toFixed(3)} TND</TableCell>
                    <TableCell>{produit.stock_disponible}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingProduct(produit);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le Produit</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_designation">Désignation</Label>
                <Textarea
                  id="edit_designation"
                  value={editingProduct.designation}
                  onChange={(e) => setEditingProduct({...editingProduct, designation: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_prix_vente">Prix de Vente (TND)</Label>
                  <Input
                    id="edit_prix_vente"
                    type="number"
                    step="0.001"
                    value={editingProduct.prix_vente}
                    onChange={(e) => setEditingProduct({...editingProduct, prix_vente: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_stock">Stock</Label>
                  <Input
                    id="edit_stock"
                    type="number"
                    value={editingProduct.stock_disponible}
                    onChange={(e) => setEditingProduct({...editingProduct, stock_disponible: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <Button onClick={handleUpdateProduct} className="w-full">
                Mettre à jour
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCatalogue;