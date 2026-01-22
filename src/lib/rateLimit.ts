// Simple in-memory rate limiter (pour démo - en prod utiliser Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // Nouvelle fenêtre
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    // Limite atteinte
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  // Incrémenter
  record.count++;
  return { success: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

// Nettoyage périodique (optionnel)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);
