import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, FileDown, FileSpreadsheet, FileText, Edit, Trash2, Pencil } from "lucide-react";
import { exportToPDF, exportToXLSX, exportToCSV } from "@/lib/exportUtils";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Historique = () => {
  const [affaires, setAffaires] = useState<any[]>([]);
  const [dateDebut, setDateDebut] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split("T")[0];
  });
  const [dateFin, setDateFin] = useState(new Date().toISOString().split("T")[0]);
  const [selectedAffaire, setSelectedAffaire] = useState<any>(null);
  const [beneficiaires, setBeneficiaires] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [affaireToDelete, setAffaireToDelete] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistorique();
  }, []);

  const loadHistorique = async () => {
    try {
      const { data, error } = await supabase
        .from("affaires")
        .select(
          `
          *,
          beneficiaires (
            id,
            nom,
            type,
            montant,
            pourcentage
          )
        `
        )
        .gte("date_affaire", dateDebut)
        .lte("date_affaire", dateFin)
        .order("date_affaire", { ascending: false });

      if (error) throw error;
      setAffaires(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const voirBeneficiaires = (affaire: any) => {
    setSelectedAffaire(affaire);
    setBeneficiaires(affaire.beneficiaires || []);
    setDialogOpen(true);
  };

  const handleExport = async (
    affaire: any,
    type: "pdf" | "xlsx" | "csv"
  ) => {
    try {
      const { data: beneficiaires } = await supabase
        .from("beneficiaires")
        .select("*")
        .eq("affaire_id", affaire.id);

      if (!beneficiaires) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les bénéficiaires",
          variant: "destructive",
        });
        return;
      }

      switch (type) {
        case "pdf":
          exportToPDF(affaire, beneficiaires);
          break;
        case "xlsx":
          exportToXLSX(affaire, beneficiaires);
          break;
        case "csv":
          exportToCSV(affaire, beneficiaires);
          break;
      }

      toast({
        title: "Succès",
        description: `Export ${type.toUpperCase()} réussi`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR").format(montant) + " FCFA";
  };

  const calculerTotalDistribue = (affaire: any) => {
    return (
      affaire.beneficiaires?.reduce(
        (acc: number, b: any) => acc + (b.montant || 0),
        0
      ) || 0
    );
  };

  const confirmerSuppression = (affaire: any) => {
    setAffaireToDelete(affaire);
    setDeleteDialogOpen(true);
  };

  const supprimerAffaire = async () => {
    if (!affaireToDelete) return;

    try {
      const { error } = await supabase
        .from("affaires")
        .delete()
        .eq("id", affaireToDelete.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'affaire a été supprimée avec succès",
      });

      setDeleteDialogOpen(false);
      setAffaireToDelete(null);
      loadHistorique();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Historique des Affaires
        </h1>
        <p className="text-muted-foreground mt-2">
          Consultez et exportez l'historique des répartitions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="dateDebut">Date de début</Label>
              <Input
                id="dateDebut"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="dateFin">Date de fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadHistorique} className="gap-2">
                <Search className="w-4 h-4" />
                Filtrer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Résultats ({affaires.length} affaire{affaires.length > 1 ? "s" : ""})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Affaire</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant Total</TableHead>
                <TableHead>Montant Net</TableHead>
                <TableHead>Distribué</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affaires.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    Aucune affaire trouvée pour cette période
                  </TableCell>
                </TableRow>
              ) : (
                affaires.map((affaire) => (
                  <TableRow key={affaire.id}>
                    <TableCell className="font-medium">
                      {affaire.numero}
                    </TableCell>
                    <TableCell>
                      {new Date(affaire.date_affaire).toLocaleDateString(
                        "fr-FR"
                      )}
                    </TableCell>
                    <TableCell>{formatMontant(affaire.montant_total)}</TableCell>
                    <TableCell>{formatMontant(affaire.montant_net)}</TableCell>
                    <TableCell>
                      {formatMontant(calculerTotalDistribue(affaire))}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/affaire/${affaire.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/nouvelle-affaire/${affaire.id}`)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmerSuppression(affaire)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                      {affaire.beneficiaires?.length === 0 ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => navigate(`/saisie/${affaire.id}`)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Faire la répartition
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => voirBeneficiaires(affaire)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(affaire, "pdf")}
                          >
                            <FileDown className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(affaire, "xlsx")}
                          >
                            <FileSpreadsheet className="w-4 h-4 mr-1" />
                            XLSX
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(affaire, "csv")}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            CSV
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Bénéficiaires de l'affaire {selectedAffaire?.numero}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">
                  {selectedAffaire &&
                    new Date(selectedAffaire.date_affaire).toLocaleDateString(
                      "fr-FR"
                    )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Montant Net</p>
                <p className="font-semibold">
                  {selectedAffaire &&
                    formatMontant(selectedAffaire.montant_net)}
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Pourcentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beneficiaires.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.nom}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          b.type === "SAISISSANT"
                            ? "bg-primary/10 text-primary"
                            : b.type === "CHEF"
                            ? "bg-accent/10 text-accent"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {b.type}
                      </span>
                    </TableCell>
                    <TableCell>{formatMontant(b.montant)}</TableCell>
                    <TableCell>{b.pourcentage.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'affaire {affaireToDelete?.numero} ?
              Cette action est irréversible et supprimera également tous les bénéficiaires associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={supprimerAffaire} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Historique;
