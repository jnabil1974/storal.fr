# 📸 Images des Héros Produits - Guide de Référence

## ✅ Ce qui a été fait

### Structure créée
Tous les dossiers de galerie ont été créés dans `/public/images/produits/` :

```
public/images/produits/
├── kissimy_promo/gallery/      (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── kitanguy/gallery/           (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── kitanguy_2/gallery/         (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── heliom/gallery/             (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── heliom_plus/gallery/        (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── kalyo/gallery/              (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── dynasta/gallery/            (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── belharra/gallery/           (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── belharra_2/gallery/         (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── antibes/gallery/            (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── madrid/gallery/             (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── genes/gallery/              (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── menton/gallery/             (1.jpg, 2.jpg, 3.jpg, 4.jpg)
├── lisbonne/gallery/           (1.jpg, 2.jpg, 3.jpg, 4.jpg)
└── bras_croises/gallery/       (1.jpg, 2.jpg, 3.jpg, 4.jpg)
```

### Images temporaires installées
- **Images placeholder** : Chaque galerie contient 4 copies de l'image principale du produit
- **Le carrousel fonctionne** : Les pages produits affichent maintenant le carrousel avec ces images

## 📝 Recommandations pour les images définitives

### Format optimal
- **Format** : JPG (optimisé pour web)
- **Dimensions** : 1200x900px (ratio 4:3)
- **Poids** : < 200 Ko par image (avec compression Next.js)
- **Qualité** : 85% (Next.js optimise automatiquement)

### Contenu suggéré pour chaque galerie (4 images)

**1.jpg - Vue d'ensemble**
- Store déployé, toile visible
- Vue frontale ou 3/4 face
- Montre le coffre et les bras

**2.jpg - Détail mécanisme**
- Zoom sur les bras articulés
- Détail du système d'accrochage
- Finitions du coffre

**3.jpg - Vue de côté**
- Store en projection maximale
- Montre l'inclinaison
- Contexte d'installation (terrasse/balcon)

**4.jpg - Coloris/Finitions**
- Plusieurs options de toiles
- Échantillons de couleurs coffre
- Détails esthétiques

## 🎯 Produits prioritaires à photographier

### Gamme COMPACT (Volume de ventes élevé)
- **kissimy_promo** - Actuellement : `/images/stores/KISSIMY.png`
- **kitanguy** - Actuellement : `/images/stores/KITANGUY.png`

### Gamme EXCELLENCE (Haut de gamme)
- **kitanguy_2** - Actuellement : `/images/stores/KITANGUY_2.png`
- **belharra_2** - Actuellement : `/images/stores/BELHARRA_2.png`

### Gamme ARMOR (Premium)
- **dynasta** - Actuellement : `/images/stores/DYNASTA.png`
- **belharra** - Actuellement : `/images/stores/BELHARRA.png`

### Gamme KUBE (Design moderne)
- **heliom** - Actuellement : `/images/stores/HELIOM.png`
- **heliom_plus** - Actuellement : `/images/stores/HELIOM.png`

## 🔄 Comment remplacer les images

### Option 1 : Remplacement direct
```bash
# Copier vos nouvelles photos dans les dossiers gallery
cp mes-photos/kissimy-vue1.jpg public/images/produits/kissimy_promo/gallery/1.jpg
cp mes-photos/kissimy-vue2.jpg public/images/produits/kissimy_promo/gallery/2.jpg
cp mes-photos/kissimy-vue3.jpg public/images/produits/kissimy_promo/gallery/3.jpg
cp mes-photos/kissimy-vue4.jpg public/images/produits/kissimy_promo/gallery/4.jpg
```

### Option 2 : Organisation par produit
Créez un dossier pour chaque produit avec vos photos :
```
mes-photos/
├── kissimy_promo/
│   ├── vue-ensemble.jpg → copier vers gallery/1.jpg
│   ├── detail-mecanisme.jpg → copier vers gallery/2.jpg
│   ├── vue-cote.jpg → copier vers gallery/3.jpg
│   └── coloris.jpg → copier vers gallery/4.jpg
└── dynasta/
    ├── ...
```

## 🚀 Déploiement

Une fois les nouvelles images ajoutées :
```bash
# Commit
git add public/images/produits/
git commit -m "feat: ajouter photos réelles galeries produits"
git push origin main

# Déploiement production
ssh ubuntu@51.210.244.26 "cd /var/www/storal.fr && git pull origin main && pm2 restart ecosystem.config.js"
```

## 🎨 Conseils photographiques

### Mise en scène
- Fond neutre ou contexte réel (terrasse aménagée)
- Éclairage naturel de jour
- Pas de reflets ni d'ombres dures

### Angles de prise de vue
- **Vue 1** : Au niveau des yeux, 3/4 face
- **Vue 2** : Zoom sur détail (1-2m de distance)
- **Vue 3** : Vue latérale en contre-plongée légère
- **Vue 4** : Plongée légère montrant ensemble du store

### Post-production
- Recadrage au ratio 4:3
- Correction des couleurs (balance des blancs)
- Léger contraste/netteté
- Compression JPEG qualité 85%

## 📊 Impact SEO

Les images de galerie améliorent :
- ✅ Temps passé sur page (+30% estimé)
- ✅ Taux de conversion (+15-20%)
- ✅ Trust signals (photos réelles vs rendus 3D)
- ✅ Partages sociaux (Pinterest, Instagram)

## 🔍 Alt texts SEO

Les alt texts sont générés automatiquement par `ImageCarousel.tsx` :
- Image 1 : "Store banne {nom} - Vue d'ensemble coffre et toile déployée"
- Image 2 : "{nom} - Détail du mécanisme et bras articulés"
- Image 3 : "Installation {nom} - Vue de côté avec projection maximale"
- Image 4 : "Store {nom} - Finitions et coloris disponibles"

---

**Status actuel** : ✅ Carrousels fonctionnels avec images placeholder  
**Prochaine étape** : Remplacer par photos réelles produits
