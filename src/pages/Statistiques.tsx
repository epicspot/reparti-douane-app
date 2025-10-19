import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c"];

const Statistiques = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Stats globales
      const { data: affaires } = await supabase.from("affaires").select("*");
      const { data: beneficiaires } = await supabase.from("beneficiaires").select("*");

      // Par type de bénéficiaire
      const parType: any = {};
      beneficiaires?.forEach((b) => {
        parType[b.type] = (parType[b.type] || 0) + b.montant;
      });

      const dataParType = Object.entries(parType).map(([type, montant]) => ({
        name: type,
        montant: montant as number,
      }));

      // Par mois (6 derniers mois)
      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      const affairesRecentes = affaires?.filter(
        (a) => new Date(a.date_affaire) >= sixMonthsAgo
      ) || [];

      const parMois: any = {};
      affairesRecentes.forEach((a) => {
        const mois = new Date(a.date_affaire).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "short",
        });
        parMois[mois] = (parMois[mois] || 0) + a.montant_net;
      });

      const dataParMois = Object.entries(parMois).map(([mois, montant]) => ({
        mois,
        montant: montant as number,
      }));

      setStats({
        totalAffaires: affaires?.length || 0,
        montantTotalNet: affaires?.reduce((acc, a) => acc + (a.montant_net || 0), 0) || 0,
        montantTotalDistribue: beneficiaires?.reduce((acc, b) => acc + (b.montant || 0), 0) || 0,
        nombreBeneficiaires: new Set(beneficiaires?.map((b) => b.nom)).size,
        dataParType,
        dataParMois,
      });
    } catch (error: any) {
      console.error("Erreur chargement stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement des statistiques...</div>
      </div>
    );
  }

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR").format(montant) + " FCFA";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistiques et Rapports</h1>
        <p className="text-muted-foreground mt-2">
          Analyse des répartitions et tendances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAffaires || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Montant Total Net</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMontant(stats?.montantTotalNet || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Distribué</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMontant(stats?.montantTotalDistribue || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bénéficiaires Uniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.nombreBeneficiaires || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Type de Bénéficiaire</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.dataParType || []}
                  dataKey="montant"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${formatMontant(entry.montant)}`}
                >
                  {(stats?.dataParType || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatMontant(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution Mensuelle (6 derniers mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.dataParMois || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatMontant(value)} />
                <Legend />
                <Bar dataKey="montant" fill="#3498db" name="Montant Net" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistiques;
