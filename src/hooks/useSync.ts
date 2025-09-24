/**
 * Hook personnalisé pour la synchronisation entre catalogue_produits et pneus
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../integrations/supabase/client'
import { SyncResult, SyncOptions } from '../types/sync'

/**
 * Hook pour obtenir le statut de synchronisation
 */
export function useSyncStatus() {
  return useQuery({
    queryKey: ['sync-status'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_sync_status')
      if (error) throw error
      return data[0]
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  })
}

/**
 * Hook pour la synchronisation complète
 */
export function useSyncAll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (options: SyncOptions = {}) => {
      const { data, error } = await supabase.rpc('sync_all_catalogue_to_pneus')
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      // Invalider les caches après synchronisation
      queryClient.invalidateQueries({ queryKey: ['pneus'] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['sync-status'] })
    },
  })
}

/**
 * Hook pour la synchronisation d'un produit individuel
 */
export function useSyncProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: number) => {
      // Récupérer le produit du catalogue
      const { data: product, error: productError } = await supabase
        .from('catalogue_produits')
        .select('*')
        .eq('id', productId)
        .single()

      if (productError) throw productError
      if (!product) throw new Error('Produit non trouvé')

      // Vérifier si c'est un pneu actif
      if (product.categorie_id !== 1 || !product.actif) {
        throw new Error('Le produit n\'est pas un pneu actif')
      }

      // Extraire les informations du pneu
      const designation = product.designation || ''
      const words = designation.trim().split(/\s+/)
      const marque = words[0] || 'Marque inconnue'
      const dimensionsMatch = designation.match(/\d+\/\d+R\d+/)
      const dimensions = dimensionsMatch ? dimensionsMatch[0] : 'Dimensions inconnues'
      const modeleStart = 1
      const modeleEnd = dimensionsMatch ? designation.indexOf(dimensions) : words.length
      const modele = words.slice(modeleStart, modeleEnd).join(' ').substring(0, 100) || 'Modèle inconnu'

      // Insérer ou mettre à jour dans pneus
      const { error: upsertError } = await supabase
        .from('pneus')
        .upsert({
          marque: marque.substring(0, 50),
          modele: modele.substring(0, 100),
          dimensions: dimensions.substring(0, 50),
          type: 'pneu',
          prix: product.prix_vente,
          stock: product.stock_disponible,
          description: designation.substring(0, 500),
          image_url: null
        }, {
          onConflict: 'marque,modele,dimensions'
        })

      if (upsertError) throw upsertError

      return { success: true, product }
    },
    onSuccess: () => {
      // Invalider les caches après synchronisation
      queryClient.invalidateQueries({ queryKey: ['pneus'] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['sync-status'] })
    },
  })
}

/**
 * Hook pour la synchronisation via Edge Function
 */
export function useSyncEdgeFunction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ action, productId, options }: {
      action: 'sync_all' | 'sync_status' | 'sync_single'
      productId?: number
      options?: SyncOptions
    }) => {
      const { data, error } = await supabase.functions.invoke('sync-catalogue', {
        body: { action, productId, options }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Invalider les caches après synchronisation
      queryClient.invalidateQueries({ queryKey: ['pneus'] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['sync-status'] })
    },
  })
}

/**
 * Hook pour la synchronisation en lot avec gestion des erreurs
 */
export function useBatchSync() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (options: SyncOptions = {}) => {
      const batchSize = options.batchSize || 100
      let successCount = 0
      let errorCount = 0
      const errors: string[] = []

      // Récupérer tous les produits de pneus actifs
      const { data: products, error: fetchError } = await supabase
        .from('catalogue_produits')
        .select('*')
        .eq('categorie_id', 1)
        .eq('actif', true)
        .order('id')

      if (fetchError) throw fetchError

      if (!products || products.length === 0) {
        return { successCount: 0, errorCount: 0, errors: [] }
      }

      // Traiter par lots
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize)
        const pneusToInsert = batch.map(product => {
          const designation = product.designation || ''
          const words = designation.trim().split(/\s+/)
          const marque = words[0] || 'Marque inconnue'
          const dimensionsMatch = designation.match(/\d+\/\d+R\d+/)
          const dimensions = dimensionsMatch ? dimensionsMatch[0] : 'Dimensions inconnues'
          const modeleStart = 1
          const modeleEnd = dimensionsMatch ? designation.indexOf(dimensions) : words.length
          const modele = words.slice(modeleStart, modeleEnd).join(' ').substring(0, 100) || 'Modèle inconnu'

          return {
            marque: marque.substring(0, 50),
            modele: modele.substring(0, 100),
            dimensions: dimensions.substring(0, 50),
            type: 'pneu',
            prix: product.prix_vente,
            stock: product.stock_disponible,
            description: designation.substring(0, 500),
            image_url: null
          }
        }).filter(pneu => 
          pneu.marque !== 'Marque inconnue' && 
          pneu.prix > 0 && 
          pneu.dimensions !== 'Dimensions inconnues'
        )

        try {
          const { error: batchError } = await supabase
            .from('pneus')
            .upsert(pneusToInsert, {
              onConflict: 'marque,modele,dimensions',
              ignoreDuplicates: false
            })

          if (batchError) {
            errorCount += batch.length
            errors.push(`Batch ${i}-${i + batch.length}: ${batchError.message}`)
          } else {
            successCount += pneusToInsert.length
          }
        } catch (batchError) {
          errorCount += batch.length
          errors.push(`Batch ${i}-${i + batch.length}: ${batchError}`)
        }
      }

      return { successCount, errorCount, errors }
    },
    onSuccess: () => {
      // Invalider les caches après synchronisation
      queryClient.invalidateQueries({ queryKey: ['pneus'] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['sync-status'] })
    },
  })
}
