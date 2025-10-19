import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  // États de base
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
  
  // Nouveaux champs du formulaire détaillé
  const [region, setRegion] = useState("");
  const [office, setOffice] = useState("");
  const [numDeclaration, setNumDeclaration] = useState("");
  const [dateDeclaration, setDateDeclaration] = useState("");
  const [nomPrenomContrevenant, setNomPrenomContrevenant] = useState("");
  const [adresseComplete, setAdresseComplete] = useState("");
  const [ifu, setIfu] = useState("");
  const [natureEtMoyenDeTransport, setNatureEtMoyenDeTransport] = useState("");
  const [identificationMt, setIdentificationMt] = useState("");
  const [commissionnaireEnD, setCommissionnaireEnD] = useState("");
  const [procedeDeDetection, setProcedeDeDetection] = useState("");
  const [nombre, setNombre] = useState("");
  const [natureMarchandisesFraude, setNatureMarchandisesFraude] = useState("");
  const [origineOuProvenance, setOrigineOuProvenance] = useState("");
  const [valeurMarchandisesLitigieuses, setValeurMarchandisesLitigieuses] = useState("");
  const [natureDeLInfraction, setNatureDeLInfraction] = useState("");
  const [droitsCompromisOuEludes, setDroitsCompromisOuEludes] = useState("");
  const [numQuittanceDce, setNumQuittanceDce] = useState("");
  const [compositionDossier, setCompositionDossier] = useState("");
  const [circonstances, setCirconstances] = useState("");
  const [nombreInformateurs, setNombreInformateurs] = useState("0");
  const [suiteDeLAffaire, setSuiteDeLAffaire] = useState("");
  const [dateDelaTransactionProvisoire, setDateDelaTransactionProvisoire] = useState("");
  const [montantAmendeOuVente, setMontantAmendeOuVente] = useState("");
  const [numQuittance, setNumQuittance] = useState("");
  const [dateQuittance, setDateQuittance] = useState("");
  const [montantTotalDesFrais, setMontantTotalDesFrais] = useState("0");
  const [nomsDesChefs, setNomsDesChefs] = useState("");
  const [nomSaisissants, setNomSaisissants] = useState("");
  const [nomIntervenants, setNomIntervenants] = useState("");
  const [suiteReserveeAuxMdses, setSuiteReserveeAuxMdses] = useState("");
  const [notesSupplementaires, setNotesSupplementaires] = useState("");
  
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
            region,
            office,
            num_declaration: numDeclaration,
            date_declaration: dateDeclaration || null,
            nom_prenom_contrevenant: nomPrenomContrevenant,
            adresse_complete: adresseComplete,
            ifu,
            nature_et_moyen_de_transport: natureEtMoyenDeTransport,
            identification_mt: identificationMt,
            commissionnaire_en_d: commissionnaireEnD,
            procede_de_detection: procedeDeDetection,
            nombre: parseInt(nombre) || null,
            nature_des_marchandises_de_fraude: natureMarchandisesFraude,
            origine_ou_provenance: origineOuProvenance,
            valeur_des_marchandises_litigieuses: parseInt(valeurMarchandisesLitigieuses) || null,
            nature_de_l_infraction: natureDeLInfraction,
            droits_compromis_ou_eludes: parseInt(droitsCompromisOuEludes) || null,
            num_quittance_dce: numQuittanceDce,
            composition_dossier: compositionDossier,
            circonstances,
            nombre_informateurs: parseInt(nombreInformateurs) || 0,
            suite_de_l_affaire: suiteDeLAffaire,
            date_de_la_transaction_provisoire: dateDelaTransactionProvisoire || null,
            montant_amende_ou_vente: parseInt(montantAmendeOuVente) || null,
            num_quittance: numQuittance,
            date_quittance: dateQuittance || null,
            montant_total_des_frais: parseInt(montantTotalDesFrais) || 0,
            noms_des_chefs: nomsDesChefs,
            nom_saisissants: nomSaisissants,
            nom_intervenants: nomIntervenants,
            suite_reservee_aux_mdses: suiteReserveeAuxMdses,
            notes_supplementaires: notesSupplementaires,
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
          <CardTitle>Dossier Contentieux</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full" defaultValue={["section1"]}>
            {/* Section 1: Informations Générales */}
            <AccordionItem value="section1">
              <AccordionTrigger>Informations Générales</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Région</Label>
                    <Input
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="Ex: CENTRE-SUD"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="office">Office</Label>
                    <Input
                      id="office"
                      value={office}
                      onChange={(e) => setOffice(e.target.value)}
                      placeholder="Ex: DAKOLA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero">N° Affaire *</Label>
                    <Input
                      id="numero"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="Ex: 16/2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateAffaire">Date Affaire *</Label>
                    <Input
                      id="dateAffaire"
                      type="date"
                      value={dateAffaire}
                      onChange={(e) => setDateAffaire(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numDeclaration">N° Déclaration</Label>
                    <Input
                      id="numDeclaration"
                      value={numDeclaration}
                      onChange={(e) => setNumDeclaration(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateDeclaration">Date Déclaration</Label>
                    <Input
                      id="dateDeclaration"
                      type="date"
                      value={dateDeclaration}
                      onChange={(e) => setDateDeclaration(e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: Informations du Contrevenant */}
            <AccordionItem value="section2">
              <AccordionTrigger>Informations du Contrevenant</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomPrenomContrevenant">Nom & Prénom Contrevenant</Label>
                    <Input
                      id="nomPrenomContrevenant"
                      value={nomPrenomContrevenant}
                      onChange={(e) => setNomPrenomContrevenant(e.target.value)}
                      placeholder="Ex: DIARRA SEKOU"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adresseComplete">Adresse Complète</Label>
                    <Input
                      id="adresseComplete"
                      value={adresseComplete}
                      onChange={(e) => setAdresseComplete(e.target.value)}
                      placeholder="Ex: DAKOLA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifu">IFU</Label>
                    <Input
                      id="ifu"
                      value={ifu}
                      onChange={(e) => setIfu(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionnaireEnD">Commissionnaire en D</Label>
                    <Input
                      id="commissionnaireEnD"
                      value={commissionnaireEnD}
                      onChange={(e) => setCommissionnaireEnD(e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 3: Informations sur le Transport */}
            <AccordionItem value="section3">
              <AccordionTrigger>Informations sur le Transport</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="natureEtMoyenDeTransport">Nature et Moyen de Transport</Label>
                    <Input
                      id="natureEtMoyenDeTransport"
                      value={natureEtMoyenDeTransport}
                      onChange={(e) => setNatureEtMoyenDeTransport(e.target.value)}
                      placeholder="Ex: vehicule"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="identificationMt">Identification MT</Label>
                    <Input
                      id="identificationMt"
                      value={identificationMt}
                      onChange={(e) => setIdentificationMt(e.target.value)}
                      placeholder="Ex: 23 HP 1821 BF"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 4: Informations sur les Marchandises */}
            <AccordionItem value="section4">
              <AccordionTrigger>Informations sur les Marchandises</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="procedeDeDetection">Procédé de Détection</Label>
                    <Input
                      id="procedeDeDetection"
                      value={procedeDeDetection}
                      onChange={(e) => setProcedeDeDetection(e.target.value)}
                      placeholder="Ex: controle routier"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      type="number"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ex: 200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="natureMarchandisesFraude">Nature des Marchandises de Fraude</Label>
                    <Input
                      id="natureMarchandisesFraude"
                      value={natureMarchandisesFraude}
                      onChange={(e) => setNatureMarchandisesFraude(e.target.value)}
                      placeholder="Ex: BOISSON SUCREE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="origineOuProvenance">Origine ou Provenance</Label>
                    <Input
                      id="origineOuProvenance"
                      value={origineOuProvenance}
                      onChange={(e) => setOrigineOuProvenance(e.target.value)}
                      placeholder="Ex: GHANA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valeurMarchandisesLitigieuses">Valeur des Marchandises Litigieuses (FCFA)</Label>
                    <Input
                      id="valeurMarchandisesLitigieuses"
                      type="number"
                      value={valeurMarchandisesLitigieuses}
                      onChange={(e) => setValeurMarchandisesLitigieuses(e.target.value)}
                      placeholder="Ex: 500000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suiteReserveeAuxMdses">Suite Réservée aux Marchandises</Label>
                    <Input
                      id="suiteReserveeAuxMdses"
                      value={suiteReserveeAuxMdses}
                      onChange={(e) => setSuiteReserveeAuxMdses(e.target.value)}
                      placeholder="Ex: MISE A LA CONSOMMATION"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 5: Informations Financières */}
            <AccordionItem value="section5">
              <AccordionTrigger>Informations Financières</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="natureDeLInfraction">Nature de l'Infraction</Label>
                    <Input
                      id="natureDeLInfraction"
                      value={natureDeLInfraction}
                      onChange={(e) => setNatureDeLInfraction(e.target.value)}
                      placeholder="Ex: ISD/ESD"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="droitsCompromisOuEludes">Droits Compromis ou Eludés (FCFA)</Label>
                    <Input
                      id="droitsCompromisOuEludes"
                      type="number"
                      value={droitsCompromisOuEludes}
                      onChange={(e) => setDroitsCompromisOuEludes(e.target.value)}
                      placeholder="Ex: 250000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numQuittanceDce">N° Quittance DCE</Label>
                    <Input
                      id="numQuittanceDce"
                      value={numQuittanceDce}
                      onChange={(e) => setNumQuittanceDce(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compositionDossier">Composition Dossier</Label>
                    <Input
                      id="compositionDossier"
                      value={compositionDossier}
                      onChange={(e) => setCompositionDossier(e.target.value)}
                      placeholder="Ex: CT8; EDPN"
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
                    <Label htmlFor="montantNet">Produit Net à Répartir (FCFA) *</Label>
                    <Input
                      id="montantNet"
                      type="number"
                      value={montantNet}
                      onChange={(e) => setMontantNet(e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 6: Informations de Traitement */}
            <AccordionItem value="section6">
              <AccordionTrigger>Informations de Traitement</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreInformateurs">Nombre Informateurs</Label>
                    <Input
                      id="nombreInformateurs"
                      type="number"
                      value={nombreInformateurs}
                      onChange={(e) => setNombreInformateurs(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suiteDeLAffaire">Suite de l'Affaire</Label>
                    <Input
                      id="suiteDeLAffaire"
                      value={suiteDeLAffaire}
                      onChange={(e) => setSuiteDeLAffaire(e.target.value)}
                      placeholder="Ex: transaction"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateDelaTransactionProvisoire">Date de la Transaction Provisoire</Label>
                    <Input
                      id="dateDelaTransactionProvisoire"
                      type="date"
                      value={dateDelaTransactionProvisoire}
                      onChange={(e) => setDateDelaTransactionProvisoire(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="montantAmendeOuVente">Montant Amende ou Vente (FCFA)</Label>
                    <Input
                      id="montantAmendeOuVente"
                      type="number"
                      value={montantAmendeOuVente}
                      onChange={(e) => setMontantAmendeOuVente(e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numQuittance">N° Quittance</Label>
                    <Input
                      id="numQuittance"
                      value={numQuittance}
                      onChange={(e) => setNumQuittance(e.target.value)}
                      placeholder="Ex: 13804"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateQuittance">Date Quittance</Label>
                    <Input
                      id="dateQuittance"
                      type="date"
                      value={dateQuittance}
                      onChange={(e) => setDateQuittance(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="montantTotalDesFrais">Montant Total des Frais (FCFA)</Label>
                    <Input
                      id="montantTotalDesFrais"
                      type="number"
                      value={montantTotalDesFrais}
                      onChange={(e) => setMontantTotalDesFrais(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 7: Intervenants */}
            <AccordionItem value="section7">
              <AccordionTrigger>Intervenants</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomsDesChefs">Noms des Chefs</Label>
                    <Textarea
                      id="nomsDesChefs"
                      value={nomsDesChefs}
                      onChange={(e) => setNomsDesChefs(e.target.value)}
                      placeholder="Ex: DGD; KOUTOU HAMADOU"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomSaisissants">Nom Saisissants</Label>
                    <Textarea
                      id="nomSaisissants"
                      value={nomSaisissants}
                      onChange={(e) => setNomSaisissants(e.target.value)}
                      placeholder="Ex: BATIONO MARCELIN; SANOGO YACOUBA"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomIntervenants">Nom Intervenants</Label>
                    <Textarea
                      id="nomIntervenants"
                      value={nomIntervenants}
                      onChange={(e) => setNomIntervenants(e.target.value)}
                      placeholder="Ex: KIEMA GUY PROSPER"
                      rows={2}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 8: Circonstances et Notes */}
            <AccordionItem value="section8">
              <AccordionTrigger>Circonstances et Notes</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="circonstances">Circonstances</Label>
                    <Textarea
                      id="circonstances"
                      value={circonstances}
                      onChange={(e) => setCirconstances(e.target.value)}
                      placeholder="Décrivez les circonstances de l'affaire..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notesSupplementaires">Notes Supplémentaires</Label>
                    <Textarea
                      id="notesSupplementaires"
                      value={notesSupplementaires}
                      onChange={(e) => setNotesSupplementaires(e.target.value)}
                      placeholder="Notes supplémentaires..."
                      rows={4}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg mt-6">
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
