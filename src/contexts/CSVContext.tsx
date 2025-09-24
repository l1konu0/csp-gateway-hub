import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProduitCSV {
  id?: number;
  code: number;
  famille: string;
  designation: string;
  stock_reel: number;
  stock_disponible: number;
  prix_achat: number;
  prix_moyen_achat: number;
  prix_vente: number;
  valeur_stock: number;
  taux_tva: number;
  coefficient: number;
  categorie_id: number;
  actif: boolean;
  synced?: boolean;
}

interface CSVContextType {
  csvProducts: ProduitCSV[];
  setCsvProducts: (products: ProduitCSV[]) => void;
  addCsvProducts: (products: ProduitCSV[]) => void;
  clearCsvProducts: () => void;
  removeCsvProduct: (index: number) => void;
}

const CSVContext = createContext<CSVContextType | undefined>(undefined);

export const CSVProvider = ({ children }: { children: ReactNode }) => {
  // Version 1.0 - Système de communication CSV
  const [csvProducts, setCsvProducts] = useState<ProduitCSV[]>([]);
  
  // Debug: Afficher le nombre de produits CSV
  console.log('CSVProvider - Nombre de produits CSV:', csvProducts.length);

  const addCsvProducts = (products: ProduitCSV[]) => {
    setCsvProducts(prev => [...prev, ...products]);
  };

  const clearCsvProducts = () => {
    setCsvProducts([]);
  };

  const removeCsvProduct = (index: number) => {
    setCsvProducts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <CSVContext.Provider value={{
      csvProducts,
      setCsvProducts,
      addCsvProducts,
      clearCsvProducts,
      removeCsvProduct
    }}>
      {children}
    </CSVContext.Provider>
  );
};

export const useCSV = () => {
  const context = useContext(CSVContext);
  if (context === undefined) {
    throw new Error('useCSV must be used within a CSVProvider');
  }
  return context;
};
