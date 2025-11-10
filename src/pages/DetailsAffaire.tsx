import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Building,
  MapPin,
  Truck,
  Package,
  Scale,
  UserCheck,
  Edit,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Affaire {
  id: string;
  numero: string;
  date_affaire: string;
  montant_total: number;
  montant_net: number;
  region?: string;
  office?: string;
  num_declaration?: string;
  date_declaration?: string;
  nom_prenom_contrevenant?: string;
  adresse_complete?: string;
  ifu?: string;
  nature_et_moyen_de_transport?: string;
  identification_mt?: string;
  commissionnaire_en_d?: string;
  procede_de_detection?: string;
  nombre?: number;
  nature_des_marchandises_de_fraude?: string;
  origine_ou_provenance?: string;
  valeur_des_marchandises_litigieuses?: number;
  nature_de_l_infraction?: string;
  droits_compromis_ou_eludes?: number;
  num_quittance_dce?: string;
  composition_dossier?: string;
  circonstances?: string;
  nombre_informateurs?: number;
  suite_de_l_affaire?: string;
  date_de_la_transaction_provisoire?: string;
  montant_amende_ou_vente?: number;
  num_quittance?: string;
  date_quittance?: string;
  montant_total_des_frais?: number;
  noms_des_chefs?: string;
  nom_saisissants?: string;
  nom_intervenants?: string;
  suite_reservee_aux_mdses?: string;
  notes_supplementaires?: string;
}

interface Beneficiaire {
  id: string;
  nom: string;
  type: string;
  montant: number;
  pourcentage: number;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--info))",
  "hsl(var(--secondary))",
];

