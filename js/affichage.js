export function afficherResultat(result) {
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

  result.data.forEach((anime, i) => {
    const conteneur = document.createElement("div");
    const titre = document.createElement("h2");
    const image = document.createElement("img");
    const synopsis = document.createElement("p");
    const genre = document.createElement("p");
    const ranking = document.createElement("p");
    const episodes = document.createElement("p");

    // --- Remplissage JSON ---
    titre.textContent = anime.title;
    image.src = anime.image;
    synopsis.innerHTML = "<strong>Synopsis :</strong> " + (anime.synopsis || "Non disponible");
    genre.innerHTML = "<strong>Genre :</strong> " + (anime.genres?.join(", ") || "Non renseigné");
    ranking.innerHTML = "<strong>Classement :</strong> " + (anime.ranking ?? "N/A");
    episodes.innerHTML = "<strong>Épisodes :</strong> " + (anime.episodes ?? "Inconnu");

    // --- Insertion DOM ---
    conteneur.appendChild(titre);
    conteneur.appendChild(image);
    conteneur.appendChild(synopsis);
    conteneur.appendChild(genre);
    conteneur.appendChild(ranking);
    conteneur.appendChild(episodes);
    resultDiv.appendChild(conteneur);

    // --- Style ---
    conteneur.className =
      "bg-white shadow-lg rounded-2xl p-6 mb-6 w-full transform transition duration-500 ease-out opacity-0 translate-y-5";
    if (isSingle) {
      conteneur.classList.remove("w-full");
      conteneur.classList.add("max-w-2xl", "mx-auto");
    }

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
  });
}

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
