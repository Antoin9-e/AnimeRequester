import { buildWatchLink } from "./lien-anime.js";

export async function afficherResultat(result) {
  clearResult();

  let resultDiv = document.getElementById("result");
  resultDiv.classList.remove("hidden");

  // Centrage
  const isSingle = Array.isArray(result?.data) && result.data.length === 1;
  const isTwo = Array.isArray(result?.data) && result.data.length === 2;
  if (isTwo) {
    resultDiv.classList.add("grid", "grid-cols-2");
    resultDiv.classList.remove("sm:grid-cols-2", "lg:grid-cols-3");
  }
  else if (isSingle) {
    resultDiv.classList.add("grid", "grid-cols-1");
    resultDiv.classList.remove("sm:grid-cols-2", "lg:grid-cols-3");
  } else {
    // Restaure la grille normale
    resultDiv.classList.add("grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3");
  }

  for (const [i, anime] of result.data.entries()) {
    const conteneur = document.createElement("div");
    const titre = document.createElement("h2");
    const image = document.createElement("img");
    const synopsis = document.createElement("p");
    const genre = document.createElement("p");
    const ranking = document.createElement("p");
    const episodes = document.createElement("p");
    const btnVoir = document.createElement("a");


    // --- Remplissage JSON ---
    titre.textContent = anime.title;
    image.src = anime.image;

    // Synopsis avec "Voir plus / Voir moins"
    const fullSynopsis = String(anime.synopsis || "Non disponible");
    const { first: firstSentenceText, hasMore } = getFirstSentence(fullSynopsis);

    const synoLabel = document.createElement("strong");
    synoLabel.textContent = "Synopsis :";
    const synoContent = document.createElement("span");
    synoContent.className = "ml-1";
    synoContent.textContent = firstSentenceText;

    synopsis.appendChild(synoLabel);
    synopsis.appendChild(document.createTextNode(" "));
    synopsis.appendChild(synoContent);


    // Bouton Voir plus / Voir moins
    if (hasMore) {
      const btnToggle = document.createElement("button");
      btnToggle.type = "button";
      btnToggle.className = "ml-2 text-blue-600 hover:underline focus:outline-none";
      btnToggle.textContent = "Voir plus";

      let expanded = false;
      btnToggle.addEventListener("click", () => {
        expanded = !expanded;
        if (expanded) {
          synoContent.textContent = fullSynopsis;
          synoEllipsis.textContent = "";
          btnToggle.textContent = "Voir moins";
        } else {
          synoContent.textContent = firstSentenceText;
          synoEllipsis.textContent = "...";
          btnToggle.textContent = "Voir plus";
        }
      });

      synopsis.appendChild(btnToggle);
    }

    genre.innerHTML = "<strong>Genre :</strong> " + (anime.genres?.join(", ") || "Non renseigné");
    ranking.innerHTML = "<strong>Classement :</strong> " + (anime.ranking ?? "N/A");
    episodes.innerHTML = "<strong>Épisodes :</strong> " + (anime.episodes ?? "Inconnu");

     btnVoir.target = "_blank";
    btnVoir.rel = "noopener noreferrer";
    btnVoir.setAttribute("aria-busy", "true");
    btnVoir.setAttribute("aria-disabled", "true");
    btnVoir.className = "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-400 text-white cursor-wait opacity-80 pointer-events-none transition";

    // Spinner + label
    const spinner = document.createElement("span");
    spinner.className = "inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin";
    const label = document.createElement("span");
    label.textContent = "Chargement...";
    btnVoir.appendChild(spinner);
    btnVoir.appendChild(label);

    // Lien par défaut immédiat (fallback JustWatch)
    const fallback = `https://www.justwatch.com/fr/recherche?q=${encodeURIComponent(String(anime?.title || "").trim().replace(/\s+/g, "-"))}`;
    btnVoir.href = fallback;

    // Mise à jour asynchrone quand le lien réel est prêt (ne bloque pas l'affichage)
    buildWatchLink(anime)
      .then((url) => {
        if (url) btnVoir.href = url;
      })
      .finally(() => {
        // Etat prêt: styles actifs
        btnVoir.classList.remove("bg-gray-400", "cursor-wait", "opacity-80", "pointer-events-none");
        btnVoir.classList.add(
          "bg-blue-600", "hover:bg-blue-700", "cursor-pointer", "opacity-100", "pointer-events-auto",
          "focus:outline-none", "focus:ring-2", "focus:ring-blue-400"
        );
        btnVoir.removeAttribute("aria-busy");
        btnVoir.setAttribute("aria-disabled", "false");
        spinner.remove();
        label.textContent = "Voir l’anime";
      });

    // --- Insertion DOM ---
    conteneur.appendChild(titre);
    conteneur.appendChild(image);
    conteneur.appendChild(synopsis);
    conteneur.appendChild(genre);
    conteneur.appendChild(ranking);
    conteneur.appendChild(episodes);
    conteneur.appendChild(btnVoir);
    resultDiv.appendChild(conteneur);

    // --- Style ---
    conteneur.className =
      "bg-white shadow-lg rounded-2xl p-6 mb-6 w-full transform transition duration-500 ease-out opacity-0 translate-y-5";

    titre.className =
      "font-bold text-2xl mb-4 text-center text-blue-600";
    image.className =
      "rounded-lg shadow-md mb-4 max-w-md w-auto h-auto mx-auto object-contain";
    synopsis.className =
      "text-gray-700 text-justify mb-4";
    genre.className =
      "text-gray-600 italic mb-2";
    ranking.className =
      "font-semibold text-yellow-600 mb-2";
    episodes.className =
      "font-medium text-gray-800";

    // --- Animation ---
    setTimeout(() => {
      conteneur.classList.remove("opacity-0", "translate-y-5");
      conteneur.classList.add("opacity-100", "translate-y-0");
    }, i * 150);
  };
}




