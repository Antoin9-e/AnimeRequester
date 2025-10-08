export function afficherResultat(result) {
  clearResult();

  let resultDiv = document.getElementById("result");
  resultDiv.classList.remove("hidden");

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

export function clearResult() {
  let resultDiv = document.getElementById("result");
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }
  resultDiv.classList.add("hidden");
}
