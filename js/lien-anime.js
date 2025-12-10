/**
 * Construit un lien de visionnage basé sur le titre: 
 * - Essaie d'extraire une "URL Source" depuis la page probe (si présente)
 * - Sinon renvoie la page d'anime (voiranime) si pas 404
 * - Sinon fallback JustWatch
 * @returns {Promise<{url: string, episodes: number|null}>}
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
      const nbEps = extractNbEpisodes(text);
      console.log("Extracted episodes:", nbEps);
      
      if (!/404: Not Found/i.test(text)) {
        const url = urlSource || voiranime;
        return { url, episodes: nbEps };
      }
    }
  } catch {
    // ignore
  }

  if (altTitle) {
    try {
      const probe = await fetch(`https://r.jina.ai/https://v6.voiranime.com/anime/${qAlt}`);
      if (probe.ok) {
        const text = await probe.text();
        const urlSource = extractSourceUrl(text);
        const nbEps = extractNbEpisodes(text);
        
        if (!/404: Not Found/i.test(text)) {
          const url = urlSource || voiranimeAlt;
          return { url, episodes: nbEps };
        }
      }
    } catch {
      // ignore
    }
  }

  return { url: justwatch, episodes: null };
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

function extractNbEpisodes(text) {
  if (!text) return null;

  // Vérifier le statut
  const statusMatch = text.match(/#+\s*Status\s*\n?\s*([^\n]+)/i);
  const isFinished = statusMatch && /TERMINÉ|COMPLÉTÉ|FINISHED/i.test(statusMatch[1]);

  // Pour les séries terminées : cherche le champ "Episodes"
  if (isFinished) {
    const epsMatch1 = text.match(/#+\s*Episodes\s*\n?\s*(\d+)/i);
    if (epsMatch1 && epsMatch1[1]) {
      return parseInt(epsMatch1[1], 10);
    }
  }

  // Pour les séries en cours OU si pas de champ Episodes trouvé : compte les épisodes dans la liste
  const episodeMatches = text.match(/\[.*?-\s*(\d+)\s+VOSTFR\s*-\s*\d+\]/gi);
  if (episodeMatches && episodeMatches.length > 0) {
    // Extrait le numéro le plus élevé pour avoir le total
    const numbers = episodeMatches.map(match => {
      const num = match.match(/-\s*(\d+)\s+VOSTFR/i);
      return num ? parseInt(num[1], 10) : 0;
    });
    const maxEpisode = Math.max(...numbers);
    return maxEpisode > 0 ? maxEpisode : episodeMatches.length;
  }

  // Fallback: compte les items de la liste
  const listItems = text.match(/\*\s+\[.*?-\s*\d+.*?\]/g);
  if (listItems && listItems.length > 0) {
    return listItems.length;
  }

  return null;
}
