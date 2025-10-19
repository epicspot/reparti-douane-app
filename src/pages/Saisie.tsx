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
import { Plus, Save, Wand2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Beneficiaire {
  nom: string;
  type: string;
  montant: number;
  pourcentage: number;
}

const Saisie = () => {
  const [numero, setNumero] = useState("");
  const [dateAffaire, setDateAffaire] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [montantTotal, setMontantTotal] = useState("");
  const [montantNet, setMontantNet] = useState("");
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
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const { data: fondsData } = await supabase.from("fonds").select("*");
    const { data: chefsData } = await supabase.from("chefs").select("*");
    setFonds(fondsData || []);
    setChefs(chefsData || []);
  };

  const generateNumero = () => {
    const year = new Date(dateAffaire).getFullYear();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `REP-${year}-${random}`;
  };

  useEffect(() => {
    if (!numero) {
      setNumero(generateNumero());
    }
  }, [dateAffaire]);

  const calculerPourcentages = () => {
    const net = parseFloat(montantNet) || 0;
    if (net === 0) return;

    const newBeneficiaires = beneficiaires.map((b) => ({
      ...b,
      pourcentage: (b.montant / net) * 100,
    }));
    setBeneficiaires(newBeneficiaires);
  };

  useEffect(() => {
    calculerPourcentages();
  }, [montantNet]);

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
    const net = parseFloat(montantNet) || 0;
    if (net === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un montant net valide",
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

    const net = parseFloat(montantNet) || 0;
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
      // Filtrer les fonds qui ne sont pas déjà dans la liste
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
          // Si pas de pondération, répartir équitablement
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
    if (!numero || !dateAffaire || !montantNet) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const totalDistribue = beneficiaires.reduce(
      (acc, b) => acc + (b.montant || 0),
      0
    );
    const net = parseFloat(montantNet) || 0;

    if (totalDistribue > net) {
      toast({
        title: "Erreur",
        description: "Le total distribué dépasse le montant net",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: affaire, error: affaireError } = await supabase
        .from("affaires")
        .insert([
          {
            numero,
            date_affaire: dateAffaire,
            montant_total: parseFloat(montantTotal) || 0,
            montant_net: net,
          },
        ])
        .select()
        .single();

      if (affaireError) throw affaireError;

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

      // Réinitialiser le formulaire
      setNumero(generateNumero());
      setMontantTotal("");
      setMontantNet("");
      setBeneficiaires([]);

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
  const ecart = (parseFloat(montantNet) || 0) - totalDistribue;

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR").format(montant);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Saisie de Répartition
        </h1>
        <p className="text-muted-foreground mt-2">
          Créer une nouvelle affaire de répartition de contentieux
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'affaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">N° Affaire</Label>
              <Input
                id="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="REP-YYYY-###"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date Affaire</Label>
              <Input
                id="date"
                type="date"
                value={dateAffaire}
                onChange={(e) => setDateAffaire(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="montantTotal">Montant Total (FCFA)</Label>
              <Input
                id="montantTotal"
                type="number"
                value={montantTotal}
                onChange={(e) => setMontantTotal(e.target.value)}
                placeholder="1000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="montantNet">
                Montant Net à Répartir (FCFA) *
              </Label>
              <Input
                id="montantNet"
                type="number"
                value={montantNet}
                onChange={(e) => setMontantNet(e.target.value)}
                placeholder="900000"
              />
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
                className={`text-lg ${
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

      <div className="flex justify-end">
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
