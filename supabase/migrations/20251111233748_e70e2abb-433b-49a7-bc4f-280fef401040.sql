-- Fonction pour générer le numéro de dossier office avec format personnalisable
CREATE OR REPLACE FUNCTION generate_numero_dossier_office(p_office text, p_date_affaire date)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_format text;
  v_year text;
  v_month text;
  v_next_number integer;
  v_numero_dossier text;
  v_separator text;
BEGIN
  -- Récupérer le format depuis les paramètres (par défaut: ANNEE/NUMERO)
  SELECT val INTO v_format FROM settings WHERE key = 'format_numero_dossier_office';
  IF v_format IS NULL THEN
    v_format := 'ANNEE/NUMERO';
  END IF;
  
  -- Récupérer le séparateur (par défaut: /)
  SELECT val INTO v_separator FROM settings WHERE key = 'separateur_numero_dossier';
  IF v_separator IS NULL THEN
    v_separator := '/';
  END IF;
  
  -- Extraire année et mois
  v_year := EXTRACT(YEAR FROM p_date_affaire)::text;
  v_month := LPAD(EXTRACT(MONTH FROM p_date_affaire)::text, 2, '0');
  
  -- Trouver le prochain numéro pour cet office et cette année
  SELECT COALESCE(MAX(
    CASE 
      WHEN numero_dossier_office ~ '[0-9]+$'
      THEN CAST(REGEXP_REPLACE(numero_dossier_office, '^.*?([0-9]+)$', '\1') AS integer)
      ELSE 0
    END
  ), 0) + 1
  INTO v_next_number
  FROM affaires
  WHERE office = p_office 
    AND EXTRACT(YEAR FROM date_affaire) = EXTRACT(YEAR FROM p_date_affaire);
  
  -- Construire le numéro selon le format
  v_numero_dossier := v_format;
  v_numero_dossier := REPLACE(v_numero_dossier, 'ANNEE', v_year);
  v_numero_dossier := REPLACE(v_numero_dossier, 'MOIS', v_month);
  v_numero_dossier := REPLACE(v_numero_dossier, 'OFFICE', p_office);
  v_numero_dossier := REPLACE(v_numero_dossier, 'NUMERO', LPAD(v_next_number::text, 3, '0'));
  v_numero_dossier := REPLACE(v_numero_dossier, '/', v_separator);
  
  RETURN v_numero_dossier;
END;
$$;

-- Modifier le trigger pour générer aussi le numéro de dossier office
CREATE OR REPLACE FUNCTION set_affaire_numero()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si le numéro d'affaire n'est pas fourni ou est vide, le générer automatiquement
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := generate_affaire_numero(NEW.office, NEW.date_affaire);
  END IF;
  
  -- Si le numéro de dossier office n'est pas fourni ou est vide, le générer automatiquement
  IF NEW.numero_dossier_office IS NULL OR NEW.numero_dossier_office = '' THEN
    NEW.numero_dossier_office := generate_numero_dossier_office(NEW.office, NEW.date_affaire);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Insérer les paramètres par défaut pour le format
INSERT INTO settings (key, val) 
VALUES ('format_numero_dossier_office', 'ANNEE/NUMERO')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, val) 
VALUES ('separateur_numero_dossier', '/')
ON CONFLICT (key) DO NOTHING;