import React from 'react';
import { useCSV } from '@/contexts/CSVContext';

export const TestCSV = () => {
  try {
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
        TEST CSV: {csvProducts?.length || 0} produits
      </div>
    );
  } catch (error) {
    console.error('Erreur TestCSV:', error);
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
        ERREUR CSV
      </div>
    );
  }
};
