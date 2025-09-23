import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CSVProductRow {
  produit: string;
  code: string;
  designation: string;
  stock_disponible: string;
  prix_achat_ht: string;
  remise: string;
  marge: string;
  prix_vente_ht: string;
  taux_tva: string;
  prix_vente_ttc: string;
}

const CSVImport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    success: number;
    errors: string[];
    total: number;
  } | null>(null);

  const parseCSV = (text: string): CSVProductRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        // Mapper les en-têtes aux champs attendus
        const fieldMapping: Record<string, string> = {
          'produit': 'produit',
          'product': 'produit',
          'code': 'code',
          'code produit': 'code',
          'designation': 'designation',
          'designation longue': 'designation',
          'description': 'designation',
          'stock disponible': 'stock_disponible',
          'stock': 'stock_disponible',
          'prix achat ht': 'prix_achat_ht',
          'prix d\'achat ht': 'prix_achat_ht',
          'prix achat': 'prix_achat_ht',
          'remise': 'remise',
          'discount': 'remise',
          'marge': 'marge',
          'margin': 'marge',
          'prix vente ht': 'prix_vente_ht',
          'prix de vente ht': 'prix_vente_ht',
          'taux tva': 'taux_tva',
          'tva': 'taux_tva',
          'tax': 'taux_tva',
          'prix vente ttc': 'prix_vente_ttc',
          'prix de vente ttc': 'prix_vente_ttc',
          'prix ttc': 'prix_vente_ttc'
        };
        
        const mappedField = fieldMapping[header] || header;
        row[mappedField] = values[index] || '';
      });
      
      return row as CSVProductRow;
    });
  };

  const findCategoryByName = async (productName: string): Promise<number> => {
    // Essayer de trouver une catégorie qui correspond au nom du produit
    const { data: categories } = await supabase
      .from('categories')
      .select('id, nom, code');
    
    if (!categories) return 1; // Catégorie par défaut
    
    // Recherche par correspondance de nom
    const matchedCategory = categories.find(cat => 
      productName.toLowerCase().includes(cat.nom.toLowerCase()) ||
      cat.nom.toLowerCase().includes(productName.toLowerCase())
    );
    
    return matchedCategory?.id || 1; // Retourner la première catégorie par défaut
  };

  const processCSVData = async (data: CSVProductRow[]) => {
    const errors: string[] = [];
    let successCount = 0;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress((i / data.length) * 100);
      
      try {
        // Validation des données requises
        if (!row.code || !row.designation) {
          errors.push(`Ligne ${i + 2}: Code ou désignation manquant`);
          continue;
        }
        
        // Conversion des valeurs numériques
        const prixAchatHT = parseFloat(row.prix_achat_ht) || 0;
        const tauxTVA = parseFloat(row.taux_tva) || 19;
        const prixVenteTTC = parseFloat(row.prix_vente_ttc) || 0;
        
        // Calcul du prix de vente HT si pas fourni
        let prixVenteHT = parseFloat(row.prix_vente_ht) || 0;
        if (prixVenteHT === 0 && prixVenteTTC > 0) {
          prixVenteHT = prixVenteTTC / (1 + tauxTVA / 100);
        }
        
        // Calcul du prix TTC si pas fourni
        const prixCalculeTTC = prixVenteHT * (1 + tauxTVA / 100);
        
        // Trouver la catégorie
        const categorieId = await findCategoryByName(row.produit || row.designation);
        
        // Générer un code unique si nécessaire
        let code = parseInt(row.code);
        if (isNaN(code)) {
          code = Date.now() + i; // Code temporaire unique
        }
        
        // Insérer le produit dans la base de données
        const { error } = await supabase
          .from('catalogue_produits')
          .upsert({
            code,
            categorie_id: categorieId,
            designation: row.designation,
            stock_reel: parseInt(row.stock_disponible) || 0,
            stock_disponible: parseInt(row.stock_disponible) || 0,
            prix_achat: prixAchatHT,
            prix_moyen_achat: prixAchatHT,
            prix_vente: prixCalculeTTC,
            valeur_stock: (parseInt(row.stock_disponible) || 0) * prixAchatHT,
            taux_tva: tauxTVA,
            coefficient: prixVenteHT > 0 ? (prixVenteHT / prixAchatHT) : 1,
            actif: true
          }, {
            onConflict: 'code'
          });
        
        if (error) {
          errors.push(`Ligne ${i + 2}: ${error.message}`);
        } else {
          successCount++;
        }
      } catch (error) {
        errors.push(`Ligne ${i + 2}: Erreur de traitement - ${error}`);
      }
    }
    
    setProgress(100);
    return { success: successCount, errors, total: data.length };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier CSV",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setProgress(0);
    setResults(null);
    
    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      if (data.length === 0) {
        throw new Error("Aucune donnée trouvée dans le fichier CSV");
      }
      
      const results = await processCSVData(data);
      setResults(results);
      
      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['catalogue-produits'] });
      
      toast({
        title: "Import terminé",
        description: `${results.success} produits importés avec succès`,
      });
      
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: `Erreur lors de l'import: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import CSV Produits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            Format CSV attendu: Produit, Code, Désignation Longue, Stock Disponible, 
            Prix d'achat HT, Remise, Marge, Prix de vente HT, Taux TVA, Prix de Vente TTC
          </AlertDescription>
        </Alert>
        
        <div>
          <Label htmlFor="csv-file">Fichier CSV</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
        
        {file && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}
        
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Import en cours...</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        {results && (
          <Alert className={results.errors.length > 0 ? "border-yellow-500" : "border-green-500"}>
            {results.errors.length > 0 ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              <div className="space-y-1">
                <div>✅ {results.success} produits importés avec succès</div>
                <div>📊 Total traité: {results.total}</div>
                {results.errors.length > 0 && (
                  <div>
                    <div className="font-medium">❌ Erreurs ({results.errors.length}):</div>
                    <ul className="list-disc list-inside text-xs mt-1 max-h-20 overflow-y-auto">
                      {results.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {results.errors.length > 5 && (
                        <li>... et {results.errors.length - 5} autres erreurs</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleImport} 
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? "Import en cours..." : "Importer les produits"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CSVImport;