// buildWatchLink a été déplacé dans lien-anime.js

function applyCardTheme(card, mode) {
  if (mode === "dark") {
    card.classList.add("bg-gray-700", "text-white");
    card.classList.remove("bg-white");
  } else {
    card.classList.remove("bg-gray-700", "text-white");
    card.classList.add("bg-white");
  }

  // Titre
  const h2 = card.querySelector("h2");
  if (h2) {
    if (mode === "dark") {
      if (h2.classList.contains("text-blue-600")) {
        h2.classList.replace("text-blue-600", "text-blue-300");
      }
    } else {
      if (h2.classList.contains("text-blue-300")) {
        h2.classList.replace("text-blue-300", "text-blue-600");
      }
    }
  }

  // Paragraphes (synopsis, genre, ranking, episodes)
  card.querySelectorAll("p").forEach((p) => {
    if (mode === "dark") {
      if (p.classList.contains("text-gray-700")) p.classList.replace("text-gray-700", "text-gray-300");
      if (p.classList.contains("text-gray-600")) p.classList.replace("text-gray-600", "text-gray-400");
      if (p.classList.contains("text-gray-800")) p.classList.replace("text-gray-800", "text-gray-200");
      if (p.classList.contains("text-yellow-600")) p.classList.replace("text-yellow-600", "text-yellow-300");
    } else {
      if (p.classList.contains("text-gray-300")) p.classList.replace("text-gray-300", "text-gray-700");
      if (p.classList.contains("text-gray-400")) p.classList.replace("text-gray-400", "text-gray-600");
      if (p.classList.contains("text-gray-200")) p.classList.replace("text-gray-200", "text-gray-800");
      if (p.classList.contains("text-yellow-300")) p.classList.replace("text-yellow-300", "text-yellow-600");
    }
  });
}

export function clearResult() {
  let resultDiv = document.getElementById("result");
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }
  resultDiv.classList.add("hidden");
}


// Dark/Light Mode
export function switchModeCss(){
  const body = document.getElementById("body");
  let resultDiv = document.getElementById("result");
  let formDiv = document.getElementById("animeForm");
  let box = document.querySelectorAll(".box");
  let img = document.querySelectorAll(".img");

  let label = document.querySelectorAll("label");
  console.log(label);

  let color = sessionStorage.getItem("mode");
  if(color == "dark"){

    //Affichage Résultat en dark
    resultDiv.classList.add('bg-gray-700');
    resultDiv.classList.add('text-white');

    Array.from(resultDiv.children || []).forEach((child)=>{
      child.classList.add('bg-gray-700');
      child.classList.remove('bg-white');
      child.classList.add('text-white');
      child.classList.remove('text-gray-700');

      applyCardTheme(child, "dark");
    });

    //Affichage formulaire en dark
    formDiv.classList.add('bg-gray-700');
    formDiv.classList.add('text-white');

    label.forEach((e)=>{
      e.classList.add('text-white');
      e.classList.remove('text-gray-700');

    })  
    box.forEach((e)=>{
      e.classList.add("bg-gray-900");
      e.classList.remove("border-gray-300");
    })

    img.forEach((e)=>{
      e.classList.toggle("hidden");
    })

    body.classList.add('bg-gray-800');
    body.classList.remove('bg-gray-100');
    console.log(color);

  }

  if(color == "light"){

    //Affichage Résultat en light
    resultDiv.classList.remove('bg-gray-700');
    resultDiv.classList.remove('text-white');

    Array.from(resultDiv.children || []).forEach((child)=>{
      child.classList.remove('bg-gray-700');
      child.classList.add('bg-white');
      child.classList.remove('text-white');
      child.classList.add('text-gray-700');

      applyCardTheme(child, "light");
    });

    //Affichage formulaire en light
    formDiv.classList.remove('bg-gray-700');
    formDiv.classList.remove('text-white');

    label.forEach((e)=>{
      e.classList.remove('text-white');
      e.classList.add('text-gray-700');

    })
    img.forEach((e)=>{
      e.classList.toggle("hidden");
    })

    box.forEach((e)=>{
      e.classList.remove("bg-gray-900");
      e.classList.add("border-gray-300");
    })
   

    //Affichage body en light
    body.classList.add('bg-gray-100');
    body.classList.remove('bg-gray-800');

  }
}

// Extrait la première phrase d’un texte
function getFirstSentence(text) {
  const t = String(text || "").trim();

  // Cherche le premier caractère de fin de phrase (. ! ? ou ponctuation JP)
  const endIdx = findFirstSentenceEnd(t);
  if (endIdx !== -1) {
    const first = t.slice(0, endIdx + 1).trim();
    return { first, hasMore: first.length < t.length };
  }

  // Pas de ponctuation -> coupe à 160 caractères max
  const max = 160;
  if (t.length > max) {
    const cut = t.slice(0, max);
    // évite de couper au milieu d’un mot si possible
    const lastSpace = cut.lastIndexOf(" ");
    const first = (lastSpace > 50 ? cut.slice(0, lastSpace) : cut).trim();
    return { first, hasMore: true };
  }

  return { first: t, hasMore: false };
}

function findFirstSentenceEnd(t) {
  // Liste des ponctuations possibles de fin de phrase
  const endChars = [".", "!", "?", "。", "！", "？"];
  for (let i = 0; i < t.length; i++) {
    if (endChars.includes(t[i])) return i;
  }
  return -1;
}
