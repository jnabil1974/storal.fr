-- Initialize image_overlay to 40 for all existing slides
UPDATE hero_slides SET image_overlay = 40 WHERE image_overlay IS NULL;
