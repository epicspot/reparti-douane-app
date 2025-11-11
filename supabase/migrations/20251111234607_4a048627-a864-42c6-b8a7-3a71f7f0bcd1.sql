-- Supprimer la contrainte d'unicité actuelle
ALTER TABLE affaires DROP CONSTRAINT IF EXISTS unique_numero_dossier_office_par_office;

-- Ajouter une nouvelle contrainte d'unicité par office ET par année
CREATE UNIQUE INDEX unique_numero_dossier_par_office_et_annee 
ON affaires (office, numero_dossier_office, EXTRACT(YEAR FROM date_affaire));

-- Modifier le trigger pour ne plus générer automatiquement le numéro de dossier office
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
  
  -- Le numéro de dossier office est maintenant saisi manuellement, pas généré automatiquement
  
  RETURN NEW;
END;
$$;