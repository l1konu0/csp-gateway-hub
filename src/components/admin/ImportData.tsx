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
import { useCSV } from "@/contexts/CSVContext";

interface ImportDataProps {
  onCSVImport?: (products: any[]) => void;
}

const ImportData = ({ onCSVImport }: ImportDataProps) => {
  const { toast } = useToast();
  const { data: categories } = useCategories();
  const { addCsvProducts } = useCSV();
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

  // Fonction pour convertir une ligne CSV en produit
  const parseCSVToProduct = (csvRow: any, columnMap: any, rowIndex: number = 0) => {
    // Debug: Afficher les données de la ligne
    if (rowIndex < 3) {
      console.log(`Ligne ${rowIndex + 1}:`, csvRow);
      console.log('Column map utilisé:', columnMap);
    }

    // Utiliser le mapping détecté automatiquement
    const code = parseInt(csvRow[columnMap.code] || csvRow.col0 || '0');
    const famille = csvRow[columnMap.famille] || csvRow.col1 || '';
    const designation = csvRow[columnMap.designation] || csvRow.col2 || '';
    const stockReel = parseInt(csvRow[columnMap.stock_reel] || csvRow.col3 || '0');
    const stockDispo = parseInt(csvRow[columnMap.stock_disponible] || csvRow.col4 || '0');
    const prixAchat = parseFloat(csvRow[columnMap.prix_achat] || csvRow.col5 || '0');
    const pamp = parseFloat(csvRow[columnMap.prix_moyen_achat] || csvRow.col6 || '0');
    const prixVente = parseFloat(csvRow[columnMap.prix_vente] || csvRow.col7 || '0');
    const valeurStock = parseFloat(csvRow[columnMap.valeur_stock] || csvRow.col8 || '0');
    const tauxTva = parseInt(csvRow[columnMap.taux_tva] || csvRow.col9 || '19');
    const coef = parseFloat(csvRow[columnMap.coefficient] || csvRow.col10 || '1');

    // Debug: Afficher les valeurs extraites
    if (rowIndex < 3) {
      console.log(`Valeurs extraites ligne ${rowIndex + 1}:`, {
        code, famille, designation, stockReel, stockDispo, prixAchat, pamp, prixVente, valeurStock, tauxTva, coef
      });
    }

    if (!code || !famille || !designation) {
      console.warn(`Ligne ${rowIndex + 1}: Code ou désignation manquant`, { 
        code, famille, designation,
        'code source': csvRow[columnMap.code],
        'famille source': csvRow[columnMap.famille],
        'designation source': csvRow[columnMap.designation]
      });
      return null;
    }

    const categorieId = getCategoryId(famille);
    if (!categorieId) {
      console.warn(`Ligne ${rowIndex + 1}: Catégorie non trouvée pour le code: ${famille}`);
      return null;
    }

    return {
      code,
      categorie_id: categorieId,
      designation: designation.replace(/"/g, ''), // Nettoyer les guillemets
      stock_reel: stockReel,
      stock_disponible: stockDispo,
      prix_achat: prixAchat,
      prix_moyen_achat: pamp,
      prix_vente: prixVente,
      valeur_stock: valeurStock,
      taux_tva: tauxTva,
      coefficient: coef,
      actif: true
    };
  };

  // Fonction pour parser une ligne CSV
  const parseCSVLine = (line: string, headers: string[]) => {
    // Parser CSV simple qui gère les virgules dans les guillemets
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    // Créer un objet avec les headers comme clés
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    return row;
  };

  // Fonction pour détecter automatiquement les colonnes CSV
  const detectCSVColumns = (firstLine: string) => {
    const values = parseCSVLine(firstLine, []);
    const columnMap: any = {};
    
    values.forEach((value, index) => {
      const cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Mapping intelligent des colonnes
      if (cleanValue.includes('code') || cleanValue === 'id') {
        columnMap.code = index;
      } else if (cleanValue.includes('famille') || cleanValue.includes('categorie')) {
        columnMap.famille = index;
      } else if (cleanValue.includes('designation') || cleanValue.includes('nom') || cleanValue.includes('libelle')) {
        columnMap.designation = index;
      } else if (cleanValue.includes('stock') && cleanValue.includes('reel')) {
        columnMap.stock_reel = index;
      } else if (cleanValue.includes('stock') && cleanValue.includes('disponible')) {
        columnMap.stock_disponible = index;
      } else if (cleanValue.includes('prix') && cleanValue.includes('achat')) {
        columnMap.prix_achat = index;
      } else if (cleanValue.includes('prix') && cleanValue.includes('moyen')) {
        columnMap.prix_moyen_achat = index;
      } else if (cleanValue.includes('prix') && cleanValue.includes('vente')) {
        columnMap.prix_vente = index;
      } else if (cleanValue.includes('valeur') && cleanValue.includes('stock')) {
        columnMap.valeur_stock = index;
      } else if (cleanValue.includes('tva')) {
        columnMap.taux_tva = index;
      } else if (cleanValue.includes('coefficient') || cleanValue.includes('coef')) {
        columnMap.coefficient = index;
      }
    });
    
    console.log('Mapping des colonnes détecté:', columnMap);
    return columnMap;
  };

  // Fonction pour parser une ligne de données SQL (gardée pour compatibilité)
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
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      let isCSV = false;
      let headers: string[] = [];
      let dataLines: string[] = [];

      // Détecter le type de fichier
      if (file.name.toLowerCase().endsWith('.csv')) {
        isCSV = true;
        // Parser la première ligne pour obtenir les headers
        const firstLineValues = parseCSVLine(lines[0], []);
        headers = firstLineValues.map((_, i) => `col${i}`);
        dataLines = lines.slice(1);
        
        // Détecter automatiquement les colonnes
        const columnMap = detectCSVColumns(lines[0]);
        
        // Debug: Afficher les headers détectés
        console.log('Headers détectés:', firstLineValues);
        console.log('Première ligne de données:', dataLines[0]);
        console.log('Mapping des colonnes:', columnMap);
      } else {
        // Fichier SQL - garder l'ancienne logique
        dataLines = lines.filter(line => 
          line.trim().startsWith('INSERT INTO `liste_stock`') ||
          line.trim().match(/^\(\d+,/)
        );
      }

      if (dataLines.length === 0) {
        toast({
          title: "Erreur",
          description: isCSV ? "Aucune donnée trouvée dans le fichier CSV" : "Aucune donnée d'insertion trouvée dans le fichier SQL",
          variant: "destructive",
        });
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      const total = dataLines.length;

      // Traiter les données par batches pour éviter de surcharger la base
      const batchSize = 50;
      
      for (let i = 0; i < dataLines.length; i += batchSize) {
        const batch = dataLines.slice(i, i + batchSize);
        const productsToInsert = [];

        for (let j = 0; j < batch.length; j++) {
          const line = batch[j];
          let product = null;
          
          if (isCSV) {
            // Parser CSV
            const csvRow = parseCSVLine(line, headers);
            const columnMap = detectCSVColumns(lines[0]); // Recalculer pour chaque batch
            product = parseCSVToProduct(csvRow, columnMap, i + j);
          } else {
            // Parser SQL
            product = parseSQLLine(line);
          }
          
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
        // Récupérer tous les produits CSV parsés
        const allCSVProducts = [];
        for (let i = 0; i < dataLines.length; i++) {
          const line = dataLines[i];
          if (isCSV) {
            const csvRow = parseCSVLine(line, headers);
            const columnMap = detectCSVColumns(lines[0]);
            const product = parseCSVToProduct(csvRow, columnMap, i);
            if (product) {
              allCSVProducts.push(product);
            }
          }
        }

        // Ajouter les produits CSV au contexte
        if (allCSVProducts.length > 0) {
          addCsvProducts(allCSVProducts);
        }

        // Appeler la fonction de callback si fournie
        if (onCSVImport && allCSVProducts.length > 0) {
          onCSVImport(allCSVProducts);
        }

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
            Utilisez cette fonction pour importer vos produits depuis un fichier CSV ou SQL. 
            Pour les fichiers CSV, assurez-vous que les colonnes contiennent : Code, Famille, Désignation, Stock Réel, Stock Disponible, Prix Achat, Prix Moyen Achat, Prix Vente, Valeur Stock, Taux TVA, Coefficient.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="import-file">Fichier à importer (CSV, SQL, TXT)</Label>
            <Input
              id="import-file"
              type="file"
              accept=".csv,.sql,.txt"
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
            <li><strong>Pour les fichiers CSV :</strong> Assurez-vous que la première ligne contient les en-têtes de colonnes</li>
            <li><strong>Pour les fichiers SQL :</strong> Le système détectera automatiquement les lignes d'insertion</li>
            <li>Les produits seront mappés aux bonnes catégories (FA0001-FA0006)</li>
            <li>L'import se fait par batches pour optimiser les performances</li>
            <li>Les doublons seront automatiquement remplacés</li>
            <li><strong>Format CSV attendu :</strong> Code, Famille, Désignation, Stock Réel, Stock Disponible, Prix Achat, Prix Moyen Achat, Prix Vente, Valeur Stock, Taux TVA, Coefficient</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportData;