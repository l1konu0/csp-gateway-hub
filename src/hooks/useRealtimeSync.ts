/**
 * Hook pour la synchronisation en temps réel avec Supabase
 */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Écouter les changements sur la table catalogue_produits
    const catalogueSubscription = supabase
      .channel('catalogue_produits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'catalogue_produits'
        },
        (payload) => {
          console.log('Changement détecté dans catalogue_produits:', payload);
          
          // Invalider les caches concernés
          queryClient.invalidateQueries({ queryKey: ['catalogue-produits'] });
          queryClient.invalidateQueries({ queryKey: ['catalogue-produits-admin'] });
          queryClient.invalidateQueries({ queryKey: ['pneus'] });
          queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        }
      )
      .subscribe();

    // Écouter les changements sur la table pneus
    const pneusSubscription = supabase
      .channel('pneus_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pneus'
        },
        (payload) => {
          console.log('Changement détecté dans pneus:', payload);
          
          // Invalider les caches concernés
          queryClient.invalidateQueries({ queryKey: ['pneus'] });
          queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          queryClient.invalidateQueries({ queryKey: ['pneus-admin'] });
        }
      )
      .subscribe();

    // Nettoyer les abonnements
    return () => {
      catalogueSubscription.unsubscribe();
      pneusSubscription.unsubscribe();
    };
  }, [queryClient]);
};
