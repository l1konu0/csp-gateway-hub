import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users } from 'lucide-react';

interface UserProfile {
  id: string;
  nom: string | null;
  prenom: string | null;
  telephone: string | null;
  adresse: string | null;
  ville: string | null;
  code_postal: string | null;
  created_at: string;
  user_roles: Array<{ role: string }>;
}

export const AdminUsers = () => {
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utilisateurs inscrits
          </CardTitle>
          <CardDescription>
            {users?.length || 0} utilisateurs au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom complet</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Inscription</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">
                          {user.prenom} {user.nom}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.telephone && (
                            <div>{user.telephone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.adresse && (
                            <div>{user.adresse}</div>
                          )}
                          {user.ville && user.code_postal && (
                            <div className="text-muted-foreground">
                              {user.code_postal} {user.ville}
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