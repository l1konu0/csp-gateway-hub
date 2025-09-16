import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Database, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/useCatalogue";

const ImportData = () => {
  const { toast } = useToast();
  const { data: categories } = useCategories();
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    total: number;
  } | null>(null);

  // Fonction pour mapper le code famille à l'ID de catégorie
  const getCategoryId = (familleCode: string): number | null => {
    const category = categories?.find(cat => cat.code === familleCode);
    return category?.id || null;
  };

  // Fonction pour parser une ligne de données SQL
  const parseSQLLine = (line: string) => {
    // Regex pour extraire les valeurs d'un INSERT
    const match = line.match(/\((\d+),\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*(\d+),\s*([\d.]+)\)/);
    
    if (!match) return null;

    const [, code, famille, designation, stockReel, stockDispo, prixAchat, pamp, prixVente, valeurStock, tauxTva, coef] = match;
    
    const categorieId = getCategoryId(famille);
    if (!categorieId) return null;

    return {
      code: parseInt(code),
      categorie_id: categorieId,
      designation: designation.replace(/\\/g, ''), // Nettoyer les échappements
      stock_reel: parseInt(stockReel),
      stock_disponible: parseInt(stockDispo),
      prix_achat: parseFloat(prixAchat),
      prix_moyen_achat: parseFloat(pamp),
      prix_vente: parseFloat(prixVente),
      valeur_stock: parseFloat(valeurStock),
      taux_tva: parseInt(tauxTva),
      coefficient: parseFloat(coef),
      actif: true
    };
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setProgress(0);
    setImportResults(null);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      // Filtrer les lignes INSERT pour liste_stock
      const insertLines = lines.filter(line => 
        line.trim().startsWith('INSERT INTO `liste_stock`') ||
        line.trim().match(/^\(\d+,/)
      );

      if (insertLines.length === 0) {
        toast({
          title: "Erreur",
          description: "Aucune donnée d'insertion trouvée dans le fichier",
          variant: "destructive",
        });
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      const total = insertLines.length;

      // Traiter les données par batches pour éviter de surcharger la base
      const batchSize = 50;
      
      for (let i = 0; i < insertLines.length; i += batchSize) {
        const batch = insertLines.slice(i, i + batchSize);
        const productsToInsert = [];

        for (const line of batch) {
          const product = parseSQLLine(line);
          if (product) {
            productsToInsert.push(product);
          }
        }

        if (productsToInsert.length > 0) {
          try {
            const { error } = await supabase
              .from('catalogue_produits')
              .upsert(productsToInsert, { 
                onConflict: 'code',
                ignoreDuplicates: false 
              });

            if (error) {
              console.error('Erreur batch:', error);
              errorCount += productsToInsert.length;
            } else {
              successCount += productsToInsert.length;
            }
          } catch (batchError) {
            console.error('Erreur batch:', batchError);
            errorCount += productsToInsert.length;
          }
        }

        // Mettre à jour le progrès
        setProgress(Math.round(((i + batchSize) / total) * 100));
      }

      setImportResults({
        success: successCount,
        errors: errorCount,
        total: successCount + errorCount
      });

      if (successCount > 0) {
        toast({
          title: "Import terminé",
          description: `${successCount} produits importés avec succès`,
        });
      }

    } catch (error) {
      console.error('Erreur import:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'import du fichier",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Import de Données
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Utilisez cette fonction pour importer vos produits depuis votre fichier SQL. 
            Le système recherchera automatiquement les lignes INSERT pour la table liste_stock.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="sql-file">Fichier SQL à importer</Label>
            <Input
              id="sql-file"
              type="file"
              accept=".sql,.txt"
              onChange={handleFileImport}
              disabled={isImporting}
              className="mt-2"
            />
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Import en cours...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {importResults && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">Import terminé</span>
              </div>
              
              <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
                <div>Total traité: {importResults.total} produits</div>
                <div className="text-green-600">Succès: {importResults.success}</div>
                {importResults.errors > 0 && (
                  <div className="text-red-600">Erreurs: {importResults.errors}</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Instructions d'utilisation:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
            <li>Sélectionnez votre fichier SQL contenant les données liste_stock</li>
            <li>Le système détectera automatiquement les lignes d'insertion</li>
            <li>Les produits seront mappés aux bonnes catégories (FA0001-FA0006)</li>
            <li>L'import se fait par batches pour optimiser les performances</li>
            <li>Les doublons seront automatiquement remplacés</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportData;