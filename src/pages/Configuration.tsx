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
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Configuration = () => {
  const [fonds, setFonds] = useState<any[]>([]);
  const [chefs, setChefs] = useState<any[]>([]);
  const [nouveauFond, setNouveauFond] = useState({ nom: "", pourcentage: "" });
  const [nouveauChef, setNouveauChef] = useState({ nom: "", pourcentage: "" });
  const [editingFond, setEditingFond] = useState<string | null>(null);
  const [editingChef, setEditingChef] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: 'fond' | 'chef' | null; id: string | null }>({
    open: false,
    type: null,
    id: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const { data: fondsData } = await supabase.from("fonds").select("*");
    const { data: chefsData } = await supabase.from("chefs").select("*");
    setFonds(fondsData || []);
    setChefs(chefsData || []);
  };

  const ajouterFond = async () => {
    if (!nouveauFond.nom || !nouveauFond.pourcentage) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("fonds").insert([
        {
          nom: nouveauFond.nom,
          pourcentage: parseFloat(nouveauFond.pourcentage),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Fonds ajouté avec succès",
      });

      setNouveauFond({ nom: "", pourcentage: "" });
      loadConfig();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const ajouterChef = async () => {
    if (!nouveauChef.nom || !nouveauChef.pourcentage) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("chefs").insert([
        {
          nom: nouveauChef.nom,
          pourcentage: parseFloat(nouveauChef.pourcentage),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Chef ajouté avec succès",
      });

      setNouveauChef({ nom: "", pourcentage: "" });
      loadConfig();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (type: 'fond' | 'chef', id: string) => {
    setDeleteDialog({ open: true, type, id });
  };

  const supprimerFond = async (id: string) => {
    try {
      const { error } = await supabase.from("fonds").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Fonds supprimé",
      });

      loadConfig();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleteDialog({ open: false, type: null, id: null });
  };

  const supprimerChef = async (id: string) => {
    try {
      const { error } = await supabase.from("chefs").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Chef supprimé",
      });

      loadConfig();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleteDialog({ open: false, type: null, id: null });
  };

  const modifierNomFond = async (id: string, nom: string) => {
    try {
      const { error } = await supabase
        .from("fonds")
        .update({ nom })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nom mis à jour",
      });

      setEditingFond(null);
      loadConfig();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const modifierNomChef = async (id: string, nom: string) => {
    try {
      const { error } = await supabase
        .from("chefs")
        .update({ nom })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nom mis à jour",
      });

      setEditingChef(null);
      loadConfig();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const modifierPourcentageFond = async (id: string, pourcentage: number) => {
    try {
      const { error } = await supabase
        .from("fonds")
        .update({ pourcentage })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Pourcentage mis à jour",
      });

      loadConfig();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const modifierPourcentageChef = async (id: string, pourcentage: number) => {
    try {
      const { error } = await supabase
        .from("chefs")
        .update({ pourcentage })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Pourcentage mis à jour",
      });

      loadConfig();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const totalPourcentageFonds = fonds.reduce(
    (acc, f) => acc + (f.pourcentage || 0),
    0
  );
  const totalPourcentageChefs = chefs.reduce(
    (acc, c) => acc + (c.pourcentage || 0),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Gérer les fonds et les chefs pour la répartition automatique
        </p>
      </div>

      <Tabs defaultValue="fonds" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fonds">Fonds</TabsTrigger>
          <TabsTrigger value="chefs">Chefs</TabsTrigger>
        </TabsList>

        <TabsContent value="fonds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un Fonds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="nomFond">Nom du fonds</Label>
                  <Input
                    id="nomFond"
                    value={nouveauFond.nom}
                    onChange={(e) =>
                      setNouveauFond({ ...nouveauFond, nom: e.target.value })
                    }
                    placeholder="Ex: FONDS DE SOLIDARITE"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label htmlFor="pctFond">Pourcentage (%)</Label>
                  <Input
                    id="pctFond"
                    type="number"
                    step="0.1"
                    value={nouveauFond.pourcentage}
                    onChange={(e) =>
                      setNouveauFond({
                        ...nouveauFond,
                        pourcentage: e.target.value,
                      })
                    }
                    placeholder="2.5"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={ajouterFond}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Liste des Fonds</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Total: {totalPourcentageFonds.toFixed(2)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="w-[150px]">Pourcentage (%)</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fonds.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        Aucun fonds configuré
                      </TableCell>
                    </TableRow>
                  ) : (
                    fonds.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell>
                          {editingFond === f.id ? (
                            <div className="flex gap-2">
                              <Input
                                defaultValue={f.nom}
                                onBlur={(e) => modifierNomFond(f.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    modifierNomFond(f.id, e.currentTarget.value);
                                  }
                                }}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{f.nom}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setEditingFond(f.id)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.1"
                            value={f.pourcentage}
                            onChange={(e) =>
                              modifierPourcentageFond(
                                f.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete('fond', f.id)}
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
        </TabsContent>

        <TabsContent value="chefs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un Chef</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="nomChef">Nom du chef</Label>
                  <Input
                    id="nomChef"
                    value={nouveauChef.nom}
                    onChange={(e) =>
                      setNouveauChef({ ...nouveauChef, nom: e.target.value })
                    }
                    placeholder="Ex: CHEF DE SERVICE"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label htmlFor="pctChef">Pourcentage (%)</Label>
                  <Input
                    id="pctChef"
                    type="number"
                    step="0.1"
                    value={nouveauChef.pourcentage}
                    onChange={(e) =>
                      setNouveauChef({
                        ...nouveauChef,
                        pourcentage: e.target.value,
                      })
                    }
                    placeholder="1.5"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={ajouterChef}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Liste des Chefs</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Total: {totalPourcentageChefs.toFixed(2)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="w-[150px]">Pourcentage (%)</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chefs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        Aucun chef configuré
                      </TableCell>
                    </TableRow>
                  ) : (
                    chefs.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          {editingChef === c.id ? (
                            <div className="flex gap-2">
                              <Input
                                defaultValue={c.nom}
                                onBlur={(e) => modifierNomChef(c.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    modifierNomChef(c.id, e.currentTarget.value);
                                  }
                                }}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{c.nom}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setEditingChef(c.id)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.1"
                            value={c.pourcentage}
                            onChange={(e) =>
                              modifierPourcentageChef(
                                c.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete('chef', c.id)}
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
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
            <h4 className="font-semibold text-info mb-2">
              Répartition automatique
            </h4>
            <p className="text-sm text-muted-foreground">
              La répartition automatique alloue 40% du montant net aux
              saisissants, puis répartit les 60% restants entre les chefs et
              les fonds selon leurs pourcentages respectifs.
            </p>
          </div>
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <h4 className="font-semibold text-warning mb-2">
              Attention aux pourcentages
            </h4>
            <p className="text-sm text-muted-foreground">
              La somme des pourcentages des fonds et des chefs détermine la
              répartition des 60% du montant net non alloué aux saisissants.
              Vous pouvez ajuster ces valeurs selon vos besoins.
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, type: null, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce {deleteDialog.type === 'fond' ? 'fonds' : 'chef'} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteDialog.id) {
                  if (deleteDialog.type === 'fond') {
                    supprimerFond(deleteDialog.id);
                  } else if (deleteDialog.type === 'chef') {
                    supprimerChef(deleteDialog.id);
                  }
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Configuration;
