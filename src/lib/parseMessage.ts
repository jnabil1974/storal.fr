export type Badge = {
  type: 'guarantee' | 'tva' | 'wind' | 'fabric' | 'tech' | 'safety' | 'smart' | 'success' | 'promo';
  label: string;
};

export type ParsedMessage = {
  text: string;
  config: Record<string, any> | null;
  badges: Badge[];
};

export function parseMessage(raw: string): ParsedMessage {
  if (!raw) return { text: '', config: null, badges: [] };

  // Extraire les badges
  const badgeRegex = /BADGE:\s*({[^}]+})/gi;
  const badgeMatches = [...raw.matchAll(badgeRegex)];
  const badges: Badge[] = [];

  badgeMatches.forEach((badgeMatch) => {
    try {
      const badge = JSON.parse(badgeMatch[1]) as Badge;
      badges.push(badge);
    } catch (e) {
      // Ignorer les badges mal formatés
    }
  });

  // Nettoyer les badges du texte
  let cleanedRaw = raw.replace(/BADGE:\s*{[^}]+}/gi, '').trim();

  const regex = /config_data\s*:\s*/i;
  const match = regex.exec(cleanedRaw);

  if (!match) {
    return { text: cleanedRaw.trim(), config: null, badges };
  }

  const splitIndex = match.index;
  const textPart = cleanedRaw.slice(0, splitIndex).trim();
  let configPart = cleanedRaw.slice(splitIndex + match[0].length).trim();

  configPart = configPart
    .replace(/```(?:json)?/gi, '')
    .replace(/```/g, '')
    .trim();

  const firstBrace = configPart.indexOf('{');
  const lastBrace = configPart.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return { text: cleanedRaw.trim(), config: null, badges };
  }

  configPart = configPart.slice(firstBrace, lastBrace + 1);

  try {
    const config = JSON.parse(configPart);
    return { text: textPart, config, badges };
  } catch {
    return { text: cleanedRaw.trim(), config: null, badges };
  }
}
