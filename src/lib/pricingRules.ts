import { getSupabaseClient } from '@/lib/supabase';
import { getDefaultCoefficient, calculatePriceTTC, PRICING_CONFIG } from '@/lib/pricingConfig';

/**
 * Obtient le coefficient de tarification pour un produit
 * Cherche d'abord dans les pricing_rules actives, sinon utilise le coefficient par défaut
 * 
 * @param productId ID du produit
 * @param productKey Clé du produit (ex: store_banne_kissimy)
 * @returns Le coefficient applicable
 */
export async function getPricingCoefficient(
  productId: string,
  productKey: string
): Promise<number> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    // Si pas de Supabase, utiliser le coefficient par défaut
    return getDefaultCoefficient(productKey);
  }

  try {
    // Chercher une règle de prix active pour ce produit
    const { data: rule, error } = await supabase
      .from('pricing_rules')
      .select('coefficient')
      .eq('product_id', productId)
      .eq('is_active', true)
      .gte('valid_from', new Date().toISOString())
      .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
      .order('valid_from', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching pricing rule:', error);
      return getDefaultCoefficient(productKey);
    }

    // Si une règle active est trouvée, l'utiliser
    if (rule) {
      return rule.coefficient;
    }

    // Sinon, utiliser le coefficient par défaut
    return getDefaultCoefficient(productKey);
  } catch (error) {
    console.error('Error in getPricingCoefficient:', error);
    return getDefaultCoefficient(productKey);
  }
}

/**
 * Calcule le prix TTC final avec le coefficient dynamique
 * 
 * @param priceHT Prix d'achat HT du catalogue
 * @param productId ID du produit pour récupérer le coefficient
 * @param productKey Clé du produit pour le coefficient par défaut
 * @returns Prix TTC
 */
export async function calculateFinalPrice(
  priceHT: number,
  productId: string,
  productKey: string
): Promise<number> {
  const coefficient = await getPricingCoefficient(productId, productKey);
  return calculatePriceTTC(priceHT, coefficient);
}

/**
 * Récupère toutes les règles de prix actives pour affichage
 */
export async function getActivePricingRules() {
  const supabase = getSupabaseClient();

  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('id, product_id, coefficient, reason, valid_from, valid_until')
      .eq('is_active', true)
      .gte('valid_from', new Date().toISOString())
      .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
      .order('valid_from', { ascending: false });

    if (error) {
      console.error('Error fetching pricing rules:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getActivePricingRules:', error);
    return [];
  }
}

/**
 * Crée ou met à jour une règle de prix (Admin only)
 */
export async function setPricingRule(
  productId: string,
  coefficient: number,
  reason: string,
  validFrom: Date,
  validUntil?: Date
) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error('Supabase client not available');
  }

  // Vérifier que l'utilisateur est admin (fait côté serveur)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Insérer la règle
  const { data, error } = await supabase
    .from('pricing_rules')
    .insert([
      {
        product_id: productId,
        coefficient,
        reason,
        valid_from: validFrom.toISOString(),
        valid_until: validUntil?.toISOString() || null,
        is_active: true,
        created_by: user.id,
      },
    ])
    .select();

  if (error) {
    throw new Error(`Failed to set pricing rule: ${error.message}`);
  }

  return data?.[0];
}
