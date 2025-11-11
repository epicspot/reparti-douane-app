-- Ajouter une contrainte d'unicité sur le numéro de dossier office
-- Permet d'avoir le même numéro dans différents offices mais pas dans le même office
ALTER TABLE affaires ADD CONSTRAINT unique_numero_dossier_office_par_office 
UNIQUE (office, numero_dossier_office);