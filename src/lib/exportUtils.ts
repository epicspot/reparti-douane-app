import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { montantEnLettresCFA } from "./numberToFrench";

interface Affaire {
  numero: string;
  date_affaire: string;
  montant_total: number;
  montant_net: number;
}

interface Beneficiaire {
  nom: string;
  type: string;
  montant: number;
  pourcentage: number;
}

export function exportToPDF(affaire: Affaire, beneficiaires: Beneficiaire[], logoUrl?: string) {
  const doc = new jsPDF();
  
  // Logo si disponible
  if (logoUrl) {
    try {
      doc.addImage(logoUrl, "PNG", 85, 10, 40, 20);
    } catch (e) {
      console.error("Erreur chargement logo:", e);
    }
  }
  
  // Titre
  doc.setFontSize(18);
  doc.text("RÉPARTITION DE CONTENTIEUX DOUANIERS", 105, logoUrl ? 40 : 20, { align: "center" });
  
  // Infos affaire
  doc.setFontSize(12);
  const startY = logoUrl ? 50 : 30;
  doc.text(`N° Affaire: ${affaire.numero}`, 20, startY);
  doc.text(`Date: ${new Date(affaire.date_affaire).toLocaleDateString("fr-FR")}`, 20, startY + 7);
  doc.text(`Montant Total: ${affaire.montant_total.toLocaleString("fr-FR")} FCFA`, 20, startY + 14);
  doc.text(`Montant Net: ${affaire.montant_net.toLocaleString("fr-FR")} FCFA`, 20, startY + 21);
  doc.setFontSize(10);
  doc.text(`En lettres: ${montantEnLettresCFA(affaire.montant_net)}`, 20, startY + 28);
  
  // Tableau bénéficiaires
  const tableData = beneficiaires.map((b) => [
    b.nom,
    b.type,
    `${b.montant.toLocaleString("fr-FR")} FCFA`,
    `${b.pourcentage.toFixed(2)}%`,
  ]);
  
  const totalDistribue = beneficiaires.reduce((acc, b) => acc + b.montant, 0);
  
  autoTable(doc, {
    startY: startY + 35,
    head: [["Nom", "Type", "Montant", "Pourcentage"]],
    body: tableData,
    foot: [
      ["Total distribué", "", `${totalDistribue.toLocaleString("fr-FR")} FCFA`, ""],
      ["Écart", "", `${(affaire.montant_net - totalDistribue).toLocaleString("fr-FR")} FCFA`, ""],
    ],
    theme: "grid",
    headStyles: { fillColor: [52, 152, 219] },
    footStyles: { fillColor: [236, 240, 241], textColor: [0, 0, 0], fontStyle: "bold" },
  });
  
  doc.save(`${affaire.numero}_repartition.pdf`);
}

export function exportToXLSX(affaire: Affaire, beneficiaires: Beneficiaire[]) {
  const ws_data = [
    ["Affaire", affaire.numero],
    ["Date", new Date(affaire.date_affaire).toLocaleDateString("fr-FR")],
    ["Montant Total", affaire.montant_total],
    ["Montant Net", affaire.montant_net],
    ["Montant Net (lettres)", montantEnLettresCFA(affaire.montant_net)],
    [],
    ["Nom", "Type", "Montant", "Pourcentage"],
  ];
  
  beneficiaires.forEach((b) => {
    ws_data.push([b.nom, b.type, b.montant, b.pourcentage / 100]);
  });
  
  const totalDistribue = beneficiaires.reduce((acc, b) => acc + b.montant, 0);
  ws_data.push(["Total distribué", "", totalDistribue, ""]);
  ws_data.push(["Écart (Net - Distribué)", "", affaire.montant_net - totalDistribue, ""]);
  
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Répartition");
  
  XLSX.writeFile(wb, `${affaire.numero}_repartition.xlsx`);
}

export function exportToCSV(affaire: Affaire, beneficiaires: Beneficiaire[]) {
  const rows = [
    ["Affaire", affaire.numero],
    ["Date", new Date(affaire.date_affaire).toLocaleDateString("fr-FR")],
    ["Montant Total", affaire.montant_total],
    ["Montant Net", affaire.montant_net],
    ["Montant Net (lettres)", montantEnLettresCFA(affaire.montant_net)],
    [],
    ["Nom", "Type", "Montant", "Pourcentage"],
  ];
  
  beneficiaires.forEach((b) => {
    rows.push([b.nom, b.type, b.montant.toString(), `${b.pourcentage.toFixed(2)}%`]);
  });
  
  const totalDistribue = beneficiaires.reduce((acc, b) => acc + b.montant, 0);
  rows.push(["Total distribué", "", totalDistribue.toString(), ""]);
  rows.push(["Écart", "", (affaire.montant_net - totalDistribue).toString(), ""]);
  
  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(";")).join("\n");
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${affaire.numero}_repartition.csv`;
  link.click();
}
