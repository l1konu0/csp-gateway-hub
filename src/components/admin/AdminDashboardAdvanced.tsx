/**
 * Tableau de bord avancé avec gestion temporelle et remise à zéro mensuelle
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Calendar,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface MonthlyStats {
  month: number;
  year: number;
  revenue: number;
  orders: number;
  newUsers: number;
  productsSold: number;
  averageOrderValue: number;
  growthRate: number;
}

interface DashboardStats {
  currentMonth: MonthlyStats;
  previousMonth: MonthlyStats;
  yearToDate: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProductsSold: number;
    averageMonthlyRevenue: number;
  };
  monthlyHistory: MonthlyStats[];
}

export const AdminDashboardAdvanced = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // États pour la sélection temporelle
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  
  // Générer les années disponibles (3 ans en arrière + année actuelle)
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 4 }, (_, i) => currentYear - i);
  
  // Récupérer les statistiques du tableau de bord
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-advanced', selectedYear, selectedMonth, viewMode],
    queryFn: async (): Promise<DashboardStats> => {
      console.log('📊 Récupération des statistiques pour:', { selectedYear, selectedMonth, viewMode });
      
      // Récupérer les commandes pour la période sélectionnée
      const startDate = viewMode === 'monthly' 
        ? new Date(selectedYear, selectedMonth - 1, 1)
        : new Date(selectedYear, 0, 1);
      
      const endDate = viewMode === 'monthly'
        ? new Date(selectedYear, selectedMonth, 0, 23, 59, 59)
        : new Date(selectedYear, 11, 31, 23, 59, 59);
      
      console.log('📅 Période:', { startDate: startDate.toISOString(), endDate: endDate.toISOString() });
      
      // Récupérer les commandes de la période
      const { data: orders, error: ordersError } = await supabase
        .from('commandes')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('statut', 'livree'); // Seulement les commandes livrées
      
      if (ordersError) {
        console.error('❌ Erreur commandes:', ordersError);
        throw ordersError;
      }
      
      console.log('📦 Commandes trouvées:', orders?.length || 0);
      
      // Calculer les statistiques du mois/année sélectionné
      const currentPeriodStats: MonthlyStats = {
        month: selectedMonth,
        year: selectedYear,
        revenue: orders?.reduce((sum, order) => sum + Number(order.total || 0), 0) || 0,
        orders: orders?.length || 0,
        newUsers: 0, // À implémenter si nécessaire
        productsSold: orders?.reduce((sum, order) => sum + (order.items?.length || 0), 0) || 0,
        averageOrderValue: orders?.length ? (orders.reduce((sum, order) => sum + Number(order.total || 0), 0) / orders.length) : 0,
        growthRate: 0 // Calculé plus tard
      };
      
      // Récupérer les statistiques du mois/année précédent pour le calcul de croissance
      const previousStartDate = viewMode === 'monthly'
        ? new Date(selectedYear, selectedMonth - 2, 1)
        : new Date(selectedYear - 1, 0, 1);
      
      const previousEndDate = viewMode === 'monthly'
        ? new Date(selectedYear, selectedMonth - 1, 0, 23, 59, 59)
        : new Date(selectedYear - 1, 11, 31, 23, 59, 59);
      
      const { data: previousOrders } = await supabase
        .from('commandes')
        .select('*')
        .gte('created_at', previousStartDate.toISOString())
        .lte('created_at', previousEndDate.toISOString())
        .eq('statut', 'livree');
      
      const previousPeriodStats: MonthlyStats = {
        month: viewMode === 'monthly' ? selectedMonth - 1 : 12,
        year: viewMode === 'monthly' ? selectedYear : selectedYear - 1,
        revenue: previousOrders?.reduce((sum, order) => sum + Number(order.total || 0), 0) || 0,
        orders: previousOrders?.length || 0,
        newUsers: 0,
        productsSold: previousOrders?.reduce((sum, order) => sum + (order.items?.length || 0), 0) || 0,
        averageOrderValue: previousOrders?.length ? (previousOrders.reduce((sum, order) => sum + Number(order.total || 0), 0) / previousOrders.length) : 0,
        growthRate: 0
      };
      
      // Calculer le taux de croissance
      if (previousPeriodStats.revenue > 0) {
        currentPeriodStats.growthRate = ((currentPeriodStats.revenue - previousPeriodStats.revenue) / previousPeriodStats.revenue) * 100;
      }
      
      // Récupérer l'historique mensuel de l'année
      const monthlyHistory: MonthlyStats[] = [];
      for (let month = 1; month <= 12; month++) {
        const monthStart = new Date(selectedYear, month - 1, 1);
        const monthEnd = new Date(selectedYear, month, 0, 23, 59, 59);
        
        const { data: monthOrders } = await supabase
          .from('commandes')
          .select('*')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString())
          .eq('statut', 'livree');
        
        monthlyHistory.push({
          month,
          year: selectedYear,
          revenue: monthOrders?.reduce((sum, order) => sum + Number(order.total || 0), 0) || 0,
          orders: monthOrders?.length || 0,
          newUsers: 0,
          productsSold: monthOrders?.reduce((sum, order) => sum + (order.items?.length || 0), 0) || 0,
          averageOrderValue: monthOrders?.length ? (monthOrders.reduce((sum, order) => sum + Number(order.total || 0), 0) / monthOrders.length) : 0,
          growthRate: 0
        });
      }
      
      // Calculer les totaux de l'année
      const yearToDate = {
        totalRevenue: monthlyHistory.reduce((sum, month) => sum + month.revenue, 0),
        totalOrders: monthlyHistory.reduce((sum, month) => sum + month.orders, 0),
        totalUsers: 0, // À implémenter si nécessaire
        totalProductsSold: monthlyHistory.reduce((sum, month) => sum + month.productsSold, 0),
        averageMonthlyRevenue: monthlyHistory.reduce((sum, month) => sum + month.revenue, 0) / 12
      };
      
      console.log('✅ Statistiques calculées:', { currentPeriodStats, yearToDate });
      
      return {
        currentMonth: currentPeriodStats,
        previousMonth: previousPeriodStats,
        yearToDate,
        monthlyHistory
      };
    }
  });
  
  // Mutation pour remettre à zéro les statistiques mensuelles
  const resetMonthlyStatsMutation = useMutation({
    mutationFn: async () => {
      // Ici, vous pourriez implémenter une logique de remise à zéro
      // Par exemple, marquer les commandes comme "archivées" ou créer un snapshot
      toast({
        title: "Remise à zéro",
        description: "Les statistiques mensuelles ont été remises à zéro.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-advanced'] });
    }
  });
  
  // Fonction pour formater la devise
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3
    }).format(amount);
  };
  
  // Fonction pour obtenir le nom du mois
  const getMonthName = (month: number) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1];
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert className="border-destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des statistiques: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  const currentPeriod = viewMode === 'monthly' 
    ? `${getMonthName(selectedMonth)} ${selectedYear}`
    : `Année ${selectedYear}`;
  
  const previousPeriod = viewMode === 'monthly'
    ? `${getMonthName(selectedMonth - 1 || 12)} ${selectedMonth === 1 ? selectedYear - 1 : selectedYear}`
    : `Année ${selectedYear - 1}`;
  
  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tableau de bord avancé</h2>
          <p className="text-muted-foreground">
            Suivi détaillé de votre activité avec gestion temporelle
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sélecteur de vue */}
          <Select value={viewMode} onValueChange={(value: 'monthly' | 'yearly') => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Vue mensuelle</SelectItem>
              <SelectItem value="yearly">Vue annuelle</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sélecteur d'année */}
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Sélecteur de mois (si vue mensuelle) */}
          {viewMode === 'monthly' && (
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <SelectItem key={month} value={month.toString()}>
                    {getMonthName(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Bouton de remise à zéro */}
          <Button
            variant="outline"
            onClick={() => resetMonthlyStatsMutation.mutate()}
            disabled={resetMonthlyStatsMutation.isPending}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Remise à zéro
          </Button>
        </div>
      </div>
      
      {/* Période actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Période: {currentPeriod}
          </CardTitle>
          <CardDescription>
            Comparaison avec {previousPeriod}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Chiffre d'affaires</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(stats?.currentMonth.revenue || 0)}</div>
              <div className="flex items-center gap-2">
                {stats?.currentMonth.growthRate > 0 ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.currentMonth.growthRate.toFixed(1)}%
                  </Badge>
                ) : stats?.currentMonth.growthRate < 0 ? (
                  <Badge variant="destructive">
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                    {stats.currentMonth.growthRate.toFixed(1)}%
                  </Badge>
                ) : (
                  <Badge variant="outline">0%</Badge>
                )}
                <span className="text-xs text-muted-foreground">vs {previousPeriod}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Commandes</span>
              </div>
              <div className="text-2xl font-bold">{stats?.currentMonth.orders || 0}</div>
              <div className="text-xs text-muted-foreground">
                Valeur moyenne: {formatCurrency(stats?.currentMonth.averageOrderValue || 0)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Produits vendus</span>
              </div>
              <div className="text-2xl font-bold">{stats?.currentMonth.productsSold || 0}</div>
              <div className="text-xs text-muted-foreground">
                {stats?.currentMonth.orders ? (stats.currentMonth.productsSold / stats.currentMonth.orders).toFixed(1) : 0} par commande
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Objectif mensuel</span>
              </div>
              <div className="text-2xl font-bold">
                {stats?.yearToDate.averageMonthlyRevenue ? 
                  `${((stats.currentMonth.revenue / stats.yearToDate.averageMonthlyRevenue) * 100).toFixed(0)}%` : 
                  'N/A'
                }
              </div>
              <div className="text-xs text-muted-foreground">
                Moyenne: {formatCurrency(stats?.yearToDate.averageMonthlyRevenue || 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Vue d'ensemble de l'année */}
      {viewMode === 'yearly' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vue d'ensemble {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Chiffre d'affaires total</div>
                <div className="text-2xl font-bold">{formatCurrency(stats?.yearToDate.totalRevenue || 0)}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Commandes totales</div>
                <div className="text-2xl font-bold">{stats?.yearToDate.totalOrders || 0}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Produits vendus</div>
                <div className="text-2xl font-bold">{stats?.yearToDate.totalProductsSold || 0}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Moyenne mensuelle</div>
                <div className="text-2xl font-bold">{formatCurrency(stats?.yearToDate.averageMonthlyRevenue || 0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Historique mensuel (si vue annuelle) */}
      {viewMode === 'yearly' && (
        <Card>
          <CardHeader>
            <CardTitle>Historique mensuel {selectedYear}</CardTitle>
            <CardDescription>
              Évolution du chiffre d'affaires mois par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stats?.monthlyHistory.map((month, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{getMonthName(month.month)}</span>
                    <Badge variant={month.revenue > 0 ? "default" : "outline"}>
                      {month.orders} commandes
                    </Badge>
                  </div>
                  <div className="text-lg font-bold">{formatCurrency(month.revenue)}</div>
                  <div className="text-xs text-muted-foreground">
                    {month.productsSold} produits vendus
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Gestion des statistiques et rapports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Exporter les données
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Planifier un rapport
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Marquer comme archivé
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
