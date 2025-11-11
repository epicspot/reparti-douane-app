import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const NouvelleAffaire = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const [currentStep, setCurrentStep] = useState(0);
  const [numero, setNumero] = useState("");
  const [dateAffaire, setDateAffaire] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [montantTotal, setMontantTotal] = useState("");
  const [montantNet, setMontantNet] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Champs du formulaire détaillé
  const [region, setRegion] = useState("");
  const [office, setOffice] = useState("");
  const [numeroDossierOffice, setNumeroDossierOffice] = useState("");
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

  useEffect(() => {
    if (isEditMode && id) {
      loadAffaire(id);
    }
  }, [id, isEditMode]);

  const loadAffaire = async (affaireId: string) => {
    try {
      const { data, error } = await supabase
        .from("affaires")
        .select("*")
        .eq("id", affaireId)
        .single();

      if (error) throw error;

      if (data) {
        setNumero(data.numero);
        setDateAffaire(data.date_affaire);
        setMontantTotal(data.montant_total?.toString() || "");
        setMontantNet(data.montant_net?.toString() || "");
        setRegion(data.region || "");
        setOffice(data.office || "");
        setNumeroDossierOffice(data.numero_dossier_office || "");
        setNumDeclaration(data.num_declaration || "");
        setDateDeclaration(data.date_declaration || "");
        setNomPrenomContrevenant(data.nom_prenom_contrevenant || "");
        setAdresseComplete(data.adresse_complete || "");
        setIfu(data.ifu || "");
        setNatureEtMoyenDeTransport(data.nature_et_moyen_de_transport || "");
        setIdentificationMt(data.identification_mt || "");
        setCommissionnaireEnD(data.commissionnaire_en_d || "");
        setProcedeDeDetection(data.procede_de_detection || "");
        setNombre(data.nombre?.toString() || "");
        setNatureMarchandisesFraude(data.nature_des_marchandises_de_fraude || "");
        setOrigineOuProvenance(data.origine_ou_provenance || "");
        setValeurMarchandisesLitigieuses(data.valeur_des_marchandises_litigieuses?.toString() || "");
        setNatureDeLInfraction(data.nature_de_l_infraction || "");
        setDroitsCompromisOuEludes(data.droits_compromis_ou_eludes?.toString() || "");
        setNumQuittanceDce(data.num_quittance_dce || "");
        setCompositionDossier(data.composition_dossier || "");
        setCirconstances(data.circonstances || "");
        setNombreInformateurs(data.nombre_informateurs?.toString() || "0");
        setSuiteDeLAffaire(data.suite_de_l_affaire || "");
        setDateDelaTransactionProvisoire(data.date_de_la_transaction_provisoire || "");
        setMontantAmendeOuVente(data.montant_amende_ou_vente?.toString() || "");
        setNumQuittance(data.num_quittance || "");
        setDateQuittance(data.date_quittance || "");
        setMontantTotalDesFrais(data.montant_total_des_frais?.toString() || "0");
        setNomsDesChefs(data.noms_des_chefs || "");
        setNomSaisissants(data.nom_saisissants || "");
        setNomIntervenants(data.nom_intervenants || "");
        setSuiteReserveeAuxMdses(data.suite_reservee_aux_mdses || "");
        setNotesSupplementaires(data.notes_supplementaires || "");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const totalSteps = 9;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const enregistrer = async () => {
    if (!dateAffaire || !office) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires (Office et Date)",
        variant: "destructive",
      });
      return;
    }

    try {
      const affaireData: any = {
        date_affaire: dateAffaire,
        montant_total: parseFloat(montantTotal) || 0,
        montant_net: parseFloat(montantNet) || 0,
        region,
        office,
        numero_dossier_office: numeroDossierOffice || null,
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
      };

      if (isEditMode && id) {
        // En mode édition, on inclut le numéro
        affaireData.numero = numero;
        
        const { error: updateError } = await supabase
          .from("affaires")
          .update(affaireData)
          .eq("id", id);

        if (updateError) throw updateError;

        toast({
          title: "Succès",
          description: "L'affaire a été modifiée avec succès",
        });
      } else {
        // En mode création, le numéro sera généré automatiquement par le trigger
        const { data: newAffaire, error: insertError } = await supabase
          .from("affaires")
          .insert([affaireData])
          .select()
          .single();

        if (insertError) throw insertError;

        toast({
          title: "Succès",
          description: `L'affaire ${newAffaire.numero} a été créée avec succès`,
        });
      }

      navigate("/historique");
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
      <div className="bg-gradient-primary text-primary-foreground rounded-lg p-6 shadow-elegant">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Modifier l'Affaire" : "Nouvelle Affaire Contentieuse"}
        </h1>
        <p className="mt-2 opacity-90">
          {isEditMode ? "Modifier le dossier d'affaire contentieuse" : "Créer un nouveau dossier d'affaire contentieuse"}
        </p>
      </div>

      <Card className="shadow-soft border-border/50">
        <CardHeader className="bg-gradient-subtle">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary">Dossier Contentieux</CardTitle>
            <div className="text-sm text-muted-foreground">
              Étape {currentStep + 1} sur {totalSteps}
            </div>
          </div>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Section 1: Informations Générales */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold text-primary">Informations Générales *</h3>
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
                    <Label htmlFor="office">Office *</Label>
                    <Input
                      id="office"
                      value={office}
                      onChange={(e) => setOffice(e.target.value)}
                      placeholder="Ex: DAKOLA"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroDossierOffice">
                      N° Dossier Office {isEditMode ? "" : "(Auto)"}
                    </Label>
                    <Input
                      id="numeroDossierOffice"
                      value={isEditMode ? numeroDossierOffice : "Généré automatiquement"}
                      onChange={(e) => isEditMode && setNumeroDossierOffice(e.target.value)}
                      placeholder={isEditMode ? "Ex: 2025/001" : "Format personnalisable"}
                      disabled={!isEditMode}
                      className={!isEditMode ? "bg-muted/50 cursor-not-allowed" : ""}
                    />
                    {!isEditMode && (
                      <p className="text-xs text-muted-foreground">
                        Le format est configurable dans Configuration
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero">
                      N° Affaire {isEditMode ? "*" : "(Auto)"}
                    </Label>
                    <Input
                      id="numero"
                      value={isEditMode ? numero : "Généré automatiquement"}
                      onChange={(e) => isEditMode && setNumero(e.target.value)}
                      placeholder={isEditMode ? "Ex: DAKOLA-2025-001" : "Format: OFFICE-ANNÉE-XXX"}
                      disabled={!isEditMode}
                      className={!isEditMode ? "bg-muted/50 cursor-not-allowed" : ""}
                    />
                    {!isEditMode && (
                      <p className="text-xs text-muted-foreground">
                        Le numéro sera généré automatiquement au format OFFICE-ANNÉE-XXX
                      </p>
                    )}
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
              </div>
            )}

            {/* Section 2: Informations du Contrevenant */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold text-accent">Informations du Contrevenant</h3>
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
              </div>
            )}

            {/* Section 3: Informations sur le Transport */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold text-info">Informations sur le Transport</h3>
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
              </div>
            )}

            {/* Section 4: Informations sur les Marchandises */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold text-success">Informations sur les Marchandises</h3>
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
              </div>
            )}

            {/* Section 5: Informations Financières */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold text-warning">Informations Financières</h3>
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
                    <Label htmlFor="montantNet">Produit Net à Répartir (FCFA)</Label>
                    <Input
                      id="montantNet"
                      type="number"
                      value={montantNet}
                      onChange={(e) => setMontantNet(e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Informations de Traitement */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold text-primary">Informations de Traitement</h3>
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
              </div>
            )}

            {/* Section 7: Intervenants */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold text-accent">Intervenants</h3>
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
              </div>
            )}

            {/* Section 8: Circonstances et Notes */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold text-info">Circonstances et Notes</h3>
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
              </div>
            )}

            {/* Section 9: Récapitulatif */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-semibold text-primary">Récapitulatif de l'Affaire</h3>
              <p className="text-muted-foreground">Veuillez vérifier toutes les informations avant l'enregistrement.</p>
              
              {/* Informations Générales */}
              <Card className="border-primary/20">
                <CardHeader className="bg-gradient-subtle">
                  <CardTitle className="text-lg text-primary">Informations Générales</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {region && <div><span className="font-semibold">Région:</span> {region}</div>}
                    {office && <div><span className="font-semibold">Office:</span> {office}</div>}
                    {numeroDossierOffice && <div><span className="font-semibold">N° Dossier Office:</span> {numeroDossierOffice}</div>}
                    {isEditMode && numero && <div><span className="font-semibold">N° Affaire:</span> {numero}</div>}
                    {dateAffaire && <div><span className="font-semibold">Date Affaire:</span> {new Date(dateAffaire).toLocaleDateString('fr-FR')}</div>}
                    {numDeclaration && <div><span className="font-semibold">N° Déclaration:</span> {numDeclaration}</div>}
                    {dateDeclaration && <div><span className="font-semibold">Date Déclaration:</span> {new Date(dateDeclaration).toLocaleDateString('fr-FR')}</div>}
                  </div>
                </CardContent>
              </Card>

              {/* Contrevenant */}
              {(nomPrenomContrevenant || adresseComplete || ifu || commissionnaireEnD) && (
                <Card className="border-accent/20">
                  <CardHeader className="bg-gradient-subtle">
                    <CardTitle className="text-lg text-accent">Contrevenant</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {nomPrenomContrevenant && <div><span className="font-semibold">Nom & Prénom:</span> {nomPrenomContrevenant}</div>}
                      {adresseComplete && <div><span className="font-semibold">Adresse:</span> {adresseComplete}</div>}
                      {ifu && <div><span className="font-semibold">IFU:</span> {ifu}</div>}
                      {commissionnaireEnD && <div><span className="font-semibold">Commissionnaire en D:</span> {commissionnaireEnD}</div>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transport */}
              {(natureEtMoyenDeTransport || identificationMt) && (
                <Card className="border-info/20">
                  <CardHeader className="bg-gradient-subtle">
                    <CardTitle className="text-lg text-info">Transport</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {natureEtMoyenDeTransport && <div><span className="font-semibold">Nature et Moyen:</span> {natureEtMoyenDeTransport}</div>}
                      {identificationMt && <div><span className="font-semibold">Identification MT:</span> {identificationMt}</div>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Marchandises */}
              {(procedeDeDetection || nombre || natureMarchandisesFraude || origineOuProvenance || valeurMarchandisesLitigieuses || suiteReserveeAuxMdses) && (
                <Card className="border-success/20">
                  <CardHeader className="bg-gradient-subtle">
                    <CardTitle className="text-lg text-success">Marchandises</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {procedeDeDetection && <div><span className="font-semibold">Procédé de Détection:</span> {procedeDeDetection}</div>}
                      {nombre && <div><span className="font-semibold">Nombre:</span> {nombre}</div>}
                      {natureMarchandisesFraude && <div><span className="font-semibold">Nature:</span> {natureMarchandisesFraude}</div>}
                      {origineOuProvenance && <div><span className="font-semibold">Origine:</span> {origineOuProvenance}</div>}
                      {valeurMarchandisesLitigieuses && <div><span className="font-semibold">Valeur:</span> {parseInt(valeurMarchandisesLitigieuses).toLocaleString('fr-FR')} FCFA</div>}
                      {suiteReserveeAuxMdses && <div><span className="font-semibold">Suite Réservée:</span> {suiteReserveeAuxMdses}</div>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Informations Financières */}
              <Card className="border-warning/20">
                <CardHeader className="bg-gradient-subtle">
                  <CardTitle className="text-lg text-warning">Informations Financières</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {natureDeLInfraction && <div><span className="font-semibold">Nature de l'Infraction:</span> {natureDeLInfraction}</div>}
                    {droitsCompromisOuEludes && <div><span className="font-semibold">Droits Compromis:</span> {parseInt(droitsCompromisOuEludes).toLocaleString('fr-FR')} FCFA</div>}
                    {numQuittanceDce && <div><span className="font-semibold">N° Quittance DCE:</span> {numQuittanceDce}</div>}
                    {compositionDossier && <div><span className="font-semibold">Composition Dossier:</span> {compositionDossier}</div>}
                    {montantTotal && <div><span className="font-semibold">Montant Total:</span> {parseInt(montantTotal).toLocaleString('fr-FR')} FCFA</div>}
                    {montantNet && <div><span className="font-semibold">Produit Net:</span> {parseInt(montantNet).toLocaleString('fr-FR')} FCFA</div>}
                  </div>
                </CardContent>
              </Card>

              {/* Traitement */}
              {(nombreInformateurs || suiteDeLAffaire || dateDelaTransactionProvisoire || montantAmendeOuVente || numQuittance || dateQuittance || montantTotalDesFrais) && (
                <Card className="border-primary/20">
                  <CardHeader className="bg-gradient-subtle">
                    <CardTitle className="text-lg text-primary">Traitement</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {nombreInformateurs !== "0" && <div><span className="font-semibold">Nombre Informateurs:</span> {nombreInformateurs}</div>}
                      {suiteDeLAffaire && <div><span className="font-semibold">Suite de l'Affaire:</span> {suiteDeLAffaire}</div>}
                      {dateDelaTransactionProvisoire && <div><span className="font-semibold">Date Transaction:</span> {new Date(dateDelaTransactionProvisoire).toLocaleDateString('fr-FR')}</div>}
                      {montantAmendeOuVente && <div><span className="font-semibold">Montant Amende/Vente:</span> {parseInt(montantAmendeOuVente).toLocaleString('fr-FR')} FCFA</div>}
                      {numQuittance && <div><span className="font-semibold">N° Quittance:</span> {numQuittance}</div>}
                      {dateQuittance && <div><span className="font-semibold">Date Quittance:</span> {new Date(dateQuittance).toLocaleDateString('fr-FR')}</div>}
                      {montantTotalDesFrais !== "0" && <div><span className="font-semibold">Total Frais:</span> {parseInt(montantTotalDesFrais).toLocaleString('fr-FR')} FCFA</div>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Intervenants */}
              {(nomsDesChefs || nomSaisissants || nomIntervenants) && (
                <Card className="border-accent/20">
                  <CardHeader className="bg-gradient-subtle">
                    <CardTitle className="text-lg text-accent">Intervenants</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {nomsDesChefs && <div><span className="font-semibold">Chefs:</span> {nomsDesChefs}</div>}
                      {nomSaisissants && <div><span className="font-semibold">Saisissants:</span> {nomSaisissants}</div>}
                      {nomIntervenants && <div><span className="font-semibold">Intervenants:</span> {nomIntervenants}</div>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Circonstances et Notes */}
              {(circonstances || notesSupplementaires) && (
                <Card className="border-info/20">
                  <CardHeader className="bg-gradient-subtle">
                    <CardTitle className="text-lg text-info">Circonstances et Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {circonstances && (
                        <div>
                          <span className="font-semibold">Circonstances:</span>
                          <p className="mt-1 text-muted-foreground">{circonstances}</p>
                        </div>
                      )}
                      {notesSupplementaires && (
                        <div>
                          <span className="font-semibold">Notes Supplémentaires:</span>
                          <p className="mt-1 text-muted-foreground">{notesSupplementaires}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

            {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            
            {currentStep < totalSteps - 1 ? (
              <Button onClick={nextStep} className="gap-2">
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={enregistrer} size="lg" className="gap-2 bg-gradient-primary shadow-elegant hover:shadow-soft transition-all">
                <Save className="w-5 h-5" />
                {isEditMode ? "Enregistrer les modifications" : "Créer l'affaire"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NouvelleAffaire;
