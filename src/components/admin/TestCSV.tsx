import React from 'react';
import { useCSV } from '@/contexts/CSVContext';

export const TestCSV = () => {
  const { csvProducts } = useCSV();
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'red', 
      color: 'white', 
      padding: '10px', 
      zIndex: 9999,
      borderRadius: '5px'
    }}>
      TEST CSV: {csvProducts.length} produits
    </div>
  );
};
