#!/bin/bash

# Script pour copier les images dans les galeries produits
cd /Users/nabiljlaiel/Documents/PROJETS/Storal/public/images

echo "Copie des images dans les galeries..."

# Produits avec images spécifiques
for i in {1..4}; do cp stores/KITANGUY.png produits/kitanguy/gallery/$i.jpg; done
for i in {1..4}; do cp stores/KITANGUY_2.png produits/kitanguy_2/gallery/$i.jpg; done
for i in {1..4}; do cp stores/HELIOM.png produits/heliom/gallery/$i.jpg; done
for i in {1..4}; do cp stores/HELIOM.png produits/heliom_plus/gallery/$i.jpg; done
for i in {1..4}; do cp stores/KALY_O.png produits/kalyo/gallery/$i.jpg; done
for i in {1..4}; do cp stores/DYNASTA.png produits/dynasta/gallery/$i.jpg; done
for i in {1..4}; do cp stores/BELHARRA.png produits/belharra/gallery/$i.jpg; done
for i in {1..4}; do cp stores/BELHARRA_2.png produits/belharra_2/gallery/$i.jpg; done

# Produits monobloc et traditionnels
for i in {1..4}; do cp stores/store_monobloc.png produits/antibes/gallery/$i.jpg; done
for i in {1..4}; do cp "stores/store semi coffre.png" produits/madrid/gallery/$i.jpg; done
for i in {1..4}; do cp stores/store_traditionnel.png produits/genes/gallery/$i.jpg; done
for i in {1..4}; do cp stores/store_traditionnel.png produits/menton/gallery/$i.jpg; done
for i in {1..4}; do cp stores/store_traditionnel.png produits/lisbonne/gallery/$i.jpg; done
for i in {1..4}; do cp "stores/store coffre.png" produits/bras_croises/gallery/$i.jpg; done

echo "✅ Toutes les images ont été copiées dans les galeries"
echo "📁 Structure créée dans public/images/produits/"
