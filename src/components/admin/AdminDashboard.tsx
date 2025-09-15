import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockProducts: number;
}

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Get total products
      const { count: totalProducts } = await supabase
        .from('pneus')
        .select('*', { count: 'exact', head: true });

      // Get total orders
      const { count: totalOrders } = await supabase
        .from('commandes')
        .select('*', { count: 'exact', head: true });

      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('commandes')
        .select('total');
      
      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      // Get low stock products (stock <= 5)
      const { count: lowStockProducts } = await supabase
        .from('pneus')
        .select('*', { count: 'exact', head: true })
        .lte('stock', 5);

      return {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        lowStockProducts: lowStockProducts || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Chiffre d'affaires",
      value: `${stats?.totalRevenue.toFixed(2)} DT`,
      description: "Total des ventes",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Commandes",
      value: stats?.totalOrders || 0,
      description: "Commandes totales",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Produits",
      value: stats?.totalProducts || 0,
      description: "Produits en catalogue",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Utilisateurs",
      value: stats?.totalUsers || 0,
      description: "Clients inscrits",
      icon: Users,
      color: "text-orange-600",
    },
    {
      title: "Stock faible",
      value: stats?.lowStockProducts || 0,
      description: "Produits à réapprovisionner",
      icon: TrendingUp,
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre activité
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats?.lowStockProducts && stats.lowStockProducts > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              ⚠️ Alerte Stock
            </CardTitle>
            <CardDescription>
              {stats.lowStockProducts} produit(s) ont un stock faible (≤ 5 unités)
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};