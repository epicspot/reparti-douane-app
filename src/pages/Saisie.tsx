import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, Wand2, Trash2, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Beneficiaire {
  nom: string;
  type: string;
  montant: number;
  pourcentage: number;
}

const Saisie = () => {
  const { affaireId } = useParams();
  const [affaire, setAffaire] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [fonds, setFonds] = useState<any[]>([]);
  const [chefs, setChefs] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Dialog state
  const [showAutoDialog, setShowAutoDialog] = useState(false);
  const [saisissantsInput, setSaisissantsInput] = useState("");
  const [hasIndicateur, setHasIndicateur] = useState(false);
  const [indicateurNom, setIndicateurNom] = useState("");
  const [hasIntervenants, setHasIntervenants] = useState(false);
  const [intervenantsInput, setIntervenantsInput] = useState("");

  useEffect(() => {
    loadAffaireAndConfig();
  }, [affaireId]);

  const loadAffaireAndConfig = async () => {
    try {
      setLoading(true);
      
      // Charger l'affaire
      const { data: affaireData, error: affaireError } = await supabase
        .from("affaires")
        .select("*")
        .eq("id", affaireId)
        .single();

      if (affaireError) throw affaireError;
      
      if (!affaireData) {
        toast({
          title: "Erreur",
          description: "Affaire introuvable",
          variant: "destructive",
        });
        navigate("/historique");
        return;
      }

      setAffaire(affaireData);

      // Charger la configuration
      const { data: fondsData } = await supabase.from("fonds").select("*");
      const { data: chefsData } = await supabase.from("chefs").select("*");
      setFonds(fondsData || []);
      setChefs(chefsData || []);
      
      // Charger les bénéficiaires existants si présents
      const { data: benefData } = await supabase
        .from("beneficiaires")
        .select("*")
        .eq("affaire_id", affaireId);
      
      if (benefData && benefData.length > 0) {
        setBeneficiaires(benefData.map(b => ({
          nom: b.nom,
          type: b.type,
          montant: b.montant,
          pourcentage: b.pourcentage
        })));
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculerPourcentages = () => {
    if (!affaire) return;
    const net = affaire.montant_net || 0;
    if (net === 0) return;

    const newBeneficiaires = beneficiaires.map((b) => ({
      ...b,
      pourcentage: (b.montant / net) * 100,
    }));
    setBeneficiaires(newBeneficiaires);
  };

  useEffect(() => {
    calculerPourcentages();
  }, [affaire]);

  const ajouterBeneficiaire = () => {
    setBeneficiaires([
      ...beneficiaires,
      { nom: "", type: "SAISISSANT", montant: 0, pourcentage: 0 },
    ]);
  };

  const modifierBeneficiaire = (index: number, field: string, value: any) => {
    const newBeneficiaires = [...beneficiaires];
    newBeneficiaires[index] = { ...newBeneficiaires[index], [field]: value };
    setBeneficiaires(newBeneficiaires);
  };

  const supprimerBeneficiaire = (index: number) => {
    setBeneficiaires(beneficiaires.filter((_, i) => i !== index));
  };

  const openAutoDialog = () => {
    if (!affaire || affaire.montant_net === 0) {
      toast({
        title: "Erreur",
        description: "Le montant net de l'affaire est invalide",
        variant: "destructive",
      });
      return;
    }
    setShowAutoDialog(true);
  };

  const repartitionAuto = () => {
    if (!saisissantsInput.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir au moins un saisissant",
        variant: "destructive",
      });
      return;
    }

    if (hasIndicateur && !indicateurNom.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom de l'indicateur",
        variant: "destructive",
      });
      return;
    }

    const net = affaire.montant_net || 0;
    const saisissants = saisissantsInput.split(",").map((s) => s.trim());
    const intervenants = hasIntervenants
      ? intervenantsInput.split(",").map((s) => s.trim()).filter(s => s)
      : [];
    const newBeneficiaires: Beneficiaire[] = [];

    // 1. Part Budget (50%)
    const partBudget = Math.round(net * 0.5);
    newBeneficiaires.push({
      nom: "Part Budget",
      type: "FONDS",
      montant: partBudget,
      pourcentage: 50,
    });

    // 2. FSP (4%)
    const partFSP = Math.round(net * 0.04);
    newBeneficiaires.push({
      nom: "FSP",
      type: "FONDS",
      montant: partFSP,
      pourcentage: 4,
    });

    // 3. Part des saisissants (25% répartie intégralement entre les saisissants)
    const partSaisissants = Math.round(net * 0.25);
    const partUnitaireSaisissant = Math.round(partSaisissants / saisissants.length);
    saisissants.forEach((nom) => {
      newBeneficiaires.push({
        nom,
        type: "SAISISSANT",
        montant: partUnitaireSaisissant,
        pourcentage: (partUnitaireSaisissant / net) * 100,
      });
    });

    // 4. Part d'indicateur s'il y a lieu (10%)
    let partIndicateur = 0;
    if (hasIndicateur && indicateurNom) {
      partIndicateur = Math.round(net * 0.1);
      newBeneficiaires.push({
        nom: indicateurNom,
        type: "FONDS",
        montant: partIndicateur,
        pourcentage: 10,
      });
    }

    // 5. Part des intervenants (égale à la moitié de la part d'un saisissant)
    let partTotaleIntervenants = 0;
    if (intervenants.length > 0) {
      const partUnitaireIntervenant = Math.round(partUnitaireSaisissant / 2);
      intervenants.forEach((nom) => {
        newBeneficiaires.push({
          nom,
          type: "CHEF",
          montant: partUnitaireIntervenant,
          pourcentage: (partUnitaireIntervenant / net) * 100,
        });
        partTotaleIntervenants += partUnitaireIntervenant;
      });
    }

    // 6. Le reste sera réparti entre les autres fonds
    const totalDistribue =
      partBudget +
      partFSP +
      partSaisissants +
      partIndicateur +
      partTotaleIntervenants;
    const reste = net - totalDistribue;

    if (reste > 0 && fonds.length > 0) {
      const autresFonds = fonds.filter(
        (f) => f.nom !== "Part Budget" && f.nom !== "FSP"
      );
      
      if (autresFonds.length > 0) {
        const totalPoidsAutresFonds = autresFonds.reduce(
          (acc, f) => acc + (f.pourcentage || 0),
          0
        );

        if (totalPoidsAutresFonds > 0) {
          autresFonds.forEach((fond) => {
            const montant = Math.round(
              (reste * (fond.pourcentage || 0)) / totalPoidsAutresFonds
            );
            newBeneficiaires.push({
              nom: fond.nom,
              type: "FONDS",
              montant,
              pourcentage: (montant / net) * 100,
            });
          });
        } else {
          const montantParFond = Math.round(reste / autresFonds.length);
          autresFonds.forEach((fond) => {
            newBeneficiaires.push({
              nom: fond.nom,
              type: "FONDS",
              montant: montantParFond,
              pourcentage: (montantParFond / net) * 100,
            });
          });
        }
      }
    }

    setBeneficiaires(newBeneficiaires);
    setShowAutoDialog(false);
    setSaisissantsInput("");
    setHasIndicateur(false);
    setIndicateurNom("");
    setHasIntervenants(false);
    setIntervenantsInput("");
    toast({
      title: "Répartition effectuée",
      description: "La répartition automatique a été appliquée",
    });
  };

  const enregistrer = async () => {
    if (!affaire) return;

    const totalDistribue = beneficiaires.reduce(
      (acc, b) => acc + (b.montant || 0),
      0
    );
    const net = affaire.montant_net || 0;

    if (totalDistribue > net) {
      toast({
        title: "Erreur",
        description: "Le total distribué dépasse le montant net",
        variant: "destructive",
      });
      return;
    }

    try {
      // Supprimer les anciens bénéficiaires
      await supabase
        .from("beneficiaires")
        .delete()
        .eq("affaire_id", affaire.id);

      // Insérer les nouveaux bénéficiaires
      const beneficiairesData = beneficiaires.map((b) => ({
        affaire_id: affaire.id,
        nom: b.nom,
        type: b.type,
        montant: b.montant || 0,
        pourcentage: b.pourcentage || 0,
      }));

      const { error: benefError } = await supabase
        .from("beneficiaires")
        .insert(beneficiairesData);

      if (benefError) throw benefError;

      toast({
        title: "Succès",
        description: "La répartition a été enregistrée avec succès",
      });

      navigate("/historique");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const totalDistribue = beneficiaires.reduce(
    (acc, b) => acc + (b.montant || 0),
    0
  );
  const ecart = (affaire?.montant_net || 0) - totalDistribue;

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR").format(montant);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!affaire) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Répartition de l'Affaire {affaire.numero}
        </h1>
        <p className="text-muted-foreground mt-2">
          Effectuer la répartition des bénéficiaires pour cette affaire
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'affaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <Label className="text-muted-foreground">N° Affaire</Label>
              <p className="font-semibold text-lg">{affaire.numero}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Date</Label>
              <p className="font-semibold text-lg">
                {new Date(affaire.date_affaire).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Montant Net à Répartir</Label>
              <p className="font-semibold text-lg text-primary">
                {formatMontant(affaire.montant_net)} FCFA
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <span className="font-semibold">Total distribué : </span>
              <span className="text-lg">
                {formatMontant(totalDistribue)} FCFA
              </span>
            </div>
            <div>
              <span className="font-semibold">Écart : </span>
              <span
                className={`text-lg font-bold ${
                  ecart === 0
                    ? "text-success"
                    : ecart < 0
                    ? "text-destructive"
                    : "text-warning"
                }`}
              >
                {formatMontant(ecart)} FCFA
              </span>
            </div>
          </div>

          {ecart !== 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning" />
              <p className="text-sm text-warning-foreground">
                {ecart > 0 
                  ? `Il reste ${formatMontant(ecart)} FCFA à distribuer`
                  : `Le total distribué dépasse de ${formatMontant(Math.abs(ecart))} FCFA`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bénéficiaires</span>
            <div className="flex gap-2">
              <Button onClick={openAutoDialog} variant="outline" size="sm">
                <Wand2 className="w-4 h-4 mr-2" />
                Répartition Auto
              </Button>
              <Button onClick={ajouterBeneficiaire} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant (FCFA)</TableHead>
                <TableHead>Pourcentage</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beneficiaires.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Aucun bénéficiaire ajouté
                  </TableCell>
                </TableRow>
              ) : (
                beneficiaires.map((b, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={b.nom}
                        onChange={(e) =>
                          modifierBeneficiaire(index, "nom", e.target.value)
                        }
                        placeholder="Nom du bénéficiaire"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={b.type}
                        onValueChange={(value) =>
                          modifierBeneficiaire(index, "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAISISSANT">
                            SAISISSANT
                          </SelectItem>
                          <SelectItem value="CHEF">CHEF</SelectItem>
                          <SelectItem value="FONDS">FONDS</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatMontant(b.montant)}
                      </div>
                    </TableCell>
                    <TableCell>{b.pourcentage.toFixed(2)}%</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => supprimerBeneficiaire(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button onClick={() => navigate("/historique")} variant="outline" size="lg">
          Annuler
        </Button>
        <Button onClick={enregistrer} size="lg" className="gap-2">
          <Save className="w-5 h-5" />
          Enregistrer la répartition
        </Button>
      </div>

      {/* Dialog pour la répartition automatique */}
      <Dialog open={showAutoDialog} onOpenChange={setShowAutoDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Répartition Automatique</DialogTitle>
            <DialogDescription>
              Configurez les paramètres pour la répartition automatique selon les règles métier
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="saisissants">
                Saisissants * <span className="text-muted-foreground text-sm">(séparés par des virgules)</span>
              </Label>
              <Input
                id="saisissants"
                value={saisissantsInput}
                onChange={(e) => setSaisissantsInput(e.target.value)}
                placeholder="Ex: Jean Dupont, Marie Martin, Paul Durand"
              />
            </div>

            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="indicateur-switch">Indicateur</Label>
                  <p className="text-sm text-muted-foreground">
                    Part de 10% si applicable
                  </p>
                </div>
                <Switch
                  id="indicateur-switch"
                  checked={hasIndicateur}
                  onCheckedChange={setHasIndicateur}
                />
              </div>
              
              {hasIndicateur && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="indicateur-nom">Nom de l'indicateur *</Label>
                  <Input
                    id="indicateur-nom"
                    value={indicateurNom}
                    onChange={(e) => setIndicateurNom(e.target.value)}
                    placeholder="Ex: Service Indicateurs"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="intervenants-switch">Intervenants</Label>
                  <p className="text-sm text-muted-foreground">
                    Part égale à la moitié d'un saisissant
                  </p>
                </div>
                <Switch
                  id="intervenants-switch"
                  checked={hasIntervenants}
                  onCheckedChange={setHasIntervenants}
                />
              </div>
              
              {hasIntervenants && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="intervenants">
                    Noms des intervenants <span className="text-muted-foreground text-sm">(séparés par des virgules)</span>
                  </Label>
                  <Input
                    id="intervenants"
                    value={intervenantsInput}
                    onChange={(e) => setIntervenantsInput(e.target.value)}
                    placeholder="Ex: Sophie Laurent, Pierre Moreau"
                  />
                </div>
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Répartition appliquée :</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Part Budget : 50%</li>
                <li>• FSP : 4%</li>
                <li>• Saisissants : 25% (réparti entre tous)</li>
                {hasIndicateur && <li>• Indicateur : 10%</li>}
                {hasIntervenants && <li>• Intervenants : moitié de la part d'un saisissant (chacun)</li>}
                <li>• Reste : réparti entre les autres fonds</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAutoDialog(false)}>
              Annuler
            </Button>
            <Button onClick={repartitionAuto}>
              <Wand2 className="w-4 h-4 mr-2" />
              Appliquer la répartition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Saisie;
