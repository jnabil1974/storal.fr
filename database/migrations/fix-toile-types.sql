-- Corriger l'association des toiles aux types corrects
-- Basé sur les chemins d'images

-- Orchestra Max (type 2) : toutes les toiles du dossier "ORCHESTRA MAX"
UPDATE toile_colors
SET toile_type_id = 2
WHERE image_url LIKE '%ORCHESTRA MAX%';

-- Sattler (type 3) : toutes les toiles du dossier "SATLER"
UPDATE toile_colors
SET toile_type_id = 3
WHERE image_url LIKE '%SATLER%';

-- Vérifier la répartition
SELECT 
  tt.id,
  tt.name,
  tt.code,
  COUNT(tc.id) as nb_colors
FROM toile_types tt
LEFT JOIN toile_colors tc ON tc.toile_type_id = tt.id
GROUP BY tt.id, tt.name, tt.code
ORDER BY tt.id;
