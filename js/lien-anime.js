/**
 * Construit un lien de visionnage basé sur le titre: 
 * - Essaie d'extraire une "URL Source" depuis la page probe (si présente)
 * - Sinon renvoie la page d'anime (voiranime) si pas 404
 * - 404 = anime non disponible sur VoirAnime (fallback JustWatch, mais garde le résultat)
 * - Titre non similaire = résultat non pertinent (supprime le résultat)
 * @returns {Promise<{url: string, episodes: number|null, found: boolean, notAvailable?: boolean}>}
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

  // Essaie d'abord avec le titre principal
  const result = await tryFetchAnime(q, title, voiranime);
  if (result.status === 'found') {
    return { url: result.url, episodes: result.episodes, found: true };
  }
  if (result.status === 'not_similar') {
    return { found: false }; // Résultat non pertinent
  }

  // Essaie avec le titre alternatif si disponible
  if (altTitle && altTitle !== title) {
    const resultAlt = await tryFetchAnime(qAlt, altTitle, voiranimeAlt);
    if (resultAlt.status === 'found') {
      return { url: resultAlt.url, episodes: resultAlt.episodes, found: true };
    }
    if (resultAlt.status === 'not_similar') {
      return { found: false }; // Résultat non pertinent
    }
  }

  // 404 sur VoirAnime ou erreur = garde le résultat avec fallback JustWatch
  console.log(`Anime non disponible sur VoirAnime: "${title}" - Fallback JustWatch`);
  return { url: justwatch, episodes: null, found: true, notAvailable: true };
}

// Tente de récupérer les infos d'un anime depuis VoirAnime
async function tryFetchAnime(encodedTitle, originalTitle, voiranimeUrl) {
  try {
    const probe = await fetch(`https://r.jina.ai/https://v6.voiranime.com/anime/${encodedTitle}`);
    if (!probe.ok) {
      return { status: '404' }; // Pas disponible sur VoirAnime
    }

    const text = await probe.text();
    
    // Vérifie que ce n'est pas une 404
    if (/404: Not Found/i.test(text)) {
      console.log(`404 sur VoirAnime pour "${originalTitle}"`);
      return { status: '404' }; // Pas disponible sur VoirAnime
    }

    // Extrait le titre de la page pour vérifier la correspondance
    const pageTitle = extractPageTitle(text);
    
    // Vérifie la similarité entre le titre recherché et celui de la page
    if (pageTitle && !isSimilarTitle(originalTitle, pageTitle)) {
      console.log(`❌ Titre non similaire: "${originalTitle}" vs "${pageTitle}" - Résultat non pertinent`);
      return { status: 'not_similar' }; // Titre ne correspond pas = non pertinent
    }

    const urlSource = extractSourceUrl(text);
    const nbEps = extractNbEpisodes(text);
    
    console.log(`✓ Match trouvé pour "${originalTitle}": ${nbEps} épisodes`);
    
    const url = urlSource || voiranimeUrl;
    return { status: 'found', url, episodes: nbEps };
  } catch (e) {
    console.log(`Erreur fetch pour "${originalTitle}":`, e.message);
    return { status: 'error' }; // Erreur réseau = on garde le résultat
  }
}

// Extrait le titre principal de la page
function extractPageTitle(text) {
  if (!text) return null;
  
  // Cherche dans les métadonnées markdown (Romaji ou English)
  const romajiMatch = text.match(/#+\s*Romaji\s*\n?\s*([^\n]+)/i);
  if (romajiMatch && romajiMatch[1]) {
    return romajiMatch[1].trim().toLowerCase();
  }
  
  const englishMatch = text.match(/#+\s*English\s*\n?\s*([^\n]+)/i);
  if (englishMatch && englishMatch[1]) {
    return englishMatch[1].trim().toLowerCase();
  }
  
  // Cherche le titre principal (première ligne après l'URL Source)
  const titleMatch = text.match(/Title:\s*([^\n]+)/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim().toLowerCase();
  }
  
  return null;
}

// Vérifie si deux titres sont similaires (évite les faux positifs)
function isSimilarTitle(searchTitle, pageTitle) {
  if (!searchTitle || !pageTitle) return false;
  
  // Normalise les titres (enlève tirets, espaces, ponctuation)
  const normalize = (str) => 
    str.toLowerCase()
      .replace(/[:\-_\s]+/g, '')
      .replace(/[^\w]/g, '');
  
  const normalizedSearch = normalize(searchTitle);
  const normalizedPage = normalize(pageTitle);
  
  // Correspondance exacte après normalisation
  if (normalizedSearch === normalizedPage) return true;
  
  // Le titre de la page contient le titre recherché (ou vice-versa)
  // avec un seuil de 80% de similarité minimum
  if (normalizedSearch.length < 3 || normalizedPage.length < 3) return false;
  
  const longer = normalizedSearch.length > normalizedPage.length ? normalizedSearch : normalizedPage;
  const shorter = normalizedSearch.length > normalizedPage.length ? normalizedPage : normalizedSearch;
  
  // Si le plus court est contenu dans le plus long ET fait au moins 80% de sa taille
  if (longer.includes(shorter) && shorter.length / longer.length >= 0.8) {
    return true;
  }
  
  // Vérifie les mots clés principaux (plus strict)
  const searchWords = searchTitle.toLowerCase().split(/[\s\-_:]+/).filter(w => w.length > 2);
  const pageWords = pageTitle.toLowerCase().split(/[\s\-_:]+/).filter(w => w.length > 2);
  
  if (searchWords.length === 0 || pageWords.length === 0) return false;
  
  // Filtre les mots communs
  const significantSearchWords = searchWords.filter(w => !isCommonWord(w));
  const significantPageWords = pageWords.filter(w => !isCommonWord(w));
  
  if (significantSearchWords.length === 0 || significantPageWords.length === 0) return false;
  
  // RÈGLE STRICTE : Tous les mots significatifs de la recherche doivent être dans la page
  // ET au moins 50% des mots significatifs de la page doivent être dans la recherche
  const searchInPage = significantSearchWords.every(w => 
    significantPageWords.some(pw => pw === w || pw.includes(w) || w.includes(pw))
  );
  
  if (!searchInPage) return false;
  
  // Vérifie la correspondance inverse (au moins 50% des mots de la page sont dans la recherche)
  const pageInSearch = significantPageWords.filter(pw =>
    significantSearchWords.some(w => w === pw || w.includes(pw) || pw.includes(w))
  );
  
  const pageMatchRatio = pageInSearch.length / significantPageWords.length;
  
  return pageMatchRatio >= 0.5;
}

// Liste de mots communs à ignorer dans la comparaison
function isCommonWord(word) {
  const commonWords = [
    'the', 'le', 'la', 'les', 'de', 'un', 'une', 'des',
    'and', 'et', 'or', 'ou', 'in', 'on', 'at', 'to',
    'season', 'saison', 'movie', 'film', 'ova', 'special',
    'episode', 'ep', 'part', 'partie', 'one', 'two', 'three',
    'nd', 'rd', 'st', 'th', '2nd', '3rd', '1st'
  ];
  return commonWords.includes(word.toLowerCase());
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
