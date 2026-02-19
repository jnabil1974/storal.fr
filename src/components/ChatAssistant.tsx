'use client';

import { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { STORE_MODELS, type StoreModel, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';
import { calculateInstallationCostWithZone } from '@/lib/intervention-zones';
import VisualShowroom from './VisualShowroom';
import { useShowroom } from '@/contexts/ShowroomContext';
import type { ProductType } from '@/types/products';
import { useCart } from '@/contexts/CartContext';

// --- Composant Typewriter Text ---
const TypewriterText = ({ text, isWelcomeMessage }: { text: string; isWelcomeMessage: boolean }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!isWelcomeMessage) {
      setDisplayedText(text);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20); // 20ms par caractère = animation fluide

    return () => clearInterval(interval);
  }, [text, isWelcomeMessage]);

  // Parser le texte pour extraire les **gras**
  const parseText = (str: string) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-blue-700">{part.slice(2, -2)}</strong>;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return <span className="whitespace-pre-wrap text-sm leading-relaxed">{parseText(displayedText)}</span>;
};

// --- Composant Barre de Progression ---
const LoadingProgressBar = ({ message }: { message: string }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95; // Reste à 95% jusqu'au chargement réel
        return prev + Math.random() * 15; // Progression aléatoire
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start p-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl px-6 py-4 max-w-[80%] border border-blue-200 shadow-md">
        <div className="flex items-center space-x-3 mb-3">
          <div className="animate-spin h-5 w-5 border-3 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-sm font-semibold text-gray-900">{message}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-right">{Math.round(progress)}% chargé</p>
      </div>
    </div>
  );
};

// --- Types ---
interface CustomToolCall {
  toolCallId: string;
  toolName: string;
  input: any;
}

interface Cart {
  modelId: string | null;
  modelName?: string;
  colorId: string | null;
  fabricId: string | null;
  width?: number | null;
  projection?: number | null;
  exposure?: string | null;
  withMotor?: boolean;
  priceEco?: number;
  priceStandard?: number;
  pricePremium?: number;
  selectedPrice?: number;
  priceType?: string;
  // Détails des options et prix
  storeHT?: number;
  ledArmsPrice?: number;
  ledBoxPrice?: number;
  lambrequinPrice?: number;
  awningPrice?: number;
  sousCoffrePrice?: number;
  poseHT?: number;
  tvaAmount?: number;
  // Informations terrasse et environnement
  terraceLength?: number | null; // Longueur terrasse en cm
  terraceWidth?: number | null; // Largeur terrasse en cm
  environment?: string | null; // Environnement (bord de mer, ville, etc.)
  orientation?: string | null; // Nord, Sud, Est, Ouest
  installHeight?: number | null; // Hauteur de pose en m
  cableExit?: string | null; // Sortie de câble (Gauche/Droite)
  ledArms?: boolean; // LED bras
  ledBox?: boolean; // LED coffre
  obstacles?: string | null; // Obstacles éventuels
  codePostal?: string | null; // Code postal pour calcul frais de pose
  fraisDeplacement?: number; // Frais de déplacement calculés
}

interface ChatAssistantProps {
  modelToConfig?: string | null;
  cart: Cart | null;
  setCart: Dispatch<SetStateAction<Cart | null>>;
  initialMessage?: string | null;
  initialModelId?: string | null;
}

const ProductModal = ({ model, onClose }: { model: StoreModel | null; onClose: () => void }) => {
  if (!model) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="p-4 border-b flex justify-between items-center"><h2 className="text-2xl font-bold">{model.name}</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-3xl">&times;</button></header>
        <div className="overflow-y-auto p-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="relative w-full h-80 rounded-lg overflow-hidden"><Image src={`/images/models/${model.id.toUpperCase()}.png`} alt={model.name} fill className="object-cover" /></div><div><h3 className="text-xl font-semibold mb-3">Détails Techniques</h3><ul className="space-y-2 text-gray-700">{model.features.map((feature, idx) => (<li key={idx} className="flex items-start"><span className="text-blue-600 mr-2 font-bold">✓</span>{feature}</li>))}<li><span className="text-blue-600 mr-2 font-bold">✓</span>Armature en aluminium extrudé</li><li><span className="text-blue-600 mr-2 font-bold">✓</span>Visserie d'assemblage en inox</li><li><span className="text-blue-600 mr-2 font-bold">✓</span>Garantie structure : 12 ans</li></ul></div></div></div>
        <footer className="p-4 bg-gray-50 border-t rounded-b-2xl text-right"><button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Fermer</button></footer>
      </div>
    </div>
  );
};

