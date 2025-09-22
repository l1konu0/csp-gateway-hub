import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';
import cspLogo from '@/assets/csp-logo-clean.png';

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
    produit: {
      id: number;
      designation: string;
      prix_vente: number;
      categories?: {
        nom: string;
      };
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

  // Calculs TVA et totaux
  const calculateTotals = () => {
    let totalHT = 0;
    details.forEach(detail => {
      totalHT += Number(detail.prix_unitaire) * detail.quantite;
    });
    
    const tvaRate = 0.19; // 19% TVA
    const totalTVA = totalHT * tvaRate;
    const timbre = 1.000;
    const totalTTC = totalHT + totalTVA + timbre;
    
    return {
      totalHT: totalHT / (1 + tvaRate), // Prix HT réel
      netHT: totalHT / (1 + tvaRate),
      totalTVA,
      totalTTC,
      netAPayer: totalTTC
    };
  };

  const totals = calculateTotals();

  const convertToWords = (amount: number): string => {
    // Simplification - dans un vrai projet, utiliser une librairie pour convertir les nombres en lettres
    return `${Math.floor(amount)} DINARS ET ${Math.round((amount % 1) * 1000)} MILLIMES`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Facture {commande.numero_facture}
          </DialogTitle>
        </DialogHeader>

        {/* Styles CSS intégrés pour l'impression */}
        <style>{`
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
            }
            .page {
              margin: 0 !important;
              padding: 20mm !important;
              width: 210mm !important;
              min-height: auto !important;
              background: #E5E5E5 !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
            .header {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .totals-box, table.items th {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table.items th {
              background: #cc0000 !important;
              color: white !important;
            }
            .totals-box tr:last-child td {
              background: #cc0000 !important;
              color: white !important;
            }
            button, .print\\:hidden {
              display: none !important;
            }
            /* Force tous les éléments à garder leurs couleurs */
            .header, .header *, 
            .details, .details *,
            .items, .items *,
            .totals-box, .totals-box *,
            .amount-words, .footer {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          
          body { 
            font-family: "Segoe UI", Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            background: #fff; 
          }

          .page { 
            width: 210mm; 
            min-height: 297mm; 
            margin: 20px auto; 
            padding: 20mm; 
            background: #E5E5E5; 
            box-shadow: 0 0 15px rgba(0,0,0,0.2); 
            border-radius: 8px;
            box-sizing: border-box; 
          }

          .header { 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            border-bottom: 3px solid #cc0000; 
            padding-bottom: 10px; 
            margin-bottom: 20px; 
          }
          .header img { height: 180px; }
          .header .company { text-align: right; color: #333; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; color: #cc0000; }
          .header .info { font-size: 12px; margin-top: 5px; line-height: 1.5; }

          .invoice-title { 
            text-align: center; 
            font-size: 20px; 
            font-weight: bold; 
            margin: 20px 0; 
            color: #333; 
            text-transform: uppercase; 
          }

          .details { 
            width: 100%; 
            margin-bottom: 20px; 
            font-size: 13px; 
            border-collapse: collapse; 
            background: #fafafa; 
          }
          .details td { padding: 8px 12px; border: 1px solid #ddd; }
          .details tr td:first-child { background: #f1f1f1; font-weight: bold; width: 35%; }

          table.items { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 25px; 
          }
          table.items th, table.items td { 
            border: 1px solid #ddd; 
            padding: 10px; 
            font-size: 12px; 
            text-align: center; 
          }
          table.items th { background: #cc0000; color: white; font-weight: bold; }
          table.items td { background: #fff; }

          .totals-box { 
            width: 40%; 
            float: right; 
            border: 1px solid #ddd; 
            border-radius: 6px; 
            margin-top: 20px; 
            overflow: hidden; 
            background: #fff; 
          }
          .totals-box table { width: 100%; border-collapse: collapse; }
          .totals-box td { padding: 8px 12px; font-size: 13px; }
          .totals-box tr:nth-child(odd) td:first-child { background: #f9f9f9; }
          .totals-box tr:last-child td { background: #cc0000; color: white; font-weight: bold; font-size: 14px; }

          .amount-words { 
            clear: both; 
            margin-top: 40px; 
            font-size: 12px; 
            font-style: italic; 
            color: #333; 
            padding: 10px; 
            border-left: 4px solid #cc0000; 
            background: #fafafa; 
            border-radius: 4px; 
          }

          .footer { 
            margin-top: 60px; 
            font-size: 11px; 
            text-align: center; 
            color: #666; 
            border-top: 2px solid #eee; 
            padding-top: 10px; 
            line-height: 1.6; 
          }
          .footer strong { color: #cc0000; }
        `}</style>

        <div className="page" id="facture-content">
          {/* HEADER */}
          <div className="header">
            <img src={cspLogo} alt="Logo CSP" />
            <div className="company">
              <h1>CHAHBANI STAR PNEU</h1>
              <div className="info">
                46 AVENUE HABIB BOURGUIBA 2046 AIN ZAGHOUANE TUNIS<br />
                GSM: 98 215 559 / 20 215 559 | TEL/FAX: 75 760 925<br />
                E-mail: chahbanistarpneus4@gmail.com
              </div>
            </div>
          </div>

          {/* TITRE */}
          <div className="invoice-title">Facture</div>

          {/* DETAILS */}
          <table className="details">
            <tbody>
              <tr>
                <td>Facture N° :</td>
                <td>{commande.numero_facture}</td>
              </tr>
              <tr>
                <td>Date :</td>
                <td>{new Date(commande.date_facture).toLocaleDateString('fr-FR')}</td>
              </tr>
              <tr>
                <td>Client :</td>
                <td>{commande.nom}</td>
              </tr>
              <tr>
                <td>Code :</td>
                <td>{commande.id}</td>
              </tr>
            </tbody>
          </table>

          {/* PRODUITS */}
          <table className="items">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>P.U. HT</th>
                <th>% REM</th>
                <th>Montant HT</th>
                <th>Montant TTC</th>
                <th>Code TVA</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => {
                const puHT = Number(detail.prix_unitaire) / 1.19; // Prix HT
                const montantHT = puHT * detail.quantite;
                const montantTTC = Number(detail.prix_unitaire) * detail.quantite;
                
                return (
                  <tr key={detail.id}>
                    <td>{detail.id}</td>
                    <td style={{ textAlign: 'left' }}>
                      {detail.produit.designation}
                    </td>
                    <td>{detail.quantite}</td>
                    <td>{puHT.toFixed(3)}</td>
                    <td>0%</td>
                    <td>{montantHT.toFixed(3)}</td>
                    <td>{montantTTC.toFixed(3)}</td>
                    <td>19</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* TOTAUX */}
          <div className="totals-box">
            <table>
              <tbody>
                <tr>
                  <td>Total HT</td>
                  <td style={{ textAlign: 'right' }}>{totals.totalHT.toFixed(3)}</td>
                </tr>
                <tr>
                  <td>Net HT</td>
                  <td style={{ textAlign: 'right' }}>{totals.netHT.toFixed(3)}</td>
                </tr>
                <tr>
                  <td>Total TVA</td>
                  <td style={{ textAlign: 'right' }}>{totals.totalTVA.toFixed(3)}</td>
                </tr>
                <tr>
                  <td>Timbre</td>
                  <td style={{ textAlign: 'right' }}>1,000</td>
                </tr>
                <tr>
                  <td>Total TTC</td>
                  <td style={{ textAlign: 'right' }}>{totals.totalTTC.toFixed(3)}</td>
                </tr>
                <tr>
                  <td>NET À PAYER</td>
                  <td style={{ textAlign: 'right' }}>{totals.netAPayer.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MONTANT EN LETTRES */}
          <p className="amount-words">
            Arrêtée la présente facture à la somme de :{' '}
            <span style={{ fontWeight: '600' }}>{convertToWords(totals.netAPayer).toUpperCase()}</span>
          </p>

          {/* FOOTER */}
          <div className="footer">
            <strong>CHAHBANI STAR PNEU</strong> — Vente : Pneu, Jante alu, Lubrifiants & Fourniture pneumatique —{' '}
            Service : Réparation, Équilibrage, Parallélisme, Vidange<br />
            R.I.B : ZB TN59 25 148 0000001147967 26 | T.V.A : 1143749/Q/D/C/000 | R.C.S : A0110581 2010
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-6 print:hidden">
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