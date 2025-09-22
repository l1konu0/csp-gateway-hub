import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';
import cspLogo from '@/assets/csp-logo-new.jpg';

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
            body { font-family: "Segoe UI", Arial, sans-serif; margin: 0; padding: 0; background: #fff; }
            .invoice-page { width: 210mm; min-height: 297mm; margin: 0; padding: 20mm; background: #fff; box-sizing: border-box; }
            .invoice-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #cc0000; padding-bottom: 10px; margin-bottom: 20px; }
            .invoice-header img { height: 80px; }
            .invoice-header .company { text-align: right; color: #333; }
            .invoice-header h1 { margin: 0; font-size: 24px; font-weight: bold; color: #cc0000; }
            .invoice-header .info { font-size: 12px; margin-top: 5px; line-height: 1.5; }
            .invoice-title { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; color: #333; text-transform: uppercase; }
            .invoice-details { width: 100%; margin-bottom: 20px; font-size: 13px; border-collapse: collapse; background: #fafafa; }
            .invoice-details td { padding: 8px 12px; border: 1px solid #ddd; }
            .invoice-details tr td:first-child { background: #f1f1f1; font-weight: bold; width: 35%; }
            .invoice-items { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            .invoice-items th, .invoice-items td { border: 1px solid #ddd; padding: 10px; font-size: 12px; text-align: center; }
            .invoice-items th { background: #cc0000; color: white; font-weight: bold; }
            .invoice-items td { background: #fff; }
            .totals-box { width: 40%; float: right; border: 1px solid #ddd; border-radius: 6px; margin-top: 20px; overflow: hidden; background: #fff; }
            .totals-box table { width: 100%; border-collapse: collapse; }
            .totals-box td { padding: 8px 12px; font-size: 13px; }
            .totals-box tr:nth-child(odd) td:first-child { background: #f9f9f9; }
            .totals-box tr:last-child td { background: #cc0000; color: white; font-weight: bold; font-size: 14px; }
            .amount-words { clear: both; margin-top: 40px; font-size: 12px; font-style: italic; color: #333; padding: 10px; border-left: 4px solid #cc0000; background: #fafafa; border-radius: 4px; }
            .invoice-footer { margin-top: 60px; font-size: 11px; text-align: center; color: #666; border-top: 2px solid #eee; padding-top: 10px; line-height: 1.6; }
            .invoice-footer strong { color: #cc0000; }
          }
        `}</style>

        <div className="invoice-page p-6 bg-gray-100 print:bg-white print:p-0" id="facture-content">
          {/* HEADER */}
          <div className="invoice-header flex items-center justify-between border-b-2 border-red-600 pb-4 mb-8">
            <img src={cspLogo} alt="Logo CSP" className="h-20 print:h-16" />
            <div className="company text-right text-gray-800">
              <h1 className="text-2xl font-bold text-red-600 m-0">CHAHBANI STAR PNEU</h1>
              <div className="info text-xs mt-2 leading-relaxed">
                46 AVENUE HABIB BOURGUIBA 2046 AIN ZAGHOUANE TUNIS<br />
                GSM: 98 215 559 / 20 215 559 | TEL/FAX: 75 760 925<br />
                E-mail: chahbanistarpneus4@gmail.com
              </div>
            </div>
          </div>

          {/* TITRE */}
          <div className="invoice-title text-center text-xl font-bold my-8 text-gray-800 uppercase">
            Facture
          </div>

          {/* DETAILS */}
          <table className="invoice-details w-full mb-8 text-sm border-collapse bg-gray-50">
            <tbody>
              <tr>
                <td className="p-3 border border-gray-300 bg-gray-100 font-bold w-1/3">Facture N° :</td>
                <td className="p-3 border border-gray-300">{commande.numero_facture}</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300 bg-gray-100 font-bold">Date :</td>
                <td className="p-3 border border-gray-300">{new Date(commande.date_facture).toLocaleDateString('fr-FR')}</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300 bg-gray-100 font-bold">Client :</td>
                <td className="p-3 border border-gray-300">{commande.nom}</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300 bg-gray-100 font-bold">Code :</td>
                <td className="p-3 border border-gray-300">{commande.id}</td>
              </tr>
            </tbody>
          </table>

          {/* PRODUITS */}
          <table className="invoice-items w-full border-collapse mb-8">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 bg-red-600 text-white font-bold">Référence</th>
                <th className="border border-gray-300 p-3 bg-red-600 text-white font-bold">Désignation</th>
                <th className="border border-gray-300 p-3 bg-red-600 text-white font-bold">Quantité</th>
                <th className="border border-gray-300 p-3 bg-red-600 text-white font-bold">P.U. HT</th>
                <th className="border border-gray-300 p-3 bg-red-600 text-white font-bold">% REM</th>
                <th className="border border-gray-300 p-3 bg-red-600 text-white font-bold">Montant HT</th>
                <th className="border border-gray-300 p-3 bg-red-600 text-white font-bold">Montant TTC</th>
                <th className="border border-gray-300 p-3 bg-red-600 text-white font-bold">Code TVA</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => {
                const puHT = Number(detail.prix_unitaire) / 1.19; // Prix HT
                const montantHT = puHT * detail.quantite;
                const montantTTC = Number(detail.prix_unitaire) * detail.quantite;
                
                return (
                  <tr key={detail.id}>
                    <td className="border border-gray-300 p-3 bg-white text-center">{detail.id}</td>
                    <td className="border border-gray-300 p-3 bg-white text-left">
                      {detail.produit.designation}
                    </td>
                    <td className="border border-gray-300 p-3 bg-white text-center">{detail.quantite}</td>
                    <td className="border border-gray-300 p-3 bg-white text-center">{puHT.toFixed(3)}</td>
                    <td className="border border-gray-300 p-3 bg-white text-center">0%</td>
                    <td className="border border-gray-300 p-3 bg-white text-center">{montantHT.toFixed(3)}</td>
                    <td className="border border-gray-300 p-3 bg-white text-center">{montantTTC.toFixed(3)}</td>
                    <td className="border border-gray-300 p-3 bg-white text-center">19</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* TOTAUX */}
          <div className="totals-box w-2/5 float-right border border-gray-300 rounded-md mt-8 overflow-hidden bg-white">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="p-3 text-sm">Total HT</td>
                  <td className="p-3 text-sm text-right">{totals.totalHT.toFixed(3)}</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm bg-gray-50">Net HT</td>
                  <td className="p-3 text-sm text-right bg-gray-50">{totals.netHT.toFixed(3)}</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm">Total TVA</td>
                  <td className="p-3 text-sm text-right">{totals.totalTVA.toFixed(3)}</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm bg-gray-50">Timbre</td>
                  <td className="p-3 text-sm text-right bg-gray-50">1.000</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm">Total TTC</td>
                  <td className="p-3 text-sm text-right">{totals.totalTTC.toFixed(3)}</td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-bold bg-red-600 text-white">NET À PAYER</td>
                  <td className="p-3 text-sm text-right font-bold bg-red-600 text-white">{totals.netAPayer.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MONTANT EN LETTRES */}
          <p className="amount-words clear-both mt-16 text-sm italic text-gray-800 p-4 border-l-4 border-red-600 bg-gray-50 rounded">
            Arrêtée la présente facture à la somme de :{' '}
            <span className="font-semibold">{convertToWords(totals.netAPayer).toUpperCase()}</span>
          </p>

          {/* FOOTER */}
          <div className="invoice-footer mt-16 text-xs text-center text-gray-600 border-t-2 border-gray-200 pt-4 leading-relaxed">
            <strong className="text-red-600">CHAHBANI STAR PNEU</strong> — Vente : Pneu, Jante alu, Lubrifiants & Fourniture pneumatique —{' '}
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