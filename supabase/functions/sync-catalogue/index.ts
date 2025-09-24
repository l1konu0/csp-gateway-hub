/**
 * Edge Function pour synchroniser le catalogue avec les produits
 * POST /functions/v1/sync-catalogue
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncRequest {
  action: 'sync_all' | 'sync_status' | 'sync_single';
  productId?: number;
  options?: {
    batchSize?: number;
    dryRun?: boolean;
    forceUpdate?: boolean;
  };
}

interface SyncResponse {
  success: boolean;
  message: string;
  data?: {
    inserted: number;
    updated: number;
    errors: number;
    details?: string[];
    status?: {
      catalogue_count: number;
      pneus_count: number;
      last_sync: string | null;
    };
  };
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request body
    const { action, productId, options = {} }: SyncRequest = await req.json()

    switch (action) {
      case 'sync_all': {
        // Synchronisation complète
        const { data, error } = await supabase.rpc('sync_all_catalogue_to_pneus')
        
        if (error) {
          throw new Error(`Erreur synchronisation: ${error.message}`)
        }

        const result = data[0]
        return new Response(
          JSON.stringify({
            success: true,
            message: `Synchronisation terminée: ${result.success_count} produits synchronisés, ${result.error_count} erreurs`,
            data: {
              inserted: result.success_count,
              updated: 0,
              errors: result.error_count,
              details: result.details || []
            }
          } as SyncResponse),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'sync_status': {
        // Obtenir le statut de synchronisation
        const { data, error } = await supabase.rpc('get_sync_status')
        
        if (error) {
          throw new Error(`Erreur statut: ${error.message}`)
        }

        const status = data[0]
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Statut récupéré avec succès',
            data: {
              status: {
                catalogue_count: status.catalogue_count,
                pneus_count: status.pneus_count,
                last_sync: status.last_sync
              }
            }
          } as SyncResponse),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'sync_single': {
        // Synchronisation d'un produit spécifique
        if (!productId) {
          throw new Error('ID du produit requis pour la synchronisation individuelle')
        }

        const { data: product, error: productError } = await supabase
          .from('catalogue_produits')
          .select('*')
          .eq('id', productId)
          .single()

        if (productError || !product) {
          throw new Error(`Produit non trouvé: ${productError?.message}`)
        }

        if (product.categorie_id !== 1 || !product.actif) {
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Produit ignoré (pas un pneu actif)',
              data: { inserted: 0, updated: 0, errors: 0 }
            } as SyncResponse),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          )
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

        if (upsertError) {
          throw new Error(`Erreur upsert: ${upsertError.message}`)
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: `Produit ${product.code} synchronisé avec succès`,
            data: { inserted: 1, updated: 0, errors: 0 }
          } as SyncResponse),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      default:
        throw new Error('Action non reconnue')
    }

  } catch (error) {
    console.error('Erreur Edge Function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      } as SyncResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