const DetailsAffaire = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [affaire, setAffaire] = useState<Affaire | null>(null);
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAffaire();
      loadBeneficiaires();
    }
  }, [id]);

  const loadAffaire = async () => {
    try {
      const { data, error } = await supabase
        .from("affaires")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setAffaire(data);
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

  const loadBeneficiaires = async () => {
    try {
      const { data, error } = await supabase
        .from("beneficiaires")
        .select("*")
        .eq("affaire_id", id);

      if (error) throw error;
      setBeneficiaires(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!affaire) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/historique")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Affaire non trouvée</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartData = beneficiaires.map((b) => ({
    name: b.nom,
    value: b.montant,
  }));

  const totalDistribue = beneficiaires.reduce((sum, b) => sum + b.montant, 0);
  const pourcentageDistribue = affaire.montant_net
    ? (totalDistribue / affaire.montant_net) * 100
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground rounded-lg p-6 shadow-elegant">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/historique")}
              className="text-primary-foreground hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Affaire N° {affaire.numero}</h1>
              <p className="opacity-90 mt-1">
                <Calendar className="w-4 h-4 inline mr-2" />
                {formatDate(affaire.date_affaire)}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate(`/nouvelle-affaire/${id}`)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Statistiques Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Montant Total</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(affaire.montant_total)}
                </p>
              </div>
              <div className="bg-gradient-primary p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produit Net</p>
                <p className="text-2xl font-bold text-accent">
                  {formatCurrency(affaire.montant_net)}
                </p>
              </div>
              <div className="bg-gradient-accent p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Distribué</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(totalDistribue)}
                </p>
              </div>
              <div className="bg-success/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bénéficiaires</p>
                <p className="text-2xl font-bold text-warning">
                  {beneficiaires.length}
                </p>
              </div>
              <div className="bg-warning/20 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition */}
      {beneficiaires.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader className="bg-gradient-subtle">
            <CardTitle className="text-primary">Répartition des Fonds</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value.toLocaleString()} FCFA`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Liste des bénéficiaires */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-semibold">{pourcentageDistribue.toFixed(1)}%</span>
                  </div>
                  <Progress value={pourcentageDistribue} className="h-2" />
                </div>

                <Separator />

                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {beneficiaires.map((b, index) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-3 bg-gradient-subtle rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{b.nom}</p>
                          <p className="text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {b.type}
                            </Badge>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatCurrency(b.montant)}</p>
                        <p className="text-xs text-muted-foreground">{b.pourcentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations Détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations Générales */}
        <Card className="shadow-soft border-primary/10">
          <CardHeader className="bg-gradient-subtle">
            <CardTitle className="flex items-center gap-2 text-primary">
              <FileText className="w-5 h-5" />
              Informations Générales
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {affaire.region && (
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Région
                </span>
                <span className="font-medium">{affaire.region}</span>
              </div>
            )}
            {affaire.office && (
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Office
                </span>
                <span className="font-medium">{affaire.office}</span>
              </div>
            )}
            {affaire.num_declaration && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">N° Déclaration</span>
                <span className="font-medium">{affaire.num_declaration}</span>
              </div>
            )}
            {affaire.date_declaration && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date Déclaration</span>
                <span className="font-medium">{formatDate(affaire.date_declaration)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contrevenant */}
        {affaire.nom_prenom_contrevenant && (
          <Card className="shadow-soft border-accent/10">
            <CardHeader className="bg-gradient-subtle">
              <CardTitle className="flex items-center gap-2 text-accent">
                <Users className="w-5 h-5" />
                Contrevenant
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom & Prénom</span>
                <span className="font-medium">{affaire.nom_prenom_contrevenant}</span>
              </div>
              {affaire.adresse_complete && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Adresse</span>
                  <span className="font-medium">{affaire.adresse_complete}</span>
                </div>
              )}
              {affaire.ifu && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IFU</span>
                  <span className="font-medium">{affaire.ifu}</span>
                </div>
              )}
              {affaire.commissionnaire_en_d && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commissionnaire</span>
                  <span className="font-medium">{affaire.commissionnaire_en_d}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Transport */}
        {affaire.nature_et_moyen_de_transport && (
          <Card className="shadow-soft border-info/10">
            <CardHeader className="bg-gradient-subtle">
              <CardTitle className="flex items-center gap-2 text-info">
                <Truck className="w-5 h-5" />
                Transport
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nature & Moyen</span>
                <span className="font-medium">{affaire.nature_et_moyen_de_transport}</span>
              </div>
              {affaire.identification_mt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Identification</span>
                  <span className="font-medium">{affaire.identification_mt}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Marchandises */}
        {affaire.nature_des_marchandises_de_fraude && (
          <Card className="shadow-soft border-success/10">
            <CardHeader className="bg-gradient-subtle">
              <CardTitle className="flex items-center gap-2 text-success">
                <Package className="w-5 h-5" />
                Marchandises
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nature</span>
                <span className="font-medium">{affaire.nature_des_marchandises_de_fraude}</span>
              </div>
              {affaire.origine_ou_provenance && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Origine</span>
                  <span className="font-medium">{affaire.origine_ou_provenance}</span>
                </div>
              )}
              {affaire.nombre && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre</span>
                  <span className="font-medium">{affaire.nombre}</span>
                </div>
              )}
              {affaire.valeur_des_marchandises_litigieuses && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valeur</span>
                  <span className="font-medium">
                    {formatCurrency(affaire.valeur_des_marchandises_litigieuses)}
                  </span>
                </div>
              )}
              {affaire.procede_de_detection && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Procédé de détection</span>
                  <span className="font-medium">{affaire.procede_de_detection}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Informations Financières */}
      {affaire.nature_de_l_infraction && (
        <Card className="shadow-soft border-warning/10">
          <CardHeader className="bg-gradient-subtle">
            <CardTitle className="flex items-center gap-2 text-warning">
              <Scale className="w-5 h-5" />
              Informations Financières et Infractions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nature de l'infraction</span>
                <span className="font-medium">{affaire.nature_de_l_infraction}</span>
              </div>
              {affaire.droits_compromis_ou_eludes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Droits compromis/éludés</span>
                  <span className="font-medium">
                    {formatCurrency(affaire.droits_compromis_ou_eludes)}
                  </span>
                </div>
              )}
              {affaire.montant_amende_ou_vente && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant amende/vente</span>
                  <span className="font-medium">
                    {formatCurrency(affaire.montant_amende_ou_vente)}
                  </span>
                </div>
              )}
              {affaire.montant_total_des_frais !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total des frais</span>
                  <span className="font-medium">
                    {formatCurrency(affaire.montant_total_des_frais)}
                  </span>
                </div>
              )}
              {affaire.num_quittance && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">N° Quittance</span>
                  <span className="font-medium">{affaire.num_quittance}</span>
                </div>
              )}
              {affaire.date_quittance && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Quittance</span>
                  <span className="font-medium">{formatDate(affaire.date_quittance)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intervenants */}
      {(affaire.noms_des_chefs || affaire.nom_saisissants || affaire.nom_intervenants) && (
        <Card className="shadow-soft">
          <CardHeader className="bg-gradient-subtle">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Users className="w-5 h-5" />
              Intervenants
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {affaire.noms_des_chefs && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Chefs</p>
                <p className="text-foreground">{affaire.noms_des_chefs}</p>
              </div>
            )}
            {affaire.nom_saisissants && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Saisissants</p>
                <p className="text-foreground">{affaire.nom_saisissants}</p>
              </div>
            )}
            {affaire.nom_intervenants && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Autres Intervenants
                </p>
                <p className="text-foreground">{affaire.nom_intervenants}</p>
              </div>
            )}
            {affaire.nombre_informateurs !== undefined && affaire.nombre_informateurs > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Informateurs</p>
                <Badge variant="secondary">{affaire.nombre_informateurs} informateur(s)</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes et Circonstances */}
      {(affaire.circonstances || affaire.notes_supplementaires || affaire.suite_de_l_affaire) && (
        <Card className="shadow-soft">
          <CardHeader className="bg-gradient-subtle">
            <CardTitle className="text-primary">Notes et Observations</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {affaire.circonstances && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Circonstances</p>
                <p className="text-foreground whitespace-pre-wrap">{affaire.circonstances}</p>
              </div>
            )}
            {affaire.suite_de_l_affaire && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Suite de l'affaire
                </p>
                <p className="text-foreground whitespace-pre-wrap">{affaire.suite_de_l_affaire}</p>
              </div>
            )}
            {affaire.notes_supplementaires && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Notes supplémentaires
                </p>
                <p className="text-foreground whitespace-pre-wrap">
                  {affaire.notes_supplementaires}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailsAffaire;
