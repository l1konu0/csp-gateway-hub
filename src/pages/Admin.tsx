import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboardAdvanced } from '@/components/admin/AdminDashboardAdvanced';
import { AdminCatalogueManager } from '@/components/admin/AdminCatalogueManager';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminVehicles } from '@/components/admin/AdminVehicles';
import { AdminMessages } from '@/components/admin/AdminMessages';
import AdminCatalogue from '@/components/admin/AdminCatalogue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, BarChart3, Package, ShoppingCart, Users, Car, MessageSquare, Layers, Calendar, Shield, User } from 'lucide-react';
import AdminRendezVous from '@/components/admin/AdminRendezVous';

const Admin = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Récupérer les informations du profil utilisateur
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('nom, prenom, type_compte')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header moderne avec couleurs CSP */}
      <header className="relative overflow-hidden border-b bg-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-red-100/30"></div>
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo CSP */}
              <div className="flex-shrink-0">
                <img
                  src="/logo-csp.png"
                  alt="CSP Chahbani Star Pneus"
                  className="h-24 w-auto"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-red-600">
                  Administration CSP Pneu
                </h1>
                <p className="text-red-500 text-lg">
                  Tableau de bord administrateur
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Informations utilisateur */}
              <div className="text-right text-red-600">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" />
                  <p className="text-sm text-red-500">Connecté en tant que</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-red-700">
                    {userProfile?.prenom && userProfile?.nom 
                      ? `${userProfile.prenom} ${userProfile.nom}`
                      : user?.email
                    }
                  </p>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-300">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                </div>
                <p className="text-xs text-red-400">
                  {userProfile?.type_compte === 'societe' ? 'Compte Société' : 'Compte Particulier'}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navigation moderne */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                {/* Logo CSP dans la sidebar */}
                <div className="flex justify-center mb-4">
                  <img
                    src="/logo-csp.png"
                    alt="CSP Chahbani Star Pneus"
                    className="h-20 w-auto"
                  />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">Navigation</CardTitle>
                <CardDescription className="text-gray-600">
                  Gérez votre boutique de pneus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, color: 'text-red-600' },
                  { id: 'catalogue', label: 'Catalogue', icon: Layers, color: 'text-red-600' },
                  { id: 'products', label: 'Gestion Produits', icon: Package, color: 'text-red-600' },
                  { id: 'vehicles', label: 'Véhicules', icon: Car, color: 'text-red-600' },
                  { id: 'rendez-vous', label: 'Rendez-vous', icon: Calendar, color: 'text-red-600' },
                  { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'text-red-600' },
                  { id: 'orders', label: 'Commandes', icon: ShoppingCart, color: 'text-red-600' },
                  { id: 'users', label: 'Utilisateurs', icon: Users, color: 'text-red-600' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group ${
                      activeTab === tab.id
                        ? 'bg-red-600 text-white shadow-md'
                        : 'hover:bg-red-50 hover:shadow-sm'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="min-h-[600px]">

                  {/* Contenu avec animations */}
                  <div className="p-6">
                    {activeTab === 'dashboard' && (
                      <div className="animate-fade-in">
                        <AdminDashboardAdvanced />
                      </div>
                    )}
                    
                    {activeTab === 'catalogue' && (
                      <div className="animate-fade-in">
                        <AdminCatalogue />
                      </div>
                    )}
                    
                    {activeTab === 'products' && (
                      <div className="animate-fade-in">
                        <AdminCatalogueManager />
                      </div>
                    )}
                    
                    {activeTab === 'vehicles' && (
                      <div className="animate-fade-in">
                        <AdminVehicles />
                      </div>
                    )}
                    
                    {activeTab === 'rendez-vous' && (
                      <div className="animate-fade-in">
                        <AdminRendezVous />
                      </div>
                    )}
                    
                    {activeTab === 'messages' && (
                      <div className="animate-fade-in">
                        <AdminMessages />
                      </div>
                    )}
                    
                    {activeTab === 'orders' && (
                      <div className="animate-fade-in">
                        <AdminOrders />
                      </div>
                    )}
                    
                    {activeTab === 'users' && (
                      <div className="animate-fade-in">
                        <AdminUsers />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;