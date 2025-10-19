-- Table des affaires douanières
CREATE TABLE public.affaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL UNIQUE,
  date_affaire DATE NOT NULL,
  montant_total INTEGER NOT NULL DEFAULT 0,
  montant_net INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des bénéficiaires
CREATE TABLE public.beneficiaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affaire_id UUID NOT NULL REFERENCES public.affaires(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SAISISSANT', 'CHEF', 'FONDS')),
  montant INTEGER NOT NULL DEFAULT 0,
  pourcentage REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des fonds (configuration)
CREATE TABLE public.fonds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL UNIQUE,
  pourcentage REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des chefs (configuration)
CREATE TABLE public.chefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL UNIQUE,
  pourcentage REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table des paramètres (key-value store)
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  val TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes pour performance
CREATE INDEX idx_beneficiaires_affaire ON public.beneficiaires(affaire_id);
CREATE INDEX idx_affaires_date ON public.affaires(date_affaire DESC);
CREATE INDEX idx_affaires_numero ON public.affaires(numero);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affaires_updated_at
  BEFORE UPDATE ON public.affaires
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.affaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fonds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Permettre l'accès à tous les utilisateurs authentifiés (données partagées)
CREATE POLICY "Utilisateurs authentifiés peuvent voir toutes les affaires"
  ON public.affaires FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent créer des affaires"
  ON public.affaires FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Utilisateurs authentifiés peuvent modifier des affaires"
  ON public.affaires FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent supprimer des affaires"
  ON public.affaires FOR DELETE
  TO authenticated
  USING (true);

-- Policies pour beneficiaires
CREATE POLICY "Utilisateurs authentifiés peuvent voir tous les bénéficiaires"
  ON public.beneficiaires FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent créer des bénéficiaires"
  ON public.beneficiaires FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Utilisateurs authentifiés peuvent modifier des bénéficiaires"
  ON public.beneficiaires FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent supprimer des bénéficiaires"
  ON public.beneficiaires FOR DELETE
  TO authenticated
  USING (true);

-- Policies pour fonds
CREATE POLICY "Utilisateurs authentifiés peuvent voir tous les fonds"
  ON public.fonds FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent gérer les fonds"
  ON public.fonds FOR ALL
  TO authenticated
  USING (true);

-- Policies pour chefs
CREATE POLICY "Utilisateurs authentifiés peuvent voir tous les chefs"
  ON public.chefs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent gérer les chefs"
  ON public.chefs FOR ALL
  TO authenticated
  USING (true);

-- Policies pour settings
CREATE POLICY "Utilisateurs authentifiés peuvent voir tous les paramètres"
  ON public.settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Utilisateurs authentifiés peuvent gérer les paramètres"
  ON public.settings FOR ALL
  TO authenticated
  USING (true);

-- Données initiales par défaut pour fonds
INSERT INTO public.fonds (nom, pourcentage) VALUES
  ('PART REVENANT A LA MUTUELLE DES DOUANES', 5.0),
  ('PART REVENANT AUX POURSUIVANTS', 3.0),
  ('FONDS DE SOLIDARITE', 2.0),
  ('PART REVENANT AUX DEPOSITAIRES', 2.5),
  ('FONDS MEDICAL', 1.5),
  ('FONDS DES OEUVRES SOCIALES', 2.0),
  ('ACTIVITES SPORTIVES DE LA DOUANE', 1.0),
  ('PART SYNDICATS', 1.5),
  ('FONDS DE LUTTE CONTRE LA FRAUDE', 3.0),
  ('FOND D''EQUIPEMENT DE LA DGD', 5.0),
  ('FOND DE SOUTIEN PATRIOTIQUE', 2.0),
  ('BUDGET NATIONAL', 10.0);