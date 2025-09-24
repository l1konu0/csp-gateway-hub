import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, User } from 'lucide-react';
import { useState } from 'react';

interface UserProfile {
  id: string;
  nom: string | null;
  prenom: string | null;
  telephone: string | null;
  adresse: string | null;
  ville: string | null;
  code_postal: string | null;
  raison_sociale: string | null;
  secteur_activite: string | null;
  siret: string | null;
  tva_intracommunautaire: string | null;
  type_compte: 'particulier' | 'societe';
  created_at: string;
  user_roles: Array<{ role: string }>;
}

export const AdminUsers = () => {
  const [filterType, setFilterType] = useState<'all' | 'particulier' | 'societe'>('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Récupérer les profils et les rôles séparément car la relation n'est pas configurée
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Récupérer les rôles pour chaque utilisateur
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);
          
          return {
            ...profile,
            user_roles: roles || []
          };
        })
      );

      return usersWithRoles as UserProfile[];
    },
  });

  const getRoleBadgeVariant = (roles: Array<{ role: string }>) => {
    const hasAdmin = roles.some(r => r.role === 'admin');
    return hasAdmin ? 'default' : 'secondary';
  };

  const getRoleText = (roles: Array<{ role: string }>) => {
    const roleNames = roles.map(r => {
      switch (r.role) {
        case 'admin':
          return 'Administrateur';
        case 'client':
          return 'Client';
        default:
          return r.role;
      }
    });
    return roleNames.join(', ');
  };

  const getAccountTypeBadge = (typeCompte: 'particulier' | 'societe') => {
    switch (typeCompte) {
      case 'societe':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">🏢 Professionnel</Badge>;
      case 'particulier':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">👤 Particulier</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getDisplayName = (user: UserProfile) => {
    if (user.type_compte === 'societe' && user.raison_sociale) {
      return user.raison_sociale;
    }
    return `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Nom non renseigné';
  };

  const getContactInfo = (user: UserProfile) => {
    const info = [];
    if (user.telephone) info.push(`📞 ${user.telephone}`);
    if (user.type_compte === 'societe' && user.siret) info.push(`🏢 SIRET: ${user.siret}`);
    return info.length > 0 ? info.join(' • ') : 'Aucun contact';
  };

  const getAddressInfo = (user: UserProfile) => {
    const address = [];
    if (user.adresse) address.push(user.adresse);
    if (user.ville && user.code_postal) {
      address.push(`${user.code_postal} ${user.ville}`);
    }
    return address.length > 0 ? address.join(', ') : 'Adresse non renseignée';
  };

  // Filtrer les utilisateurs selon le type sélectionné
  const filteredUsers = users?.filter(user => {
    if (filterType === 'all') return true;
    return user.type_compte === filterType;
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h2>
        <p className="text-muted-foreground">
          Consultez la liste des utilisateurs inscrits
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterType('all')}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Tous ({users?.length || 0})
        </Button>
        <Button
          variant={filterType === 'societe' ? 'default' : 'outline'}
          onClick={() => setFilterType('societe')}
          className="flex items-center gap-2"
        >
          <Building2 className="h-4 w-4" />
          Professionnels ({users?.filter(u => u.type_compte === 'societe').length || 0})
        </Button>
        <Button
          variant={filterType === 'particulier' ? 'default' : 'outline'}
          onClick={() => setFilterType('particulier')}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Particuliers ({users?.filter(u => u.type_compte === 'particulier').length || 0})
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utilisateurs inscrits
          </CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} affiché{filteredUsers.length > 1 ? 's' : ''} 
            {filterType !== 'all' && ` (${filterType === 'societe' ? 'professionnels' : 'particuliers'})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom / Raison sociale</TableHead>
                    <TableHead>Type de compte</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Informations professionnelles</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Inscription</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">
                          {getDisplayName(user)}
                        </div>
                        {user.type_compte === 'societe' && user.secteur_activite && (
                          <div className="text-sm text-muted-foreground">
                            Secteur: {user.secteur_activite}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getAccountTypeBadge(user.type_compte)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getContactInfo(user)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getAddressInfo(user)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {user.type_compte === 'societe' && (
                            <>
                              {user.siret && (
                                <div className="text-xs text-muted-foreground">
                                  SIRET: {user.siret}
                                </div>
                              )}
                              {user.tva_intracommunautaire && (
                                <div className="text-xs text-muted-foreground">
                                  TVA: {user.tva_intracommunautaire}
                                </div>
                              )}
                            </>
                          )}
                          {user.type_compte === 'particulier' && (
                            <div className="text-xs text-muted-foreground">
                              Compte particulier
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.user_roles)}>
                          {getRoleText(user.user_roles)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur inscrit pour le moment
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};