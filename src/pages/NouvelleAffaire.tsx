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
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NouvelleAffaire = () => {
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

  const generateNumero = () => {
    const year = new Date(dateAffaire).getFullYear();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${random}/${year}`;
  };

  useEffect(() => {
    if (!numero) {
      setNumero(generateNumero());
    }
  }, [dateAffaire]);

  const enregistrer = async () => {
    if (!numero || !dateAffaire) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires (N° Affaire et Date)",
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
            montant_net: parseFloat(montantNet) || 0,
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

      toast({
        title: "Succès",
        description: "L'affaire a été créée avec succès",
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Nouvelle Affaire Contentieuse
        </h1>
        <p className="text-muted-foreground mt-2">
          Créer un nouveau dossier d'affaire contentieuse
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
              <AccordionTrigger>Informations Générales *</AccordionTrigger>
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
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={enregistrer} size="lg" className="gap-2">
          <Save className="w-5 h-5" />
          Créer l'affaire
        </Button>
      </div>
    </div>
  );
};

export default NouvelleAffaire;
