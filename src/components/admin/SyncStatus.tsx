/**
 * Composant pour afficher le statut de synchronisation
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSyncStatus } from "@/hooks/useSync"
import { RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react"

export function SyncStatus() {
  const { data: syncStatus, isLoading, error } = useSyncStatus()

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Statut de synchronisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            Erreur de synchronisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">
            Impossible de récupérer le statut
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!syncStatus) {
    return null
  }

  const isSynced = syncStatus.catalogue_count === syncStatus.pneus_count
  const lastSyncDate = syncStatus.last_sync ? new Date(syncStatus.last_sync) : null

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {isSynced ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          )}
          Statut de synchronisation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Produits catalogue:</span>
          <Badge variant="outline">{syncStatus.catalogue_count}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Produits site:</span>
          <Badge variant={isSynced ? "default" : "secondary"}>
            {syncStatus.pneus_count}
          </Badge>
        </div>
        {lastSyncDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Dernière sync: {lastSyncDate.toLocaleString()}
            </span>
          </div>
        )}
        {!isSynced && (
          <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
            ⚠️ Les données ne sont pas synchronisées. Utilisez le bouton de synchronisation.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
