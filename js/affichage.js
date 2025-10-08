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
    resultDiv.classList.add('bg-gray-700');
    resultDiv.classList.add('text-white');

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
