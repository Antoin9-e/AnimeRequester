import { searchTitle, searchId, searchClass, getKey, getGenreList, searchGenre } from "./api.js";
import {
  afficherResultat,
  clearResult,
  switchModeCss,
} from "./affichage.js";
import MultiSelectDropdown from "./dropdown.js";
const clearBtn = document.getElementById("clear");
const connexionBtn = document.getElementById("connexion");
const listGenre = []
const switchBtn = document.getElementById("switchMode");
const genreContent = document.getElementById("genreContent");
const genreWrapper = document.getElementById("genreWrapper");
const paramWrapper = document.getElementById("paramWrapper");
let clicked = false;
let genreDropdown;


document.addEventListener('DOMContentLoaded',  async function() {
  const request = await getGenreList();

  for(let i = 0 ; i < request.length ; i++){
    listGenre.push(request[i]._id);
    
  }

  if (genreContent) {
    genreDropdown = new MultiSelectDropdown(genreContent, { options: listGenre, placeholder: 'Choisir des genres' });
    if (genreWrapper) genreWrapper.classList.add('hidden');
    if (paramWrapper) paramWrapper.classList.add('hidden');
    try { window.genreDropdown = genreDropdown; } catch(e) { /* ignore if modules block assignment */ }
    genreContent.addEventListener('change', (e) => {
      console.log('Genres sélectionnés:', e.detail);
    });
  }
})
// Show/hide genre dropdown when the search type select changes
const optSelect = document.getElementById('opt-select');
if (optSelect) {
  optSelect.addEventListener('change', () => {
    const defaultOption = document.getElementById('defaultOption');
    defaultOption.style.display = 'none';
    const val = optSelect.value || optSelect.options[optSelect.selectedIndex]?.value;
      const isGenre = (val === 'genre' || optSelect.options[optSelect.selectedIndex]?.text === 'Genre');
      if (genreWrapper) {
        if (isGenre) genreWrapper.classList.remove('hidden');
        else genreWrapper.classList.add('hidden');
      }
      if (paramWrapper) {
        if (isGenre) paramWrapper.classList.add('hidden');
        else paramWrapper.classList.remove('hidden');
      }
  });
}
switchBtn.addEventListener("click",() => {
  if(clicked){
    sessionStorage.setItem("mode","light");
    console.log("light mode");
    switchModeCss();
    clicked = false;
  }else{
    sessionStorage.setItem("mode","dark");
    console.log("dark mode");
    switchModeCss();
    clicked = true;
  }
  
})

clearBtn.addEventListener("click", () => {
  console.log("clear");
  clearResult();
});

connexionBtn.addEventListener("click", async () => {
  const name = document.getElementById("champsTitre").value;

  var par =
    document.getElementById("opt-select").options[
      document.getElementById("opt-select").selectedIndex
    ].text;

  event.preventDefault();
  console.log("Btn connexion");
  console.log(par);

  if (par == "Titre") {
  const result = await searchTitle(name);
  afficherResultat({ data: result.data });

} else if (par == "Identifiant") {
  const result = await searchId(name);
  afficherResultat({ data: [result] });

} else if (par == "Classement") {
  const result = await searchClass(name);
  afficherResultat({ data: [result] });

} else if (par == "Genre"){
  const selectedGenres = genreDropdown.getSelected();
  if (selectedGenres.length === 0) {
    alert("Veuillez sélectionner au moins un genre.");
    return;
  }
  const result = await searchGenre(selectedGenres);
  afficherResultat({ data: result.data });
}
else {
  alert("veuillez entrer le type de recherche !");
}

});


getKey();