export default function ChatAssistant({ modelToConfig, cart, setCart, initialMessage, initialModelId }: ChatAssistantProps) {
  const [input, setInput] = useState('');
  const router = useRouter();
  const { setShowroomState } = useShowroom();
  const { addItem, isLoading: isCartLoading } = useCart();
  
  // ChatID persistant pour conserver l'historique
  const [chatId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('storal-chat-id');
      if (!id) {
        id = `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        localStorage.setItem('storal-chat-id', id);
      }
      console.log('🆔 Chat ID utilisé:', id);
      return id;
    }
    return `chat-${Date.now()}`;
  });
  
  const [activeTool, setActiveTool] = useState<CustomToolCall | null>(null);
  const [toolHistory, setToolHistory] = useState<CustomToolCall[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);
  const [selectedFabricCategory, setSelectedFabricCategory] = useState<string>('ORCH_UNI');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModelForModal, setSelectedModelForModal] = useState<StoreModel | null>(null);
  const [terraceState, setTerraceState] = useState({ m1: 4, m2: 3, m3: 4, m4: 3 });
  const [proposedStoreWidth, setProposedStoreWidth] = useState<number | undefined>();
  const [proposedStoreHeight, setProposedStoreHeight] = useState<number | undefined>();
  const [showVideoHint, setShowVideoHint] = useState(false);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const initialMessageSentRef = useRef(false); // Persiste entre les remontages
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [expertModeActivated, setExpertModeActivated] = useState(false);
  const [tripleOfferTimeoutId, setTripleOfferTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [tripleOfferDisplayed, setTripleOfferDisplayed] = useState(false);
  const [persistedSingleOfferCalc, setPersistedSingleOfferCalc] = useState<any>(null); // Persiste l'offre unique même après fermeture de l'outil
  const [persistedAvecPose, setPersistedAvecPose] = useState<boolean>(false); // Persiste avec_pose
  const [honeypot, setHoneypot] = useState(''); // 🍯 Honeypot anti-bot
  const [waitingForResponse, setWaitingForResponse] = useState(false); // Attente après validation d'un outil

  // Synchroniser les états depuis le cart au montage ET quand cart change
  useEffect(() => {
    console.log('🔄 [ChatAssistant] Synchronisation depuis cart:', {
      hasCart: !!cart,
      cartModelId: cart?.modelId,
      cartColorId: cart?.colorId,
      cartFabricId: cart?.fabricId,
      currentSelectedModelId: selectedModelId
    });
    
    if (cart) {
      if (cart.modelId && !selectedModelId) {
        setSelectedModelId(cart.modelId);
        // 🔥 Synchroniser avec ShowroomContext pour que DashboardBento affiche le bon modèle
        setShowroomState((prev: any) => ({
          ...prev,
          selectedModelId: cart.modelId
        }));
      }
      if (cart.colorId && !selectedColorId) {
        console.log('✅ Restauration colorId depuis cart:', cart.colorId);
        setSelectedColorId(cart.colorId);
        // 🔥 Synchroniser avec ShowroomContext
        setShowroomState((prev: any) => ({
          ...prev,
          selectedColorId: cart.colorId
        }));
      }
      if (cart.fabricId && !selectedFabricId) {
        console.log('✅ Restauration fabricId depuis cart:', cart.fabricId);
        setSelectedFabricId(cart.fabricId);
        // 🔥 Synchroniser avec ShowroomContext
        setShowroomState((prev: any) => ({
          ...prev,
          selectedFabricId: cart.fabricId
        }));
      }
    }
  }, [cart, selectedModelId, selectedColorId, selectedFabricId, setShowroomState]); // 🔥 Ajouter cart dans les dépendances

  // 🔄 Synchronisation CONTINUE entre états locaux et ShowroomContext
  // Garantit que DashboardBento affiche toujours les bonnes sélections
  useEffect(() => {
    console.log('🔄 [ChatAssistant] Synchronisation ShowroomContext déclenchée:', JSON.stringify({
      selectedModelId,
      selectedColorId,
      selectedFabricId,
      timestamp: new Date().toLocaleTimeString()
    }, null, 2));
    setShowroomState((prev: any) => {
      const newState = {
        ...prev,
        selectedModelId,
        selectedColorId,
        selectedFabricId
      };
      console.log('🔄 [ChatAssistant] Nouveau state envoyé au contexte:', JSON.stringify({
        selectedModelId: newState.selectedModelId,
        selectedColorId: newState.selectedColorId,
        selectedFabricId: newState.selectedFabricId
      }, null, 2));
      return newState;
    });
  }, [selectedModelId, selectedColorId, selectedFabricId, setShowroomState]);

  // 🔥 Réinitialiser la catégorie de toile si elle devient indisponible après filtrage
  useEffect(() => {
    if (selectedModelId) {
      const model = STORE_MODELS[selectedModelId];
      if (model?.compatible_toile_types) {
        const compatibleTypes = model.compatible_toile_types;
        let allowedToileTypeCodes: string[] = [];
        
        compatibleTypes.forEach((type) => {
          if (type === 'ORCH') {
            allowedToileTypeCodes.push('ORCH_UNI', 'ORCH_DECOR');
          } else if (type === 'ORCH_MAX') {
            allowedToileTypeCodes.push('ORCH_UNI', 'ORCH_DECOR', 'ORCH_MAX');
          } else if (type === 'SATT') {
            allowedToileTypeCodes.push('SATT');
          }
        });
        
        // Si la catégorie actuelle n'est plus disponible, basculer sur la première disponible
        if (!allowedToileTypeCodes.includes(selectedFabricCategory)) {
          setSelectedFabricCategory(allowedToileTypeCodes[0] || 'ORCH_UNI');
        }
      }
    }
  }, [selectedModelId, selectedFabricCategory]);

  // Fonction pour sauvegarder dans localStorage
  const saveToCart = (updates: Partial<Cart>) => {
    const newCart = { ...(cart || {}), ...updates } as Cart;
    setCart(newCart);
    localStorage.setItem('storal-cart', JSON.stringify(newCart));
  };

  // 🛒 Fonction pour ajouter au panier Supabase via API
  const handleAddToCart = useCallback(async () => {
    console.log('🔵 handleAddToCart appelée');
    
    if (!cart) {
      alert('⚠️ Veuillez configurer un store avant d\'ajouter au panier');
      return;
    }

    try {
      const modelData = Object.values(STORE_MODELS).find(m => m.id === cart.modelId);
      if (!modelData) {
        alert('⚠️ Modèle non trouvé');
        return;
      }
      
      const payload = {
        productId: cart.modelId || 'unknown',
        productType: 'store_banne' as ProductType,
        productName: cart.modelName || modelData.name,
        basePrice: cart.storeHT || 0,
        configuration: {
          modelId: cart.modelId || '',  // 🔑 Sauvegarder l'ID original pour retrouver le modèle
          width: cart.width || 0,
          depth: cart.projection || 0,
          motorized: cart.withMotor || false,
          fabric: 'acrylique' as const,
          fabricColor: cart.fabricId || '',
          frameColor: (cart.colorId || 'blanc') as 'blanc' | 'gris' | 'noir' | 'bronze' | 'inox',
          armType: 'coffre' as const,
          windSensor: false,
          rainSensor: false,
          // Informations terrasse et environnement
          terraceLength: cart.terraceLength,
          terraceWidth: cart.terraceWidth,
          environment: cart.environment,
          orientation: cart.orientation,
          installHeight: cart.installHeight,
          cableExit: cart.cableExit,
          obstacles: cart.obstacles,
          ledArms: cart.ledArms,
          ledBox: cart.ledBox,
        },
        quantity: 1,
        pricePerUnit: cart.selectedPrice || cart.priceStandard || cart.storeHT || 0,
      };

      console.log('🛒 Ajout au panier:', payload);
      const addedItem = await addItem(payload);
      console.log('✅ Article ajouté:', addedItem);
      
      // Redirection vers la page panier
      console.log('🔀 Redirection vers /cart...');
      router.push('/cart');
      console.log('✅ Commande de redirection exécutée');
    } catch (error) {
      console.error('❌ Erreur ajout panier:', error);
      alert('❌ Erreur lors de l\'ajout au panier. Vérifiez la console pour plus de détails.');
    }
  }, [cart, addItem, router]);

  // 🔥 Calcul dynamique de la pose selon la largeur et la zone géographique
  const calculateInstallationCost = (widthCm: number, codePostal?: string | null): number => {
    // Si code postal disponible, utiliser le calcul par zone
    if (codePostal && codePostal.length === 5) {
      const result = calculateInstallationCostWithZone(widthCm, codePostal);
      // Stocker les frais de déplacement dans le cart pour affichage
      if (cart) {
        setCart(prev => ({ ...prev!, fraisDeplacement: result.fraisDeplacement }));
      }
      return result.total; // Retourne pose base + frais déplacement
    }
    
    // Fallback : calcul standard sans frais de déplacement
    if (widthCm <= 6000) {
      return 500;  // 500€ HT forfait jusqu'à 6m
    } else {
      const surpassCm = widthCm - 6000;
      const surpassMeters = surpassCm / 1000;
      return 500 + (Math.ceil(surpassMeters) * 100);  // 500€ + 100€/m supplémentaire
    }
  };

  // 🔥 Sauvegarder automatiquement la configuration quand l'outil change
  useEffect(() => {
    // 🚀 Gérer la redirection vers le formulaire de contact pré-rempli
    if (activeTool?.toolName === 'redirect_to_contact') {
      const input = (activeTool.input as Record<string, unknown>) || {};
      const largeur = input.largeur as string || '';
      const avancee = input.avancee as string || '';
      const reason = input.reason as string || '';
      
      const preFilledMessage = `Demande de configuration technique avancée via Agent Storal

Projet : Store banne avec grande avancée

📐 Dimensions souhaitées :
- Largeur : ${largeur}m
- Avancée : ${avancee}m

Raison de la demande : ${reason}

Je souhaite être contacté par votre bureau d'études pour valider la faisabilité technique de ce projet et obtenir un devis personnalisé.`;

      const contactUrl = `/contact?subject=${encodeURIComponent('Configuration technique avancée')}&title=${encodeURIComponent('Projet store banne > 4m avancée')}&message=${encodeURIComponent(preFilledMessage)}`;
      
      // Rediriger après un court délai pour que l'utilisateur voie le message
      setTimeout(() => {
        window.location.href = contactUrl;
      }, 2000);
      
      return; // Sortir de useEffect
    }
    
    if (activeTool?.toolName === 'open_model_selector') {
      const input = (activeTool.input as Record<string, unknown>) || {};
      const width = input.width as number || null;
      const depth = input.depth as number || null;
      const frameColor = input.frame_color as string || null;
      const fabricColor = input.fabric_color as string || null;
      const exposure = input.exposure as string || null;
      const withMotor = input.with_motor !== undefined ? input.with_motor as boolean : true;
      
      if (width || depth || frameColor || fabricColor || exposure) {
        saveToCart({ 
          width, 
          projection: depth,
          colorId: frameColor,
          fabricId: fabricColor,
          exposure,
          withMotor
        });
      }
    }
    
    if (activeTool?.toolName === 'display_triple_offer') {
      const input = activeTool.input as any;
      const { 
        eco_price_ht, standard_price_ht, premium_price_ht,
        // Prix détaillés des options
        led_arms_price_ht = 0, 
        led_box_price_ht = 0, 
        lambrequin_price_ht = 0,
        awning_price_ht = 0,
        sous_coffre_price_ht = 0,
        // Support old parameter names for backward compatibility
        standard, confort, premium,
        selected_model, width, depth, frame_color, fabric_color, exposure, with_motor,
        taux_tva = 20, montant_pose_ht = 0, avec_pose = false
      } = input;
      
      // Use new HT prices or fall back to old prices
      const ecoHT = eco_price_ht || standard || 0;
      const standardHT = standard_price_ht || confort || 0;
      const premiumHT = premium_price_ht || premium || 0;
      
      // ✅ Fix: Utiliser cart.fabricId au lieu de fabric_color de l'IA
      const actualFabricId = cart.fabricId || fabric_color;
      
      // Calculate installation cost with zone
      const poseActuelle = width && avec_pose ? calculateInstallationCost(width, cart.codePostal) : 0;
      
      // Calculate TTC prices
      const calculateTTC = (priceHT: number) => {
        const storeWithPose = avec_pose ? priceHT + poseActuelle : priceHT;
        const tvaMontant = Math.round(storeWithPose * (taux_tva / 100));
        const priceTTC = Math.round(storeWithPose + tvaMontant);
        return { ttc: priceTTC, tva: tvaMontant };
      };
      
      const ecoCalc = calculateTTC(ecoHT);
      const standardCalc = calculateTTC(standardHT);
      const premiumCalc = calculateTTC(premiumHT);
      
      saveToCart({ 
        priceEco: ecoCalc.ttc, 
        priceStandard: standardCalc.ttc, 
        pricePremium: premiumCalc.ttc,
        storeHT: ecoHT, // Le prix de base ECO est le store sans options
        ledArmsPrice: led_arms_price_ht,
        ledBoxPrice: led_box_price_ht,
        lambrequinPrice: lambrequin_price_ht,
        awningPrice: awning_price_ht,
        sousCoffrePrice: sous_coffre_price_ht,
        poseHT: poseActuelle,
        tvaAmount: standardCalc.tva, // On prend la TVA de l'offre standard par défaut
        modelId: selected_model || cart?.modelId,
        width: width || cart?.width,
        projection: depth || cart?.projection,
        colorId: frame_color || cart?.colorId,
        fabricId: actualFabricId,  // ✅ Utiliser la valeur corrigée
        exposure: exposure || cart?.exposure,
        withMotor: with_motor !== undefined ? with_motor : cart?.withMotor
      });
    }
    
    // Support pour display_single_offer (nouvelle version avec 1 seule offre)
    if (activeTool?.toolName === 'display_single_offer') {
      const input = activeTool.input as any;
      const {
        base_price_ht,
        includes_led_arms = false, led_arms_price_ht = 0,
        includes_led_box = false, led_box_price_ht = 0,
        includes_lambrequin = false, lambrequin_price_ht = 0,
        includes_awning = false, awning_price_ht = 0,
        includes_sous_coffre = false, sous_coffre_price_ht = 0,
        selected_model, model_name, width, depth, frame_color, frame_color_name, fabric_color, fabric_name, exposure, with_motor,
        taux_tva = 20, montant_pose_ht = 0, avec_pose = false,
        // Informations terrasse et environnement
        terrace_length,
        terrace_width,
        environment,
        orientation,
        install_height,
        cable_exit,
        obstacles,
        code_postal  // Code postal pour frais de déplacement
      } = input;
      
      // ✅ Fix: Utiliser cart.fabricId au lieu de fabric_color de l'IA
      const actualFabricId = cart.fabricId || fabric_color;
      
      // Calculer le total des options choisies
      const totalOptionsHT =
        (includes_led_arms ? led_arms_price_ht : 0) +
        (includes_led_box ? led_box_price_ht : 0) +
        (includes_lambrequin ? lambrequin_price_ht : 0) +
        (includes_awning ? awning_price_ht : 0) +
        (includes_sous_coffre ? sous_coffre_price_ht : 0);
      
      const storeHT = base_price_ht + totalOptionsHT;
      const poseHT = avec_pose ? montant_pose_ht : 0;
      const totalHT = storeHT + poseHT;
      const tvaAmount = Math.round(totalHT * (taux_tva / 100));
      const totalTTC = Math.round(totalHT + tvaAmount);
      
      // Persister le calcul de l'offre unique pour affichage dans les tuiles
      setPersistedSingleOfferCalc({
        basePrice: base_price_ht,
        optionsPrice: totalOptionsHT,
        storeHT,
        poseHT,
        totalHT,
        tva: tvaAmount,
        totalTTC,
        options: {
          ledArms: includes_led_arms ? led_arms_price_ht : 0,
          ledBox: includes_led_box ? led_box_price_ht : 0,
          lambrequin: includes_lambrequin ? lambrequin_price_ht : 0,
          awning: includes_awning ? awning_price_ht : 0,
          sousCoffre: includes_sous_coffre ? sous_coffre_price_ht : 0
        }
      });
      
      // Persister avec_pose pour affichage des tuiles
      setPersistedAvecPose(avec_pose);
      
      saveToCart({
        selectedPrice: totalTTC,
        priceType: 'custom',
        storeHT: base_price_ht,
        ledArmsPrice: includes_led_arms ? led_arms_price_ht : 0,
        ledBoxPrice: includes_led_box ? led_box_price_ht : 0,
        lambrequinPrice: includes_lambrequin ? lambrequin_price_ht : 0,
        awningPrice: includes_awning ? awning_price_ht : 0,
        sousCoffrePrice: includes_sous_coffre ? sous_coffre_price_ht : 0,
        poseHT: poseHT,
        tvaAmount: tvaAmount,
        modelId: selected_model || cart?.modelId,
        modelName: model_name || cart?.modelName,
        width: width || cart?.width,
        projection: depth || cart?.projection,
        colorId: frame_color || cart?.colorId,
        fabricId: actualFabricId,  // ✅ Utiliser la valeur corrigée
        exposure: exposure || cart?.exposure,
        withMotor: with_motor !== undefined ? with_motor : cart?.withMotor,
        // Informations terrasse et environnement
        terraceLength: terrace_length,
        terraceWidth: terrace_width,
        environment,
        orientation,
        installHeight: install_height,
        cableExit: cable_exit,
        obstacles,
        codePostal: code_postal,  // Code postal pour zone d'intervention
        ledArms: includes_led_arms,
        ledBox: includes_led_box,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool]);

  // 🔌 Exposer les états au ShowroomContext pour affichage externe
  useEffect(() => {
    const calculateEcoOffer = (input: any) => {
      const { eco_price_ht = 0, taux_tva = 20 } = input;
      return { totalHT: eco_price_ht, tva: (eco_price_ht * taux_tva) / 100, totalTTC: eco_price_ht * (1 + taux_tva / 100) };
    };
    
    const calculateStandardOffer = (input: any) => {
      const { standard_price_ht = 0, taux_tva = 20 } = input;
      return { totalHT: standard_price_ht, tva: (standard_price_ht * taux_tva) / 100, totalTTC: standard_price_ht * (1 + taux_tva / 100) };
    };
    
    const calculatePremiumOffer = (input: any) => {
      const { premium_price_ht = 0, taux_tva = 20 } = input;
      return { totalHT: premium_price_ht, tva: (premium_price_ht * taux_tva) / 100, totalTTC: premium_price_ht * (1 + taux_tva / 100) };
    };
    
    const calculateSingleOffer = (input: any) => {
      const {
        base_price_ht = 0,
        includes_led_arms = false, led_arms_price_ht = 0,
        includes_led_box = false, led_box_price_ht = 0,
        includes_lambrequin = false, lambrequin_price_ht = 0,
        includes_awning = false, awning_price_ht = 0,
        includes_sous_coffre = false, sous_coffre_price_ht = 0,
        taux_tva = 20,
        montant_pose_ht = 0,
        avec_pose = false
      } = input;
      
      const totalOptionsHT =
        (includes_led_arms ? led_arms_price_ht : 0) +
        (includes_led_box ? led_box_price_ht : 0) +
        (includes_lambrequin ? lambrequin_price_ht : 0) +
        (includes_awning ? awning_price_ht : 0) +
        (includes_sous_coffre ? sous_coffre_price_ht : 0);
      
      const storeHT = base_price_ht + totalOptionsHT;
      const poseHT = avec_pose ? montant_pose_ht : 0;
      const totalHT = storeHT + poseHT;
      const tvaAmount = Number(((totalHT * taux_tva) / 100).toFixed(2));
      const totalTTC = Number((totalHT + tvaAmount).toFixed(2));
      
      return {
        basePrice: base_price_ht,
        optionsPrice: totalOptionsHT,
        storeHT,
        poseHT,
        totalHT,
        tva: tvaAmount,
        totalTTC,
        options: {
          ledArms: includes_led_arms ? led_arms_price_ht : 0,
          ledBox: includes_led_box ? led_box_price_ht : 0,
          lambrequin: includes_lambrequin ? lambrequin_price_ht : 0,
          awning: includes_awning ? awning_price_ht : 0,
          sousCoffre: includes_sous_coffre ? sous_coffre_price_ht : 0
        }
      };
    };

    setShowroomState({
      activeTool,
      selectedColorId,
      selectedFabricId,
      selectedModelId,
      proposedStoreWidth,
      proposedStoreHeight,
      hasStartedConversation: !!activeTool || !!selectedModelId,
      showVideoHint,
      ecoCalc: activeTool?.toolName === 'display_triple_offer' ? calculateEcoOffer(activeTool.input) : undefined,
      standardCalc: activeTool?.toolName === 'display_triple_offer' ? calculateStandardOffer(activeTool.input) : undefined,
      premiumCalc: activeTool?.toolName === 'display_triple_offer' ? calculatePremiumOffer(activeTool.input) : undefined,
      singleOfferCalc: persistedSingleOfferCalc || (activeTool?.toolName === 'display_single_offer' ? calculateSingleOffer(activeTool.input) : undefined),
      avec_pose: persistedAvecPose || ((activeTool?.toolName === 'display_triple_offer' || activeTool?.toolName === 'display_single_offer') ? (activeTool.input as any)?.avec_pose : false),
      // Callbacks
      onSelectColor: (colorId, colorName) => {
        setSelectedColorId(colorId);
        saveToCart({ colorId });
        // 🔥 Synchroniser avec ShowroomContext pour DashboardBento
        setShowroomState((prev: any) => ({
          ...prev,
          selectedColorId: colorId
        }));
        if (activeTool?.toolName === 'open_color_selector') {
          setWaitingForResponse(true); // Démarrer l'attente
          addToolResult({ toolCallId: activeTool.toolCallId, result: { frame_color_id: colorId, frame_color_name: colorName, validated: true } } as any);
          sendMessage({ text: `J'ai choisi l'armature ${colorName}` });
        }
      },
      onSelectFabric: (fabricId, fabricName) => {
        setSelectedFabricId(fabricId);
        saveToCart({ fabricId });
        // 🔥 Synchroniser avec ShowroomContext pour DashboardBento
        setShowroomState((prev: any) => ({
          ...prev,
          selectedFabricId: fabricId
        }));
        if (activeTool?.toolName === 'open_fabric_selector') {
          setWaitingForResponse(true); // Démarrer l'attente
          addToolResult({ toolCallId: activeTool.toolCallId, result: { fabric_id: fabricId, fabric_name: fabricName, validated: true } } as any);
          sendMessage({ text: `J'ai choisi la toile ${fabricName}` });
        }
      },
      onSelectModel: (modelId, modelName) => {
        setSelectedModelId(modelId);
        saveToCart({ modelId, modelName });
        // 🔥 Synchroniser avec ShowroomContext pour DashboardBento
        setShowroomState((prev: any) => ({
          ...prev,
          selectedModelId: modelId
        }));
        if (activeTool?.toolName === 'open_model_selector') {
          setWaitingForResponse(true); // Démarrer l'attente
          addToolResult({ toolCallId: activeTool.toolCallId, result: { model_id: modelId, model_name: modelName, validated: true } } as any);
          sendMessage({ text: `Je veux configurer le ${modelName}` });
        }
      },
      onSelectEco: (priceHT) => {
        saveToCart({ priceEco: priceHT, selectedPrice: priceHT, priceType: 'eco' });
        if (activeTool?.toolName === 'display_triple_offer') {
          setWaitingForResponse(true); // Démarrer l'attente
          addToolResult({ toolCallId: activeTool.toolCallId, result: { offer_selected: 'eco', price_ttc: priceHT, validated: true } } as any);
          sendMessage({ text: `Je sélectionne l'offre Eco à ${priceHT}€ TTC` });
          // Ajouter au panier puis rediriger
          setTimeout(() => handleAddToCart(), 500);
        }
      },
      onSelectStandard: (priceHT) => {
        saveToCart({ priceStandard: priceHT, selectedPrice: priceHT, priceType: 'standard' });
        if (activeTool?.toolName === 'display_triple_offer') {
          setWaitingForResponse(true); // Démarrer l'attente
          addToolResult({ toolCallId: activeTool.toolCallId, result: { offer_selected: 'standard', price_ttc: priceHT, validated: true } } as any);
          sendMessage({ text: `Je sélectionne l'offre Standard à ${priceHT}€ TTC` });
          // Ajouter au panier puis rediriger
          setTimeout(() => handleAddToCart(), 500);
        }
      },
      onSelectPremium: (priceHT) => {
        saveToCart({ pricePremium: priceHT, selectedPrice: priceHT, priceType: 'premium' });
        if (activeTool?.toolName === 'display_triple_offer') {
          setWaitingForResponse(true); // Démarrer l'attente
          addToolResult({ toolCallId: activeTool.toolCallId, result: { offer_selected: 'premium', price_ttc: priceHT, validated: true } } as any);
          sendMessage({ text: `Je sélectionne l'offre Premium à ${priceHT}€ TTC` });
          // Ajouter au panier puis rediriger
          setTimeout(() => handleAddToCart(), 500);
        }
      },
      onSelectOffer: (priceTTC) => {
        saveToCart({ selectedPrice: priceTTC, priceType: 'custom' });
        if (activeTool?.toolName === 'display_single_offer') {
          setWaitingForResponse(true); // Démarrer l'attente
          addToolResult({ toolCallId: activeTool.toolCallId, result: { offer_validated: true, price_ttc: priceTTC } } as any);
          sendMessage({ text: `Je valide cette configuration à ${priceTTC}€ TTC` });
          // Ajouter au panier puis rediriger
          setTimeout(() => handleAddToCart(), 500);
        }
      },
      onTerraceChange: (dims) => {
        setTerraceState(dims);
      },
    });
  }, [
    activeTool,
    selectedColorId,
    selectedFabricId,
    selectedModelId,
    proposedStoreWidth,
    proposedStoreHeight,
    showVideoHint,
    persistedSingleOfferCalc,
    persistedAvecPose,
    setShowroomState,
    handleAddToCart,
  ]);

  // UTILISATION NATIVE DU SDK - Méthode la plus stable avec sendMessage
  const { messages, sendMessage, status, addToolResult } = useChat({
    id: chatId,
    body: {
      honeypot: honeypot, // 🍯 Envoyer le honeypot au backend
      // 🎯 Transmettre les données du sessionStorage si elles existent
      configData: typeof window !== 'undefined' ? {
        width: sessionStorage.getItem('storal_width'),
        projection: sessionStorage.getItem('storal_projection'),
        modelId: sessionStorage.getItem('storal_modelId'),
        fabricId: sessionStorage.getItem('storal_fabricId'),
      } : null,
    },
    onToolCall: ({ toolCall }: any) => {
      console.log('🔧 Tool appelé:', toolCall);
      setActiveTool(toolCall);
      setWaitingForResponse(false); // Nouveau tool reçu, arrêter l'attente
      // 🔥 Ajouter à l'historique des outils (ne pas nettoyer l'ancien)
      setToolHistory(prev => [...prev, toolCall]);
    },
    onFinish: (data: any) => {
      console.log('✅ Réponse terminée, messages:', data.messages?.length || 0);
      setWaitingForResponse(false); // Réponse terminée, arrêter l'attente
    },
    onError: (err: any) => {
      console.error('❌ Erreur:', err);
      // Afficher un message d'erreur convivial selon le type d'erreur
      if (err.message?.includes('Session limit')) {
        alert('Vous avez atteint la limite de 50 échanges. Pour finaliser votre projet, contactez-nous au 01 85 09 34 46 ou réservez une visio gratuite.');
      } else if (err.message?.includes('Spam detected')) {
        alert('Une erreur s\'est produite. Veuillez réessayer.');
      } else if (err.message?.includes('Message too long')) {
        alert('Votre message est trop long. Merci de le raccourcir.');
      } else if (err.message?.includes('Invalid content')) {
        alert('Votre message contient des caractères non autorisés.');
      }
    },
  });
  
  const isLoading = status !== 'ready';

  // ⏰ RELANCE AUTOMATIQUE - Timer 20 secondes si offres affichées sans clic
  // ❌ DÉSACTIVÉ sur demande - Timer supprimé
  // useEffect(() => {
  //   if (activeTool?.toolName === 'display_triple_offer' && !tripleOfferDisplayed) {
  //     console.log('🎯 Offres affichées - démarrage du timer 20 secondes');
  //     setTripleOfferDisplayed(true);
  //     
  //     // Clearance du timeout précédent s'il existe
  //     if (tripleOfferTimeoutId) {
  //       clearTimeout(tripleOfferTimeoutId);
  //     }
  //     
  //     // Démarrer le timer de 20 secondes
  //     const timeoutId = setTimeout(() => {
  //       console.log('⏰ 20 secondes écoulées - Envoi du message de relance');
  //       
  //       // Envoyer automatiquement un message de relance
  //       sendMessage({ 
  //         text: "Qu'est-ce qui ne va pas avec cette configuration ? Est-ce le budget ou un détail technique ? Je peux vous proposer des solutions : optimiser le budget en changeant le type de store ou en retirant des options non essentielles, ou ajuster les dimensions et options techniques." 
  //       });
  //       
  //       // Réinitialiser pour la prochaine offre potentielle
  //       setTripleOfferDisplayed(false);
  //     }, 20000); // 20 secondes
  //     
  //     setTripleOfferTimeoutId(timeoutId);
  //   }
  //   
  //   // Cleanup function
  //   return () => {
  //     if (tripleOfferTimeoutId) {
  //       clearTimeout(tripleOfferTimeoutId);
  //     }
  //   };
  // }, [activeTool, tripleOfferDisplayed, tripleOfferTimeoutId, sendMessage]);
  
  // Debug
  useEffect(() => {
    console.log('💬 Messages client:', messages.length);
    if (messages.length > 0) {
      console.log('📤 Tous les messages:', messages);
    }
  }, [messages]);
  
  // Auto-send du message initial depuis l'URL (prioritaire)
  useEffect(() => {
    if (initialMessage && !initialMessageSentRef.current) {
      // Détection automatique de modèle dans le message initial
      detectAndSelectModel(initialMessage);
      
      sendMessage({ text: initialMessage });
      initialMessageSentRef.current = true;
      setInitialMessageSent(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  // Auto-send pour configuration d'un modèle spécifique
  useEffect(() => {
    if (modelToConfig && !initialMessageSentRef.current) {
      const message = `Je souhaite configurer le modèle ${modelToConfig}`;
      
      // Détection automatique de modèle
      detectAndSelectModel(message);
      
      sendMessage({ text: message });
      initialMessageSentRef.current = true;
      setInitialMessageSent(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelToConfig]);

  // Auto-sélection du modèle depuis l'URL (sans message, juste la sélection)
  useEffect(() => {
    if (initialModelId && !initialMessageSentRef.current) {
      const model = STORE_MODELS[initialModelId as keyof typeof STORE_MODELS];
      if (model) {
        setSelectedModelId(initialModelId);
        saveToCart({ modelId: initialModelId, modelName: model.name });
        setShowroomState((prev: any) => ({
          ...prev,
          selectedModelId: initialModelId
        }));
        
        // 🎯 NOUVEAU : Vérifier si des données du configurateur existent dans sessionStorage
        const configWidth = sessionStorage.getItem('storal_width');
        const configProjection = sessionStorage.getItem('storal_projection');
        
        if (configWidth && configProjection) {
          // Envoyer un message avec les données de configuration
          const widthM = (Number(configWidth) / 1000).toFixed(2);
          const projectionM = (Number(configProjection) / 1000).toFixed(2);
          sendMessage({ 
            text: `Je veux configurer le modèle ${model.name} avec les dimensions suivantes : ${widthM}m de large × ${projectionM}m d'avancée` 
          });
        } else {
          // Message standard sans dimensions
          sendMessage({ text: `Je veux configurer le modèle ${model.name}` });
        }
        
        initialMessageSentRef.current = true;
        setInitialMessageSent(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialModelId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    // Scroll minimal vers le new message (sans dérouler toute la page)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
  }, [messages]);

  const getMessageText = (msg: UIMessage): string => msg.parts.filter((part) => part.type === 'text').map((part) => part.text).join('');

  // Extraire les dimensions du store proposé du texte
  const extractProposedDimensions = (text: string): { width?: number; height?: number } => {
    // Pattern: "X.XXm × Y.XXm" ou "Xm x Ym" ou "largeur (X)m" "profondeur (Y)m"
    const patterns = [
      /(\d+(?:[.,]\d+)?)\s*m\s*×\s*(\d+(?:[.,]\d+)?)\s*m/i,
      /(\d+(?:[.,]\d+)?)\s*m\s*x\s*(\d+(?:[.,]\d+)?)\s*m/i,
      /Largeur.*?(\d+(?:[.,]\d+)?)\s*m.*?[Pp]rofondeur.*?(\d+(?:[.,]\d+)?)\s*m/s,
      /Profondeur.*?(\d+(?:[.,]\d+)?)\s*m.*?[Ll]argeur.*?(\d+(?:[.,]\d+)?)\s*m/s,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const width = parseFloat(match[1].replace(',', '.'));
        const height = parseFloat(match[2].replace(',', '.'));
        return { width, height };
      }
    }
    return {};
  };

  // Mettre à jour les dimensions proposées quand les messages changent
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const messageText = getMessageText(lastMessage);
      const { width, height } = extractProposedDimensions(messageText);
      if (width) setProposedStoreWidth(width);
      if (height) setProposedStoreHeight(height);
    }
  }, [messages]);

  // Détecter la confusion et afficher le hint vidéo
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const messageText = getMessageText(lastMessage).toLowerCase();
      
      // Mots-clés indiquant la confusion
      const confusionKeywords = [
        'ne comprends pas',
        'ne comprenne pas',
        'ne sais pas',
        'c\'est quoi',
        'ça signifie quoi',
        'explication',
        'clarifier',
        'comment',
        'cotes',
        'mesure',
        'm1',
        'm2',
        'm3',
        'm4',
        'dimensions'
      ];
      
      const hasConfusion = confusionKeywords.some(keyword => messageText.includes(keyword));
      
      if (hasConfusion && !showVideoHint) {
        setShowVideoHint(true);
      }
    }
  }, [messages]);

  // Détection automatique de modèle mentionné
  const detectAndSelectModel = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Chercher si un modèle est mentionné dans le texte
    for (const [modelId, model] of Object.entries(STORE_MODELS)) {
      const modelNameLower = model.name.toLowerCase();
      
      // Vérifier si le nom du modèle ou son ID est mentionné
      if (lowerText.includes(modelNameLower) || lowerText.includes(modelId)) {
        // Sélectionner automatiquement le modèle si pas déjà sélectionné
        if (selectedModelId !== modelId) {
          setSelectedModelId(modelId);
          saveToCart({ modelId, modelName: model.name });
          setShowroomState((prev: any) => ({
            ...prev,
            selectedModelId: modelId
          }));
        }
        return true;
      }
    }
    return false;
  };

  // HandleSubmit simple et robuste
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    
    console.log('🚀 Envoi:', trimmed);
    
    // Détection automatique de modèle
    detectAndSelectModel(trimmed);
    
    // Détect expert mode trigger
    if (trimmed.toLowerCase().includes('me laisser guider') || 
        trimmed.toLowerCase().includes('aide') || 
        trimmed.toLowerCase().includes('conseil')) {
      setIsExpertMode(true);
      setExpertModeActivated(true);
    }
    
    sendMessage({ text: trimmed });
    setInput('');
  };

  const handleQuickClick = (text: string) => {
    if (isLoading) return;
    console.log('⚡ Quick:', text);
    
    // Détection automatique de modèle
    detectAndSelectModel(text);
    
    // Detect expert mode trigger
    if (text.toLowerCase().includes('me laisser guider') || 
        text.toLowerCase().includes('aide') || 
        text.toLowerCase().includes('conseil')) {
      setIsExpertMode(true);
      setExpertModeActivated(true);
    }
    
    sendMessage({ text });
  };

  const renderActiveTool = () => {
    // 🔥 Afficher tous les outils de l'historique (tools passés)
    const allToolsToRender = [...toolHistory];
    if (activeTool && !toolHistory.includes(activeTool)) {
      allToolsToRender.push(activeTool);
    }
    
    if (allToolsToRender.length === 0) return null;
    
    return (
      <div className="space-y-6">
        {allToolsToRender.map((tool, idx) => {
          const isCurrent = tool === activeTool;
          
          console.log('🎨 Rendu outil:', tool.toolName, 'isCurrent:', isCurrent, 'toolCallId:', tool.toolCallId);
          
          // ⚠️ Les sélecteurs ne doivent disparaître QUE si une sélection a été faite
          const isSelector = tool.toolName === 'open_model_selector' || tool.toolName === 'open_color_selector' || tool.toolName === 'open_fabric_selector';
          
          // Ne masquer les anciens sélecteurs que s'ils ont été validés
          if (isSelector && !isCurrent) {
            const hasBeenValidated = 
              (tool.toolName === 'open_model_selector' && selectedModelId) ||
              (tool.toolName === 'open_color_selector' && selectedColorId) ||
              (tool.toolName === 'open_fabric_selector' && selectedFabricId);
            
            if (hasBeenValidated) {
              return null; // Ne pas afficher les anciens sélecteurs validés
            }
          }
          
          return (
            <div key={`${tool.toolCallId}-${idx}`} className={`transition-all ${!isCurrent ? 'opacity-70 scale-95 mb-4' : ''}`}>
              {tool.toolName === 'display_triple_offer' && renderTripleOfferTool(tool, isCurrent)}
              {tool.toolName === 'open_model_selector' && renderModelSelectorTool(tool, isCurrent)}
              {tool.toolName === 'open_color_selector' && renderColorSelectorTool(tool, isCurrent)}
              {tool.toolName === 'open_fabric_selector' && renderFabricSelectorTool(tool, isCurrent)}
            </div>
          );
        })}
      </div>
    );
  };
  
  // 🔥 Extraire display_triple_offer en fonction séparée
  const renderTripleOfferTool = (tool: CustomToolCall, isCurrent: boolean) => {
    const input = tool.input as any;
    const { 
      eco_price_ht, 
      standard_price_ht, 
      premium_price_ht, 
      selected_model, 
      width, 
      depth, 
      frame_color, 
      fabric_color,
      taux_tva = 20,
      montant_pose_ht = 0,
      avec_pose = false,
      // Informations terrasse et environnement
      terrace_length,
      terrace_width,
      environment,
      orientation,
      install_height,
      cable_exit,
      obstacles,
      includes_led_arms = false,
      includes_led_box = false,
      // Prix des options
      led_arms_price_ht = 0,
      led_box_price_ht = 0,
      lambrequin_price_ht = 0,
      awning_price_ht = 0,
      sous_coffre_price_ht = 0,
      // Backward compatibility with old parameter names
      eco_price, standard_price, premium_price
    } = input;
    
    // Use new HT prices or fall back to old prices
    const ecoHT = eco_price_ht || eco_price || input.standard || 0;
    const standardHT = standard_price_ht || standard_price || input.confort || 0;
    const premiumHT = premium_price_ht || premium_price || input.premium || 0;
    
    // 💰 Recalculer la pose avec la formule par zone géographique
    const poseActuelle = width && avec_pose ? calculateInstallationCost(width, cart?.codePostal) : 0;
    
    // Calculate TTC for each tier
    const calculateTTC = (priceHT: number, tauxTVA: number, montantPose: number, inclure: boolean) => {
      const storeWithPose = inclure ? priceHT + montantPose : priceHT;
      const tvaMontant = storeWithPose * (tauxTVA / 100);
      const priceTTC = storeWithPose + tvaMontant;
      return {
        storeHT: priceHT,
        poseHT: inclure ? montantPose : 0,
        totalHT: storeWithPose,
        tvaMontant: Math.round(tvaMontant),
        totalTTC: Math.round(priceTTC),
        tauxTVA
      };
    };
    
    const ecoCalc = calculateTTC(ecoHT, taux_tva, poseActuelle, avec_pose);
    const standardCalc = calculateTTC(standardHT, taux_tva, poseActuelle, avec_pose);
    const premiumCalc = calculateTTC(premiumHT, taux_tva, poseActuelle, avec_pose);
    
    // 💡 Calcul comparatif TVA (afficher si store >= 3500€ HT)
    const shouldShowComparison = standardHT >= 3500 && avec_pose && taux_tva === 10;
    let comparisonData = null;
    
    if (shouldShowComparison) {
      // Prix sans pose + TVA 20% (comparatif)
      const sansPoseTTC = Math.round(standardHT * 1.20);
      const avecPoseTTC = standardCalc.totalTTC;
      const surCoutReel = avecPoseTTC - sansPoseTTC;
      const economieTV = Math.round((standardHT * 0.10) + (poseActuelle * 0.10));
      
      comparisonData = {
        sansPoseTTC,
        avecPoseTTC,
        surCoutReel,
        economieTV,
        poseHT: poseActuelle
      };
    }
    
    console.log('💰 Calcul TTC:', { 
      ecoCalc, standardCalc, premiumCalc, 
      tauxTVA: taux_tva, 
      montantPoseHT: poseActuelle,
      avecPose: avec_pose,
      shouldShowComparison,
      comparisonData
    });
    
    // Informations supplémentaires à sauvegarder dans le panier
    const extraInfo = {
      width,
      projection: depth,
      terraceLength: terrace_length,
      terraceWidth: terrace_width,
      environment,
      orientation,
      installHeight: install_height,
      cableExit: cable_exit,
      obstacles,
      ledArms: includes_led_arms,
      ledBox: includes_led_box,
      ledArmsPrice: led_arms_price_ht,
      ledBoxPrice: led_box_price_ht,
      lambrequinPrice: lambrequin_price_ht,
      awningPrice: awning_price_ht,
      sousCoffrePrice: sous_coffre_price_ht,
    };
    
    return (
        <div className={`p-6 rounded-xl border-2 ${isCurrent ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-center mb-6 ${isCurrent ? 'text-2xl font-bold text-gray-900' : 'text-lg font-semibold text-gray-700'}`}>
              {isCurrent ? '🎯 Votre Triple Offre Personnalisée' : '📋 Offre antérieure'}
            </h3>
            {width && depth && (
              <p className={`text-center mb-4 ${isCurrent ? 'text-sm text-gray-700' : 'text-xs text-gray-600'}`}>
                Configuration : {width}cm × {depth}cm {selected_model ? `| Modèle: ${selected_model}` : ''}
              </p>
            )}
            
            {/* 📸 Photo du store configuré */}
            {isCurrent && selected_model && (() => {
              const model = STORE_MODELS.find(m => m.id === selected_model || m.name.toLowerCase().includes(selected_model.toLowerCase()));
              return model ? (
                <div className="mb-6 relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                  <Image src={model.image} alt={model.name} fill className="object-cover" />
                </div>
              ) : null;
            })()}
            
            <div className={`grid gap-4 ${isCurrent ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-3'}`}>
                {/* 💚 ECO OFFER */}
                <button 
                  onClick={() => {
                    // ❌ Arrêter le timer de relance si l'utilisateur clique sur une offre
                    if (tripleOfferTimeoutId) {
                      clearTimeout(tripleOfferTimeoutId);
                      setTripleOfferTimeoutId(null);
                    }
                    setTripleOfferDisplayed(false);
                    saveToCart({ priceEco: ecoCalc.totalTTC, selectedPrice: ecoCalc.totalTTC, priceType: 'eco', storeHT: ecoCalc.storeHT, poseHT: ecoCalc.poseHT, tvaAmount: ecoCalc.tvaMontant, ...extraInfo });
                    if (isCurrent) {
                      setWaitingForResponse(true);
                      addToolResult({ toolCallId: tool.toolCallId, tool: 'display_triple_offer', output: { offer_selected: 'eco', price_ttc: ecoCalc.totalTTC, validated: true } });
                      sendMessage({ text: `Je sélectionne l'offre Eco à ${ecoCalc.totalTTC}€ TTC` });
                      setTimeout(() => handleAddToCart(), 500);
                    }
                  }} 
                  className={`p-6 rounded-xl text-center transition-all ${isCurrent ? 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg' : 'bg-gray-100 border border-gray-300'}`} 
                  disabled={!isCurrent}
                >
                    <h4 className={`font-bold mb-2 ${isCurrent ? 'text-lg' : 'text-sm'}`}>💚 Eco</h4>
                    <p className={`font-bold text-gray-900 ${isCurrent ? 'text-3xl' : 'text-lg'}`}>{ecoCalc.totalTTC}€ TTC</p>
                    {isCurrent && avec_pose && <p className="text-xs text-green-600 font-semibold mt-1">🎁 Pose incluse</p>}
                    {isCurrent && (
                      <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200 space-y-1">
                        <p>Store: {ecoCalc.storeHT}€ HT</p>
                        {avec_pose && <p>Pose: {ecoCalc.poseHT}€ HT</p>}
                        <p>TVA {ecoCalc.tauxTVA}%: +{ecoCalc.tvaMontant}€</p>
                      </div>
                    )}
                    {isCurrent && <p className="text-sm text-gray-600 mt-2">Configuration de base</p>}
                </button>
                
                {/* ⭐ STANDARD OFFER */}
                <button 
                  onClick={() => {
                    // ❌ Arrêter le timer de relance si l'utilisateur clique sur une offre
                    if (tripleOfferTimeoutId) {
                      clearTimeout(tripleOfferTimeoutId);
                      setTripleOfferTimeoutId(null);
                    }
                    setTripleOfferDisplayed(false);
                    saveToCart({ priceStandard: standardCalc.totalTTC, selectedPrice: standardCalc.totalTTC, priceType: 'standard', storeHT: standardCalc.storeHT, poseHT: standardCalc.poseHT, tvaAmount: standardCalc.tvaMontant, ...extraInfo });
                    if (isCurrent) {
                      setWaitingForResponse(true);
                      addToolResult({ toolCallId: tool.toolCallId, tool: 'display_triple_offer', output: { offer_selected: 'standard', price_ttc: standardCalc.totalTTC, validated: true } });
                      sendMessage({ text: `Je sélectionne l'offre Standard à ${standardCalc.totalTTC}€ TTC` });
                      setTimeout(() => handleAddToCart(), 500);
                    }
                  }} 
                  className={`p-6 rounded-xl text-center transition-all relative ${isCurrent ? 'bg-white border-4 border-blue-600 shadow-xl hover:shadow-2xl' : 'bg-gray-100 border border-gray-300'}`} 
                  disabled={!isCurrent}
                >
                    {isCurrent && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMANDÉ</div>}
                    <h4 className={`font-bold mb-2 ${isCurrent ? 'text-xl text-blue-600' : 'text-sm text-gray-700'}`}>⭐ Standard</h4>
                    <p className={`font-bold text-gray-900 ${isCurrent ? 'text-4xl text-blue-600' : 'text-lg'}`}>{standardCalc.totalTTC}€ TTC</p>
                    {isCurrent && avec_pose && <p className="text-xs text-blue-600 font-semibold mt-1">🎁 Pose incluse</p>}
                    {isCurrent && (
                      <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200 space-y-1">
                        <p>Store: {standardCalc.storeHT}€ HT</p>
                        {avec_pose && <p>Pose: {standardCalc.poseHT}€ HT</p>}
                        <p>TVA {standardCalc.tauxTVA}%: +{standardCalc.tvaMontant}€</p>
                      </div>
                    )}
                    {isCurrent && <p className="text-sm text-gray-600 mt-2">Options confort</p>}
                </button>
                
                {/* 👑 PREMIUM OFFER */}
                <button 
                  onClick={() => {
                    // ❌ Arrêter le timer de relance si l'utilisateur clique sur une offre
                    if (tripleOfferTimeoutId) {
                      clearTimeout(tripleOfferTimeoutId);
                      setTripleOfferTimeoutId(null);
                    }
                    setTripleOfferDisplayed(false);
                    saveToCart({ pricePremium: premiumCalc.totalTTC, selectedPrice: premiumCalc.totalTTC, priceType: 'premium', storeHT: premiumCalc.storeHT, poseHT: premiumCalc.poseHT, tvaAmount: premiumCalc.tvaMontant, ...extraInfo });
                    if (isCurrent) {
                      setWaitingForResponse(true);
                      addToolResult({ toolCallId: tool.toolCallId, tool: 'display_triple_offer', output: { offer_selected: 'premium', price_ttc: premiumCalc.totalTTC, validated: true } });
                      sendMessage({ text: `Je sélectionne l'offre Premium à ${premiumCalc.totalTTC}€ TTC` });
                      setTimeout(() => handleAddToCart(), 500);
                    }
                  }} 
                  className={`p-6 rounded-xl text-center transition-all ${isCurrent ? 'bg-white border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg' : 'bg-gray-100 border border-gray-300'}`} 
                  disabled={!isCurrent}
                >
                    <h4 className={`font-bold mb-2 ${isCurrent ? 'text-lg' : 'text-sm'}`}>👑 Premium</h4>
                    <p className={`font-bold text-gray-900 ${isCurrent ? 'text-3xl' : 'text-lg'}`}>{premiumCalc.totalTTC}€ TTC</p>
                    {isCurrent && avec_pose && <p className="text-xs text-purple-600 font-semibold mt-1">🎁 Pose incluse</p>}
                    {isCurrent && (
                      <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200 space-y-1">
                        <p>Store: {premiumCalc.storeHT}€ HT</p>
                        {avec_pose && <p>Pose: {premiumCalc.poseHT}€ HT</p>}
                        <p>TVA {premiumCalc.tauxTVA}%: +{premiumCalc.tvaMontant}€</p>
                      </div>
                    )}
                    {isCurrent && <p className="text-sm text-gray-600 mt-2">Tout équipé</p>}
                </button>
            </div>
            
            
            {/* �💡 SECTION COMPARATIF TVA - Affichée si store >= 3500€ + TVA 10% */}
            {isCurrent && comparisonData && (
              <div className="mt-8 pt-6 border-t-2 border-blue-200">
                <h4 className="text-center text-lg font-bold text-gray-900 mb-4">💭 COMPARAISON PARITÉ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Colonne 1: Avec Pose */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-gray-900 mb-3 text-center">Votre offre (Pose + TVA 10%)</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex justify-between">
                        <span>Store HT</span>
                        <span className="font-semibold">{standardHT}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pose HT</span>
                        <span className="font-semibold">+{comparisonData.poseHT}€</span>
                      </div>
                      <div className="border-t border-blue-200 pt-2 flex justify-between font-semibold text-gray-900">
                        <span>Total HT</span>
                        <span>{standardHT + comparisonData.poseHT}€</span>
                      </div>
                      <div className="flex justify-between text-blue-600">
                        <span>TVA 10%</span>
                        <span>+{Math.round((standardHT + comparisonData.poseHT) * 0.10)}€</span>
                      </div>
                      <div className="bg-blue-100 rounded p-2 flex justify-between font-bold text-blue-900">
                        <span>✅ PRIX FINAL TTC</span>
                        <span>{comparisonData.avecPoseTTC}€</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Colonne 2: Sans Pose (TVA 20%) */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                    <h5 className="font-semibold text-gray-900 mb-3 text-center">Si store seul (TVA 20% normal)</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex justify-between">
                        <span>Store HT</span>
                        <span className="font-semibold">{standardHT}€</span>
                      </div>
                      <div className="flex justify-between text-gray-400 line-through">
                        <span>Pose HT</span>
                        <span>—</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-gray-900">
                        <span>Total HT</span>
                        <span>{standardHT}€</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>TVA 20%</span>
                        <span>+{Math.round(standardHT * 0.20)}€</span>
                      </div>
                      <div className="bg-gray-200 rounded p-2 flex justify-between font-bold text-gray-900">
                        <span>PRIX COMPARÉ TTC</span>
                        <span>{comparisonData.sansPoseTTC}€</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Résumé et Message Clé */}
                <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-center font-bold text-green-900 mb-2">🎁 AVANTAGE TVA RÉNOVATION</p>
                  <p className="text-sm text-gray-700 text-center mb-3">
                    Grâce à la TVA réduite, la pose vous revient à seulement <span className="font-bold text-green-700">+{comparisonData.surCoutReel}€</span> 
                    <br />
                    <span className="text-xs text-green-600">(au lieu de +{Math.round(comparisonData.poseHT)}€ en TVA normale)</span>
                  </p>
                  <p className="text-sm font-semibold text-center text-green-800">
                    ✨ Économie TVA réalisée: <span className="text-lg">{comparisonData.economieTV}€</span> 💚
                  </p>
                </div>
              </div>
            )}
        </div>
    );
  };
  
  // 🔥 Extraire open_model_selector en fonction séparée
  const renderModelSelectorTool = (tool: CustomToolCall, isCurrent: boolean) => {
    const input = (tool.input as Record<string, unknown>) || {};
    const modelsToDisplay = input.models_to_display as string[] || [];
    
    const width = input.width as number || null;
    const depth = input.depth as number || null;
    const frameColor = input.frame_color as string || null;
    const fabricColor = input.fabric_color as string || null;
    const exposure = input.exposure as string || null;
    const withMotor = input.with_motor !== undefined ? input.with_motor as boolean : true;
    
    const filteredModels = modelsToDisplay.map(id => Object.values(STORE_MODELS).find(m => m.id === id)).filter(Boolean) as StoreModel[];
    return (
      <div className={`grid gap-6 ${isCurrent ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3'}`}>
        {filteredModels.map((model) => {
          const isSelected = selectedModelId === model.id;
          return (
          <div key={model.id} className={`flex flex-col border-2 rounded-xl overflow-hidden shadow-sm bg-white transition-all ${
            isSelected ? 'border-4 border-green-500 bg-green-50 border-x-2' : `border-gray-200 ${isCurrent ? 'hover:shadow-lg' : 'opacity-70'}`
          }`}>
            {isSelected && isCurrent && (
              <div className="bg-green-500 text-white px-3 py-1 text-xs font-bold text-center">
                ✅ SÉLECTIONNÉ
              </div>
            )}
            {/* Image: affichée UNIQUEMENT quand le sélecteur est actif (isCurrent) */}
            {isCurrent && (
              <div className={`relative w-full bg-gray-100 h-60`}>
                <Image src={model.image} alt={model.name} fill className="object-cover" />
              </div>
            )}
            <div className={`p-${isCurrent ? '6' : '3'} flex flex-col flex-1`}>
              <h4 className={`font-bold text-gray-900 mb-1 ${isCurrent ? 'text-lg' : 'text-sm'}`}>{model.name}</h4>
              {width && depth && (
                <p className={`text-blue-600 font-semibold mb-2 ${isCurrent ? 'text-xs' : 'text-xs'}`}>
                  📏 {width}cm × {depth}cm {exposure ? `| ${exposure}` : ''}
                </p>
              )}
              {isCurrent && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{model.description}</p>}
              {isCurrent && <ul className="text-sm text-gray-500 mb-4 space-y-1">{model.features.slice(0, 2).map((feature, idx) => <li key={idx}>• {feature}</li>)}</ul>}
              {isCurrent && (
                <div className="mt-auto space-y-2">
                  <button onClick={() => { 
                    // 🔄 Sélectionner le modèle
                    saveToCart({ modelId: model.id, modelName: model.name }); 
                    setSelectedModelId(model.id);
                    // 🔥 Mettre à jour le contexte ShowroomContext IMMÉDIATEMENT
                    setShowroomState((prev: any) => ({
                      ...prev,
                      selectedModelId: model.id,
                      activeTool: null,
                      hasStartedConversation: true
                    }));
                    addToolResult({ toolCallId: tool.toolCallId, tool: 'open_model_selector', output: { modelId: model.id, modelName: model.name, validated: true } }); 
                    // 🔥 Réinitialiser activeTool pour faire disparaître le sélecteur
                    setActiveTool(null);
                    // 🔥 Envoyer un message utilisateur pour déclencher l'enchaînement automatique
                    setTimeout(() => {
                      sendMessage({ text: `J'ai choisi le modèle ${model.name}` });
                    }, 300);
                  }} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">Configurer ce store</button>
                  <button onClick={() => { setSelectedModelForModal(model); setIsModalOpen(true); }} className="w-full py-2 text-blue-600 font-semibold hover:bg-blue-50 transition-colors rounded-lg">Voir la fiche produit</button>
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    );
  };

  // 🔥 Afficher sélecteur de couleurs
  const renderColorSelectorTool = (tool: CustomToolCall, isCurrent: boolean) => {
    const input = tool.input as any;
    const { selected_model, width, depth } = input;
    
    return (
      <div className={`p-6 rounded-xl border-2 ${isCurrent ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-center mb-6 ${isCurrent ? 'text-2xl font-bold text-gray-900' : 'text-lg font-semibold text-gray-700'}`}>
          🎨 {isCurrent ? 'Choisissez votre Couleur d\'Armature' : 'Couleurs d\'armature (antérieure)'}
        </h3>
        <div className={`grid gap-4 ${isCurrent ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-5'}`}>
          {FRAME_COLORS.map((color) => {
            const isSelected = selectedColorId === color.id;
            return (
              <button
                key={color.id}
                onClick={() => {
                  setSelectedColorId(color.id);
                  saveToCart({ colorId: color.id });
                  if (isCurrent) {
                    // 🔥 Mettre à jour le contexte ShowroomContext IMMÉDIATEMENT
                    setShowroomState((prev: any) => ({
                      ...prev,
                      selectedColorId: color.id,
                      activeTool: null
                    }));
                    addToolResult({ toolCallId: tool.toolCallId, tool: 'open_color_selector', output: { color_id: color.id, color_name: color.name, validated: true } });
                    // 🔥 Réinitialiser activeTool pour faire disparaître le sélecteur
                    setActiveTool(null);
                    // 🔥 Délai de 300ms pour laisser le temps à l'état de se mettre à jour avant d'envoyer le message
                    setTimeout(() => {
                      sendMessage({ text: `J'ai choisi la couleur ${color.name}` });
                    }, 300);
                  }
                }}
                disabled={!isCurrent}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  isSelected 
                    ? 'border-4 border-green-500 ring-2 ring-green-300 shadow-lg' 
                    : `border-gray-300 ${isCurrent ? 'hover:border-gray-500 hover:shadow-md' : 'opacity-60'}`
                }`}
              >
                <div 
                  className={`w-full h-16 rounded-lg mb-2 border-2 border-gray-400 transition-all`}
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
                <p className={`text-xs font-semibold ${isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>{color.name}</p>
                {color.price > 0 && <p className={`text-xs ${isCurrent ? 'text-orange-600' : 'text-gray-500'}`}>+{color.price}€</p>}
                {isSelected && <p className="text-xs text-green-600 font-bold mt-1">✅</p>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // 🔥 Afficher sélecteur de toiles
  const renderFabricSelectorTool = (tool: CustomToolCall, isCurrent: boolean) => {
    const input = tool.input as any;
    const { frame_color } = input;
    
    // 🔥 FILTRAGE DES TOILES SELON LE STORE SÉLECTIONNÉ
    const selectedModel = selectedModelId ? STORE_MODELS[selectedModelId] : null;
    const compatibleTypes = selectedModel?.compatible_toile_types || [];
    
    // Mapper les types compatibles vers les codes de toiles
    // 'ORCH' → ['ORCH_UNI', 'ORCH_DECOR'] (pas ORCH_MAX)
    // 'ORCH_MAX' → ['ORCH_UNI', 'ORCH_DECOR', 'ORCH_MAX']
    // 'SATT' → ['SATT']
    let allowedToileTypeCodes: string[] = [];
    
    compatibleTypes.forEach((type) => {
      if (type === 'ORCH') {
        allowedToileTypeCodes.push('ORCH_UNI', 'ORCH_DECOR');
      } else if (type === 'ORCH_MAX') {
        allowedToileTypeCodes.push('ORCH_UNI', 'ORCH_DECOR', 'ORCH_MAX');
      } else if (type === 'SATT') {
        allowedToileTypeCodes.push('SATT');
      }
    });
    
    // Filtrer les toiles selon les types compatibles
    const filteredFabrics = allowedToileTypeCodes.length > 0 
      ? FABRICS.filter(fabric => allowedToileTypeCodes.includes(fabric.toile_type_code))
      : FABRICS; // Si aucun filtre défini, montrer toutes les toiles
    
    // Grouper les toiles filtrées par type
    const fabricsByType = filteredFabrics.reduce((acc, fabric) => {
      const type = fabric.toile_type_code;
      if (!acc[type]) acc[type] = [];
      acc[type].push(fabric);
      return acc;
    }, {} as Record<string, typeof FABRICS>);
    
    // Noms lisibles pour les catégories
    const categoryNames: Record<string, string> = {
      'ORCH_UNI': '🎭 Orchestra Unis',
      'ORCH_DECOR': '🎨 Orchestra Décors',
      'ORCH_MAX': '🌟 Orchestra Max',
      'SATT': '🏔️ Sattler'
    };
    
    const fabricsToDisplay = fabricsByType[selectedFabricCategory] || [];
    
    return (
      <div className={`p-6 rounded-xl border-2 ${isCurrent ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-center mb-3 ${isCurrent ? 'text-2xl font-bold text-gray-900' : 'text-lg font-semibold text-gray-700'}`}>
          🧵 {isCurrent ? 'Choisissez votre Toile' : 'Toiles (antérieure)'}
        </h3>
        
        {isCurrent && selectedModel && (
          <div className="text-center mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ✅ Toiles compatibles avec le <strong>{selectedModel.name}</strong> : {compatibleTypes.join(', ')}
            </p>
          </div>
        )}
        
        {isCurrent && (
          <>
            {/* Onglets de catégories */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {Object.keys(fabricsByType).map((typeCode) => (
                <button
                  key={typeCode}
                  onClick={() => setSelectedFabricCategory(typeCode)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedFabricCategory === typeCode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {categoryNames[typeCode] || typeCode} ({fabricsByType[typeCode].length})
                </button>
              ))}
            </div>
            
            <div className="text-center mb-4 text-xs text-gray-600">
              {fabricsToDisplay.length} toiles dans cette catégorie
            </div>
          </>
        )}
        
        <div className={`grid gap-4 ${isCurrent ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3'} max-h-[60vh] overflow-y-auto`}>
          {fabricsToDisplay.map((fabric) => {
            const isSelected = selectedFabricId === fabric.id;
            return (
              <button
                key={fabric.id}
                onClick={() => {
                  setSelectedFabricId(fabric.id);
                  saveToCart({ fabricId: fabric.id });
                  if (isCurrent) {
                    // 🔥 Mettre à jour le contexte ShowroomContext IMMÉDIATEMENT
                    setShowroomState((prev: any) => ({
                      ...prev,
                      selectedFabricId: fabric.id,
                      activeTool: null
                    }));
                    addToolResult({ toolCallId: tool.toolCallId, tool: 'open_fabric_selector', output: { fabric_id: fabric.id, fabric_name: fabric.name, validated: true } });
                    // 🔥 Réinitialiser activeTool pour faire disparaître le sélecteur
                    setActiveTool(null);
                    // 🔥 Délai de 300ms pour laisser le temps à l'état de se mettre à jour avant d'envoyer le message
                    setTimeout(() => {
                      sendMessage({ text: `J'ai choisi la toile ${fabric.name}` });
                    }, 300);
                  }
                }}
                disabled={!isCurrent}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected 
                    ? 'border-4 border-green-500 ring-2 ring-green-300 shadow-lg' 
                    : `border-gray-300 ${isCurrent ? 'hover:border-gray-500 hover:shadow-md' : 'opacity-60'}`
                }`}
              >
                <div className={`w-full h-24 rounded-lg mb-2 bg-gray-200 border border-gray-400 overflow-hidden`}>
                  {fabric.image_url ? (
                    <img 
                      src={fabric.image_url} 
                      alt={fabric.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.error(`❌ Failed to load image for ${fabric.ref}:`, fabric.image_url);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs text-red-600">❌ Image error</div>`;
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-xs text-gray-600`}>
                      {fabric.category.toUpperCase()}
                    </div>
                  )}
                </div>
                <p className={`text-xs font-semibold ${isCurrent ? 'text-gray-900' : 'text-gray-600'} line-clamp-2`}>{fabric.ref}</p>
                <p className={`text-xs ${isCurrent ? 'text-gray-700' : 'text-gray-500'}`}>{fabric.name}</p>
                {fabric.price > 0 && <p className={`text-xs ${isCurrent ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>+{fabric.price}€</p>}
                {isSelected && <p className="text-xs text-green-600 font-bold mt-1">✅</p>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const quickQuestions = [
    { label: "🚀 Je veux me laisser guider", text: "Je veux me laisser guider" },
    { label: "Quel store choisir ?", text: "J'aimerais trouver le store parfait pour ma terrasse." },
    { label: "TVA à 10%", text: "Comment bénéficier de la TVA à 10% ?" }
  ];

  // Helper functions to calculate offers
  const calculateEcoOffer = (input: any) => {
    const { eco_price_ht, eco_price, standard, with_motor, avec_pose = false, taux_tva = 20, width = 3000 } = input;
    const ecoHT = eco_price_ht || eco_price || standard || 0;
    const poseActuelle = width && avec_pose ? calculateInstallationCost(width, cart?.codePostal) : 0;
    const totalHT = avec_pose ? ecoHT + poseActuelle : ecoHT;
    const tvaMontant = Math.round(totalHT * (taux_tva / 100));
    const totalTTC = totalHT + tvaMontant;
    return { storeHT: ecoHT, poseHT: avec_pose ? poseActuelle : 0, totalHT, tvaMontant, totalTTC, tauxTVA: taux_tva };
  };

  const calculateStandardOffer = (input: any) => {
    const { standard_price_ht, standard_price, confort, with_motor, avec_pose = false, taux_tva = 20, width = 3000 } = input;
    const standardHT = standard_price_ht || standard_price || confort || 0;
    const poseActuelle = width && avec_pose ? calculateInstallationCost(width, cart?.codePostal) : 0;
    const totalHT = avec_pose ? standardHT + poseActuelle : standardHT;
    const tvaMontant = Math.round(totalHT * (taux_tva / 100));
    const totalTTC = totalHT + tvaMontant;
    return { storeHT: standardHT, poseHT: avec_pose ? poseActuelle : 0, totalHT, tvaMontant, totalTTC, tauxTVA: taux_tva };
  };

  const calculatePremiumOffer = (input: any) => {
    const { premium_price_ht, premium_price, premium, with_motor, avec_pose = false, taux_tva = 20, width = 3000 } = input;
    const premiumHT = premium_price_ht || premium_price || premium || 0;
    const poseActuelle = width && avec_pose ? calculateInstallationCost(width, cart?.codePostal) : 0;
    const totalHT = avec_pose ? premiumHT + poseActuelle : premiumHT;
    const tvaMontant = Math.round(totalHT * (taux_tva / 100));
    const totalTTC = totalHT + tvaMontant;
    return { storeHT: premiumHT, poseHT: avec_pose ? poseActuelle : 0, totalHT, tvaMontant, totalTTC, tauxTVA: taux_tva };
  };

  const handleTerraceChange = (dims: { m1: number; m2: number; m3: number; m4: number }) => {
    setTerraceState(dims);
    const msg = `Ma terrasse a comme dimensions: M1=${dims.m1.toFixed(2)}m, M2=${dims.m2.toFixed(2)}m, M3=${dims.m3.toFixed(2)}m, M4=${dims.m4.toFixed(2)}m`;
    sendMessage({ text: msg });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 🔵 CHAT UNIQUEMENT - Showroom déplacé dans page.tsx via ShowroomContext */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {isModalOpen && <ProductModal model={selectedModelForModal} onClose={() => setIsModalOpen(false)} />}
        
        <header className="bg-gray-900 text-white py-3 px-4 sticky top-0 z-10 text-center">
          <h2 className="text-lg font-bold leading-tight">Expert Storal - Assistant Personnalisé</h2>
          <p className="text-xs text-gray-300 mt-1">Configurez votre produit idéal</p>
        </header>
        
        {/* 🔐 Bannière de Disclaimer IA - RGPD */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-4 py-2">
          <div className="flex items-start gap-3 text-xs">
            <span className="text-green-600 text-sm flex-shrink-0">🔒</span>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-green-700">Assistant IA sécurisé :</strong> Cet agent utilise Google Gemini (version professionnelle). 
                <strong> Vos conversations ne sont PAS utilisées pour entraîner l'IA.</strong>{' '}
                <a 
                  href="/confidentialite" 
                  target="_blank" 
                  className="text-blue-600 hover:underline font-semibold"
                >
                  En savoir plus
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl px-6 py-6 border border-blue-200 shadow-md max-w-[60%] mx-auto">
                <TypewriterText 
                  text="Bonjour ! Je suis l'Agent Storal. Bienvenue dans une **expérience passionnante** : ici, nous ne nous contentons pas de choisir un store, nous allons créer ensemble **votre ombre idéale**. Mon objectif est de répondre avec précision à vos attentes techniques tout en transformant votre extérieur. Prêt à commencer l'aventure ?" 
                  isWelcomeMessage={true} 
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Nous sommes ici pour vous aider !</h3>
                <p className="text-sm text-gray-600 mb-4">Choisissez ci-dessous pour commencer votre configuration.</p>
              </div>

              <div className="flex justify-center flex-wrap gap-3">
                {quickQuestions.map((q, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleQuickClick(q.text)} 
                    disabled={isLoading} 
                    className={`transition-all ${
                      idx === 0 
                        ? 'px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl text-base'
                        : 'px-4 py-2 bg-white border border-gray-300 hover:border-gray-500 hover:bg-gray-50 text-sm font-medium text-gray-700 rounded-full'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message, idx) => {
            const messageText = getMessageText(message);
            const isWelcomeMessage = messageText.includes('Bonjour ! Je suis l\'Agent Storal');
            
            return (
              <div key={`${message.id}-${idx}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl px-4 py-3 ${message.role === 'user' ? 'max-w-[40%] bg-gray-900 text-white' : 'max-w-[60%] bg-gray-100 text-gray-900'}`}>
                  {message.role === 'assistant' && <div className="text-xs font-semibold text-gray-500 mb-2">Expert Storal</div>}
                  {isWelcomeMessage ? (
                    <TypewriterText text={messageText} isWelcomeMessage={true} />
                  ) : (
                    <span className="whitespace-pre-wrap text-sm leading-relaxed">{messageText}</span>
                  )}
                </div>
              </div>
            );
          })}
          
          {renderActiveTool()}
          
          {(isLoading || waitingForResponse) && !activeTool && (
            (() => {
              // Détecter le contexte de chargement en regardant le dernier message
              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
              const lastMessageText = lastMessage ? getMessageText(lastMessage).toLowerCase() : '';
              
              let loadingMessage = '⏳ Chargement en cours...';
              
              if (lastMessageText.includes('couleur') && (lastMessageText.includes('armature') || lastMessageText.includes('coffre'))) {
                loadingMessage = '🎨 Chargement de la palette de couleurs...';
              } else if (lastMessageText.includes('toile') || lastMessageText.includes('tissu') || lastMessageText.includes('fabric')) {
                loadingMessage = '🧵 Chargement des toiles disponibles...';
              } else if (lastMessageText.includes('modèle') || lastMessageText.includes('store')) {
                loadingMessage = '🏗️ Chargement des modèles...';
              } else if (lastMessageText.includes('prix') || lastMessageText.includes('offre')) {
                loadingMessage = '💰 Calcul de votre offre personnalisée...';
              }
              
              return <LoadingProgressBar message={loadingMessage} />;
            })()
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
          {/* 🍯 HONEYPOT - Champ invisible pour bloquer les bots */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
            tabIndex={-1}
            style={{
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none'
            }}
            aria-hidden="true"
          />
          
          <div className="flex space-x-2">
            <input 
              type="text"
              name="message"
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ex: Je veux un store de 5x3m" 
              disabled={isLoading} 
              className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600" 
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-300"
            >
              {isLoading ? '⏳' : '📤'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}