/**
 * Types pour la synchronisation entre catalogue_produits et pneus
 */

export interface CatalogueProduit {
  id: number;
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
  created_at: string;
  updated_at: string;
}

export interface Pneu {
  id: number;
  marque: string;
  modele: string;
  dimensions: string;
  type: string;
  prix: number;
  stock: number | null;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SyncResult {
  success: boolean;
  message: string;
  inserted: number;
  updated: number;
  errors: number;
  details?: string[];
}

export interface SyncOptions {
  batchSize?: number;
  dryRun?: boolean;
  forceUpdate?: boolean;
  categoryFilter?: number[];
}

/**
 * Mapping des catégories vers les types de pneus
 */
export const CATEGORY_TO_TYPE_MAP: Record<number, string> = {
  1: 'pneu', // Pneus
  2: 'jante', // Jantes
  3: 'filtre', // Filtres et Huiles
  4: 'batterie', // Batteries
  5: 'accessoire', // Valves et Accessoires
  6: 'chambre', // Chambres à Air
  7: 'lubrifiant', // Lubrifiants
  8: 'accessoire', // Accessoires
};

/**
 * Extraction des informations du pneu depuis la désignation
 */
export interface PneuInfo {
  marque: string;
  modele: string;
  dimensions: string;
  type: string;
}

/**
 * Fonction utilitaire pour extraire les infos d'un pneu depuis sa désignation
 */
export function extractPneuInfo(designation: string, categorieId: number): PneuInfo {
  const words = designation.trim().split(/\s+/);
  
  // Marque (premier mot)
  const marque = words[0] || 'Marque inconnue';
  
  // Dimensions (pattern: 205/55R16, 225/45R17, etc.)
  const dimensionsMatch = designation.match(/\d+\/\d+R\d+/);
  const dimensions = dimensionsMatch ? dimensionsMatch[0] : 'Dimensions inconnues';
  
  // Modèle (mots entre marque et dimensions)
  const modeleStart = 1;
  const modeleEnd = dimensionsMatch ? designation.indexOf(dimensions) : words.length;
  const modele = words.slice(modeleStart, modeleEnd).join(' ').substring(0, 100) || 'Modèle inconnu';
  
  // Type basé sur la catégorie
  const type = CATEGORY_TO_TYPE_MAP[categorieId] || 'pneu';
  
  return {
    marque: marque.substring(0, 50),
    modele,
    dimensions: dimensions.substring(0, 50),
    type
  };
}
