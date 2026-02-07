# 🤖 Assistant IA Storal - Guide de Configuration

## 📋 Vue d'ensemble

L'Assistant IA Storal est un chatbot intelligent qui aide les clients à choisir leur store banne idéal. Il utilise l'API OpenAI (GPT-4o) et connaît tout votre catalogue de produits.

## 🚀 Installation

### 1. Packages installés

```bash
npm install openai ai
```

✅ Déjà fait !

### 2. Configuration de la clé API OpenAI

1. **Obtenez votre clé API** sur [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Modifiez le fichier `.env.local`** :

```env
OPENAI_API_KEY=sk-votre-vraie-cle-ici
```

⚠️ **Important** : Ne commitez JAMAIS ce fichier sur Git !

### 3. Redémarrez le serveur Next.js

```bash
npm run dev
```

## 📂 Structure des fichiers

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # 🔥 Route API principale
│   └── assistant/
│       └── page.tsx               # 🎨 Page de démo
├── components/
│   └── ChatAssistant.tsx          # 💬 Composant chat
└── data/
    └── storeData.js               # 📊 Données produits
```

## 🎯 Fonctionnalités

### Ce que l'assistant peut faire :

✅ **Conseiller un modèle** selon la taille de terrasse  
✅ **Comparer Kissimy vs Heliom** (style, prix, dimensions)  
✅ **Donner une estimation de prix** (avec redirection vers le configurateur)  
✅ **Expliquer les options** (LED, couleurs, installation)  
✅ **Recommander la pose pro** (TVA réduite à 10%)  

### Ce qu'il ne fait PAS :

❌ Prix exact au centime (→ redirige vers le configurateur)  
❌ Questions SAV/juridiques (→ redirige vers le service client)  
❌ Commande directe (→ redirige vers le panier)  

## 🧪 Tester l'assistant

### En local

1. Démarrez le serveur : `npm run dev`
2. Accédez à : **http://localhost:3000/assistant**
3. Posez une question, exemple :
   - "Quel store pour une terrasse de 4m × 3m ?"
   - "Quelle est la différence entre Kissimy et Heliom ?"
   - "Combien coûte un store de 5 mètres ?"

### En production

L'API sera accessible à : `https://storal.fr/api/chat`

## 🎨 Intégrer l'assistant ailleurs

### Dans le configurateur

Ajoutez dans `app/configurateur/page.tsx` :

```tsx
import ChatAssistant from '@/components/ChatAssistant';

// Dans votre JSX :
<div className="grid grid-cols-2 gap-6">
  <div>
    {/* Votre configurateur */}
  </div>
  <div>
    <ChatAssistant />
  </div>
</div>
```

### Dans un modal/popup

```tsx
import { useState } from 'react';
import ChatAssistant from '@/components/ChatAssistant';

function Page() {
  const [showChat, setShowChat] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowChat(true)}>
        💬 Aide
      </button>
      
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full">
            <ChatAssistant />
            <button onClick={() => setShowChat(false)}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}
```

## 💰 Coûts OpenAI

### Modèle GPT-4o (recommandé)

- **Input** : ~$5 / 1M tokens
- **Output** : ~$15 / 1M tokens
- **Estimation** : ~100 conversations = $1-2

### Modèle GPT-3.5-turbo (économique)

- **Input** : ~$0.50 / 1M tokens
- **Output** : ~$1.50 / 1M tokens
- **Estimation** : ~100 conversations = $0.10-0.30

Pour changer le modèle, modifiez `route.ts` :

```ts
model: 'gpt-3.5-turbo', // Au lieu de 'gpt-4o'
```

## 🔧 Personnalisation

### Modifier la persona

Éditez la fonction `generateSystemPrompt()` dans `app/api/chat/route.ts` :

```ts
return `Tu es **Nom de votre expert**, un conseiller spécialisé...`;
```

### Ajouter des connaissances

L'assistant connaît automatiquement :
- `STORES_DATA` (modèles, prix, options)
- `FRAME_COLORS` (couleurs d'armature)
- `FABRICS` (toiles disponibles)

Ces données sont injectées dynamiquement depuis `data/storeData.js`.

### Limiter la longueur des réponses

Dans `route.ts` :

```ts
max_tokens: 500, // Au lieu de 1000 (réponses plus courtes)
```

### Changer la créativité

```ts
temperature: 0.5, // 0 = strict, 1 = créatif (défaut: 0.7)
```

## 🐛 Debugging

### Erreur : "OPENAI_API_KEY is not defined"

→ Vérifiez que `.env.local` contient la clé  
→ Redémarrez le serveur (`npm run dev`)

### Erreur : "Incorrect API key"

→ Vérifiez la clé sur [platform.openai.com/api-keys](https://platform.openai.com/api-keys)  
→ La clé doit commencer par `sk-`

### L'assistant ne connaît pas mes produits

→ Vérifiez que `STORES_DATA` est bien exporté dans `data/storeData.js`  
→ Vérifiez l'import dans `route.ts`

### Les messages ne s'affichent pas

→ Ouvrez la console navigateur (F12)  
→ Vérifiez les erreurs réseau dans l'onglet Network

## 📊 Monitoring

Pour suivre l'utilisation de l'API :

1. Accédez à [platform.openai.com/usage](https://platform.openai.com/usage)
2. Consultez les tokens consommés
3. Définissez des limites de dépenses

## 🔒 Sécurité

✅ La clé API est côté serveur (jamais exposée au client)  
✅ Le fichier `.env.local` est dans `.gitignore`  
✅ Pas de données sensibles dans le prompt  

⚠️ **À faire** :
- Limiter le nombre de requêtes par IP (rate limiting)
- Ajouter un système de captcha anti-spam
- Logger les conversations pour analyse

## 📝 Support

Pour toute question :
- Documentation OpenAI : [platform.openai.com/docs](https://platform.openai.com/docs)
- Vercel AI SDK : [sdk.vercel.ai](https://sdk.vercel.ai)
- Support Storal : support@storal.fr

---

**Fait avec ❤️ pour Storal**
