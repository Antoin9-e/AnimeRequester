// Fonctions liées à la construction du lien "Voir l'anime"

/**
 * Construit un lien de visionnage basé sur le titre: 
 * - Essaie d'extraire une "URL Source" depuis la page probe (si présente)
 * - Sinon renvoie la page d'anime (voiranime) si pas 404
 * - Sinon fallback JustWatch
 */
export async function buildWatchLink(anime) {
  const title = (toDash(anime?.title || "")).toLowerCase();
  const altTitle = (toDash(anime?.alternativeTitles?.[0] || "")).toLowerCase();

  const q = encodeURIComponent(title);
  const qAlt = encodeURIComponent(altTitle);

  const voiranime = `https://www.voiranime.com/anime/${q}`;
  const voiranimeAlt = `https://www.voiranime.com/anime/${qAlt}`;
  const justwatch = `https://www.justwatch.com/fr/recherche?q=${q}`;
  console.log("Build link for:", title, " / alt:", altTitle);

  // Vérif via proxy de lecture (contourne CORS) — peut échouer selon disponibilité
  try {
    const probe = await fetch(`https://r.jina.ai/https://v6.voiranime.com/anime/${q}`);
    if (probe.ok) {
      const text = await probe.text();
      const urlSource = extractSourceUrl(text);
      if (urlSource && !/404: Not Found/i.test(text)) return urlSource;
      if (!/404: Not Found/i.test(text)) return voiranime;
    }
  } catch {
    // ignore
  }

  // Essai avec le premier titre alternatif, si présent
  if (altTitle) {
    try {
      const probe = await fetch(`https://r.jina.ai/https://v6.voiranime.com/anime/${qAlt}`);
      if (probe.ok) {
        const text = await probe.text();
        const urlSource = extractSourceUrl(text);
        if (urlSource && !/404: Not Found/i.test(text)) return urlSource;
        if (!/404: Not Found/i.test(text)) return voiranimeAlt;
      }
    } catch {
      // ignore
    }
  }

  return justwatch;
}

// Remplace les espaces par des tirets, trim des bords
function toDash(str) {
  return String(str).trim().replace(/\s+/g, "-");
}

// Extrait une URL après "URL Source:" ou variantes, si présente
function extractSourceUrl(text) {
  if (!text) return null;
  const m1 = text.match(/URL\s*Source\s*:\s*(https?:\/\/[^\s"'<>]+)/i);
  if (m1 && m1[1]) return m1[1];
  const m2 = text.match(/url\s*source\s*:\s*(https?:\/\/[^\s"'<>]+)/i);
  if (m2 && m2[1]) return m2[1];
  const m3 = text.match(/data-?source-?url=["'](https?:\/\/[^"']+)["']/i);
  if (m3 && m3[1]) return m3[1];
  return null;
}
