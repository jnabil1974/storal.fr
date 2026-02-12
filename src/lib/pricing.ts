// Pricing calculation utilities
import { ProductConfig } from '@/types/products';

/**
 * Calculate the total price for a product based on configuration
 */
export function calculateProductPrice(basePrice: number, config: ProductConfig): number {
  let totalPrice = basePrice;

  // Add options surcharges if applicable
  if (config.options) {
    // Add LED surcharge if applicable
    if (config.options.led && config.options.led !== 'none') {
      totalPrice += 150; // Base LED surcharge
    }

    // Add lambrequin surcharge
    if (config.options.lambrequin) {
      totalPrice += 50;
    }

    // Add auvent surcharge
    if (config.options.auvent) {
      totalPrice += 45 * (config.dimensions?.width || 0) / 1000; // Per meter
    }

    // Add capteur Eolis surcharge
    if (config.options.capteur_eolis) {
      totalPrice += 200;
    }
  }

  return Math.round(totalPrice * 100) / 100;
}

/**
 * Get a detailed price breakdown for a product configuration
 */
export function getPriceBreakdown(
  basePrice: number,
  config: ProductConfig
): Record<string, number> {
  const breakdown: Record<string, number> = {
    base: basePrice,
  };

  if (config.options) {
    if (config.options.led && config.options.led !== 'none') {
      breakdown.led = 150;
    }

    if (config.options.lambrequin) {
      breakdown.lambrequin = 50;
    }

    if (config.options.auvent) {
      breakdown.auvent = 45 * (config.dimensions?.width || 0) / 1000;
    }

    if (config.options.capteur_eolis) {
      breakdown.capteur_eolis = 200;
    }
  }

  return breakdown;
}
