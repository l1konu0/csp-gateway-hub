import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Printer } from 'lucide-react';

interface FactureModalProps {
  isOpen: boolean;
  onClose: () => void;
  commande: {
    id: number;
    numero_facture: string;
    nom: string;
    email: string;
    telephone: string | null;
    adresse: string | null;
    total: number;
    date_facture: string;
    created_at: string;
  };
  details: Array<{
    id: number;
    quantite: number;
    prix_unitaire: number;
    pneu: {
      marque: string;
      modele: string;
      dimensions: string;
    };
  }>;
}

export const FactureModal: React.FC<FactureModalProps> = ({
  isOpen,
  onClose,
  commande,
  details
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Pour l'instant, on imprime. Plus tard on pourra ajouter une génération PDF
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Facture {commande.numero_facture}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 print:text-black print:bg-white" id="facture-content">
          {/* En-tête de la facture */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-primary">CSP PNEU</h1>
              <p className="text-muted-foreground">Spécialiste en pneumatiques</p>
              <p className="text-sm text-muted-foreground mt-2">
                123 Avenue des Pneus<br />
                75001 Paris, France<br />
                Tél: +33 1 23 45 67 89
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">FACTURE</h2>
              <p className="text-lg font-semibold text-primary">{commande.numero_facture}</p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(commande.date_facture).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Informations client */}
          <div>
            <h3 className="font-semibold mb-2">Facturé à:</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">{commande.nom}</p>
              <p>{commande.email}</p>
              {commande.telephone && <p>{commande.telephone}</p>}
              {commande.adresse && <p>{commande.adresse}</p>}
            </div>
          </div>

          {/* Détails de la commande */}
          <div>
            <h3 className="font-semibold mb-4">Détails de la commande</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Description</th>
                    <th className="border border-border p-3 text-center">Quantité</th>
                    <th className="border border-border p-3 text-right">Prix unitaire</th>
                    <th className="border border-border p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail) => (
                    <tr key={detail.id}>
                      <td className="border border-border p-3">
                        <div>
                          <p className="font-medium">{detail.pneu.marque} {detail.pneu.modele}</p>
                          <p className="text-sm text-muted-foreground">{detail.pneu.dimensions}</p>
                        </div>
                      </td>
                      <td className="border border-border p-3 text-center">{detail.quantite}</td>
                      <td className="border border-border p-3 text-right">
                        {Number(detail.prix_unitaire).toFixed(2)} DT
                      </td>
                      <td className="border border-border p-3 text-right font-medium">
                        {(Number(detail.prix_unitaire) * detail.quantite).toFixed(2)} DT
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total TTC:</span>
                <span className="text-primary">{Number(commande.total).toFixed(2)} DT</span>
              </div>
            </div>
          </div>

          {/* Informations légales */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>TVA non applicable, art. 293 B du CGI</p>
            <p>Paiement à la livraison</p>
            <p className="mt-2">
              Cette facture a été générée automatiquement le{' '}
              {new Date(commande.date_facture).toLocaleDateString('fr-FR')} à{' '}
              {new Date(commande.date_facture).toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Télécharger PDF
          </Button>
          <Button onClick={onClose} variant="secondary" className="ml-auto">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};