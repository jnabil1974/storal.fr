# 🛒 Panier - Quick Reference Card

## ⚡ Actions Immédiates

### 1️⃣ Exécuter Supabase Migration (5 min)
```bash
Fichier: supabase-cart-migration.sql
Destination: Supabase SQL Editor
Action: Copy → Paste → Run
```

### 2️⃣ Vérifier le Dev Server
```bash
cd /Applications/MAMP/htdocs/store_menuiserie
npm run dev
# Accéder à http://localhost:3000
```

---

## 🧪 Test Workflow

### Ajouter un article
```
1. http://localhost:3000
2. Cliquer "Configurer" (Store Banne ou Porte Blindée)
3. Personnaliser les options
4. Cliquer "Ajouter au panier"
5. ✅ Badge header montre "1"
6. ✅ Voir "Article ajouté ✓"
```

### Voir le panier
```
1. Cliquer "Panier" dans header
2. ✅ Voir article avec config complète
3. ✅ Voir prix unitaire et total
4. ✅ Modifier quantité (+/-)
5. ✅ Supprimer article (X)
```

### Vérifier persistance (après Supabase)
```
1. Ajouter article
2. F5 (actualiser)
3. ✅ Panier toujours là
```

---

## 📁 Fichiers Clés

### Frontend
```
src/contexts/CartContext.tsx      → État global du panier
src/components/Header.tsx          → Nav avec badge
src/app/cart/page.tsx              → Page panier complète
src/app/api/cart/route.ts          → API panier
```

### Types
```
src/types/cart.ts                  → CartItem, CartState, AddToCartPayload
src/types/products.ts              → ProductType, StoreBanneConfig, etc.
```

### Configuration
```
.env.local                         → Supabase credentials
supabase-cart-migration.sql        → Migration à exécuter
```

---

## 🔌 API Endpoints

### GET - Récupérer le panier
```bash
curl "http://localhost:3000/api/cart?sessionId=YOUR_ID"
```
**Réponse:**
```json
{
  "items": [...],
  "totalItems": 1,
  "totalPrice": 385.50
}
```

### POST - Ajouter un article
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "...",
    "productId": "...",
    "productType": "store-banne",
    "productName": "Store Banne Standard",
    "basePrice": 350,
    "configuration": {...},
    "quantity": 1,
    "pricePerUnit": 385.50
  }'
```

### PUT - Modifier quantité
```bash
curl -X PUT http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "...",
    "quantity": 2,
    "sessionId": "..."
  }'
```

### DELETE - Supprimer article
```bash
curl -X DELETE http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "...",  # ou omis pour tout supprimer
    "sessionId": "..."
  }'
```

---

## 🛠️ Commandes Utiles

### Build & Vérifier
```bash
cd /Applications/MAMP/htdocs/store_menuiserie
npm run build          # Vérifier compilation
npm run dev            # Démarrer dev server
npm run lint           # Vérifier code
```

### Lancer en production
```bash
npm run build          # Build optimisé
npm start              # Serveur production
```

---

## 📌 LocalStorage

### Session ID
```javascript
localStorage.getItem('cart_session_id')
// → "550e8400-e29b-41d4-a716-446655440000"
```

### Effacer cache
```javascript
localStorage.removeItem('cart_session_id')
// Génère un nouveau UUID à la prochaine visite
```

---

## 🔍 Debug Console

### Vérifier session ID
```javascript
console.log(localStorage.getItem('cart_session_id'))
```

### Forcer rechargement du panier
```javascript
const { addItem, removeItem, updateQuantity } = useCart()
// Dans la console Dev Tools
fetch('/api/cart?sessionId=' + localStorage.getItem('cart_session_id'))
  .then(r => r.json())
  .then(console.log)
```

---

## 🚨 Erreurs Courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Cannot read 'addItem'" | `useCart()` hors `<CartProvider>` | Vérifier layout.tsx a CartProvider |
| Panier vide au reload | Supabase pas migré | Exécuter migration SQL |
| `sessionId undefined` | localStorage missing | F12 → Console → Clear Storage |
| API 404 | Dev server stoppé | `npm run dev` |
| Badge ne s'update pas | Cache React | Hard refresh: Cmd+Shift+R |

---

## ✅ Checklist Final

- [ ] Exécuté `supabase-cart-migration.sql` dans Supabase
- [ ] `npm run dev` en cours
- [ ] Panier accessible: http://localhost:3000/cart
- [ ] Badge affiche compteur d'articles
- [ ] Ajouter/Modifier/Supprimer fonctionne
- [ ] Configurer bouton → addItem working
- [ ] Panier persiste au reload

---

## 📞 Support Rapide

### Panier ne sauvegarde pas
→ Vérifier Supabase: Table `cart_items` créée?

### Badge ne s'affiche pas
→ DevTools F12 → Console → Erreurs?

### Config pas complète
→ Vérifier localStorage → configuration JSON valide?

### Prix incorrect
→ Vérifier `pricing.ts` → calcul correct?

---

**État: ✅ PRÊT POUR CHECKOUT**

Prochaine étape → Intégration Stripe/PayPal pour paiement 💳
