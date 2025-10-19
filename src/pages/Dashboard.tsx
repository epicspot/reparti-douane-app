import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Users, DollarSign } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAffaires: 0,
    montantTotal: 0,
    beneficiaires: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: affaires } = await supabase.from("affaires").select("*");
    
    const { data: beneficiaires } = await supabase
      .from("beneficiaires")
      .select("*");

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const { data: monthAffaires } = await supabase
      .from("affaires")
      .select("*")
      .gte("date_affaire", thisMonth.toISOString().split("T")[0]);

    const total = affaires?.reduce(
      (acc, a) => acc + (a.montant_net || 0),
      0
    ) || 0;

    setStats({
      totalAffaires: affaires?.length || 0,
      montantTotal: total,
      beneficiaires: beneficiaires?.length || 0,
      thisMonth: monthAffaires?.length || 0,
    });
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR").format(montant) + " FCFA";
  };

  const statCards = [
    {
      title: "Total des Affaires",
      value: stats.totalAffaires,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Montant Total Réparti",
      value: formatMontant(stats.montantTotal),
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Bénéficiaires",
      value: stats.beneficiaires,
      icon: Users,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Affaires ce Mois",
      value: stats.thisMonth,
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de la répartition des contentieux douaniers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-full`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bienvenue sur le Système de Répartition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Ce système vous permet de gérer efficacement la répartition des
            contentieux douaniers entre les différents bénéficiaires.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                📝 Saisie Répartition
              </h3>
              <p className="text-sm text-muted-foreground">
                Créez une nouvelle affaire et répartissez automatiquement les
                montants selon les règles définies.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                📊 Historique
              </h3>
              <p className="text-sm text-muted-foreground">
                Consultez l'historique complet des affaires avec exports PDF,
                XLSX et CSV.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                ⚙️ Configuration
              </h3>
              <p className="text-sm text-muted-foreground">
                Gérez les fonds, chefs, signatures et paramètres du système.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                🔒 Sécurité
              </h3>
              <p className="text-sm text-muted-foreground">
                Toutes les données sont sécurisées et accessibles uniquement
                aux utilisateurs authentifiés.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
