import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Phone, Calendar, Eye, Trash2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  nom: string;
  email: string;
  telephone?: string;
  sujet?: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export const AdminMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer tous les messages
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async (): Promise<Message[]> => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Marquer un message comme lu
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const { error } = await supabase
        .from('messages')
        .update({ lu: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast({
        title: "Succès",
        description: "Message marqué comme lu",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de marquer le message comme lu: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Supprimer un message
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      setIsViewOpen(false);
      setSelectedMessage(null);
      toast({
        title: "Succès",
        description: "Message supprimé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le message: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewOpen(true);
    
    // Marquer comme lu si pas encore lu
    if (!message.lu) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(m => !m.lu).length;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">Chargement des messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Erreur lors du chargement des messages</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Messages de Contact</h2>
          <p className="text-muted-foreground">
            {messages.length} message(s) total • {unreadCount} non lu(s)
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm">
            {unreadCount} nouveau(x)
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun message reçu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow 
                      key={message.id} 
                      className={!message.lu ? "bg-accent/50" : ""}
                    >
                      <TableCell>
                        <Badge variant={message.lu ? "secondary" : "default"}>
                          {message.lu ? "Lu" : "Nouveau"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(message.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{message.nom}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {message.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {message.sujet || (
                          <span className="text-muted-foreground italic">
                            Aucun sujet
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMessageMutation.mutate(message.id)}
                            disabled={deleteMessageMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour voir le message */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message de {selectedMessage?.nom}</DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Nom complet
                  </h4>
                  <p>{selectedMessage.nom}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Email
                  </h4>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                {selectedMessage.telephone && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Téléphone
                    </h4>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a 
                        href={`tel:${selectedMessage.telephone}`}
                        className="text-primary hover:underline"
                      >
                        {selectedMessage.telephone}
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Date
                  </h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedMessage.created_at)}
                  </div>
                </div>

                {selectedMessage.sujet && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Sujet
                    </h4>
                    <p>{selectedMessage.sujet}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-3">Message</h4>
                <div className="p-4 bg-background border rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsViewOpen(false)}
                >
                  Fermer
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.sujet || 'Votre message'}`)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Répondre
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteMessageMutation.mutate(selectedMessage.id)}
                    disabled={deleteMessageMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};