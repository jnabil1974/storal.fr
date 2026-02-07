-- Ajouter des émetteurs (télécommandes) dans la table product_options
-- Catégorie: Émetteur

INSERT INTO product_options (name, category, purchase_price_ht, sales_coefficient, image_url, product_id)
VALUES 
  ('Télécommande Situo 1 RTS Pure', 'Émetteur', 35.00, 1.5, NULL, 1),
  ('Télécommande Situo 5 RTS Pure', 'Émetteur', 55.00, 1.5, NULL, 1),
  ('Télécommande Smoove Origin RTS', 'Émetteur', 45.00, 1.5, NULL, 1),
  ('Télécommande Telis 1 RTS', 'Émetteur', 40.00, 1.5, NULL, 1),
  ('Télécommande Telis 4 RTS', 'Émetteur', 60.00, 1.5, NULL, 1)
ON CONFLICT DO NOTHING;

-- Vérifier les émetteurs ajoutés
SELECT id, name, category, purchase_price_ht, sales_coefficient 
FROM product_options 
WHERE category = 'Émetteur'
ORDER BY purchase_price_ht;
