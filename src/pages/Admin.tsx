import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminVehicles } from '@/components/admin/AdminVehicles';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3, Package, ShoppingCart, Users, Car } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin-auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Administration CSP Pneu
              </h1>
              <p className="text-muted-foreground">
                Tableau de bord administrateur
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Interface d'administration</CardTitle>
            <CardDescription>
              Gérez votre boutique de pneus en ligne
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Tableau de bord
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Produits
                </TabsTrigger>
                <TabsTrigger value="vehicles" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Véhicules
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Commandes
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Utilisateurs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-6">
                <AdminDashboard />
              </TabsContent>

              <TabsContent value="products" className="mt-6">
                <AdminProducts />
              </TabsContent>

              <TabsContent value="vehicles" className="mt-6">
                <AdminVehicles />
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <AdminOrders />
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <AdminUsers />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;