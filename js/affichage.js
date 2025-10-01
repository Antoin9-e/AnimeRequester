export function afficherResultat(result) {
  clearResult();

  console.log(result);

  let resultDiv = document.getElementById("result");
  resultDiv.classList.remove("hidden");

  for (let i = 0; i < result.data.length; i++) {
    const conteneur = document.createElement("div");
    const titre = document.createElement("h2");
    const image = document.createElement("img");
    const synopsis = document.createElement("p");
    const genre = document.createElement("p");
    const ranking = document.createElement("p");
    const episodes = document.createElement("p");
    resultDiv.appendChild(conteneur);
    titre.textContent = result.data[i].title;
    conteneur.appendChild(titre);
    image.src = result.data[i].image;
    conteneur.appendChild(image);
    synopsis.innerHTML =
      "<strong>Synopsis :</strong> " + result.data[i].synopsis;
    conteneur.appendChild(synopsis);

    genre.innerHTML = "<strong>Genre : </strong> " + result.data[i].genres;
    conteneur.appendChild(genre);
    ranking.innerHTML =
      "<strong>Classement :  </strong>" + result.data[i].ranking;
    conteneur.appendChild(ranking);
    episodes.innerHTML =
      " <strong> Nombre d'épisodes : </strong>" + result.data[i].episodes;
    conteneur.appendChild(episodes);

    conteneur.className +=
      " flex flex-col items-center justify-center border-b-2";
    image.className += "shadow-lg mt-5";
    titre.className += " font-bold text-2xl mb-2 text-center text-justify";
    episodes.className += "mb-5";
    synopsis.className += " text-justify mt-5 mb-5 md:w-[75%] text-center";
  }
}

export function afficherResultatIdorClass(result) {
  clearResult();
  console.log(result);

  let resultDiv = document.getElementById("result");
  resultDiv.classList.remove("hidden");

  const conteneur = document.createElement("div");
  const titre = document.createElement("h2");
  const image = document.createElement("img");
  const synopsis = document.createElement("p");
  const genre = document.createElement("p");
  const ranking = document.createElement("p");
  const episodes = document.createElement("p");
  resultDiv.appendChild(conteneur);
  titre.textContent = result.title;
  conteneur.appendChild(titre);
  image.src = result.image;
  conteneur.appendChild(image);
  synopsis.innerHTML = "<strong>Synopsis :</strong> " + result.synopsis;
  conteneur.appendChild(synopsis);

  genre.innerHTML = "<strong>Genre : </strong> " + result.genres;
  conteneur.appendChild(genre);
  ranking.innerHTML = "<strong>Classement : </strong>" + result.ranking;
  conteneur.appendChild(ranking);
  episodes.innerHTML =
    "<strong>Nombre d'épisodes :</strong> " + result.episodes;
  conteneur.appendChild(episodes);

  conteneur.className +=
    " flex flex-col items-center justify-center border-b-2";
  titre.className += " font-bold text-2xl mb-2 text-center text-justify";
  episodes.className += "mb-5";
  synopsis.className += " text-justify mt-5 mb-5 md:w-[75%]";
}

export function clearResult() {
  let resultDiv = document.getElementById("result");
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }

  resultDiv.className += " hidden";
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
