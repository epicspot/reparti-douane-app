-- Fonction pour générer le prochain numéro d'affaire
CREATE OR REPLACE FUNCTION generate_affaire_numero(p_office text, p_date_affaire date)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_year text;
  v_next_number integer;
  v_numero text;
BEGIN
  -- Extraire l'année
  v_year := EXTRACT(YEAR FROM p_date_affaire)::text;
  
  -- Trouver le prochain numéro pour cet office et cette année
  SELECT COALESCE(MAX(
    CASE 
      WHEN numero ~ ('^' || p_office || '-' || v_year || '-[0-9]+$')
      THEN CAST(SPLIT_PART(numero, '-', 3) AS integer)
      ELSE 0
    END
  ), 0) + 1
  INTO v_next_number
  FROM affaires
  WHERE office = p_office 
    AND EXTRACT(YEAR FROM date_affaire) = EXTRACT(YEAR FROM p_date_affaire);
  
  -- Formater le numéro: OFFICE-ANNÉE-XXX
  v_numero := p_office || '-' || v_year || '-' || LPAD(v_next_number::text, 3, '0');
  
  RETURN v_numero;
END;
$$;

-- Trigger pour générer automatiquement le numéro avant insertion
CREATE OR REPLACE FUNCTION set_affaire_numero()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Si le numéro n'est pas fourni ou est vide, le générer automatiquement
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := generate_affaire_numero(NEW.office, NEW.date_affaire);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_set_affaire_numero ON affaires;
CREATE TRIGGER trigger_set_affaire_numero
  BEFORE INSERT ON affaires
  FOR EACH ROW
  EXECUTE FUNCTION set_affaire_numero();