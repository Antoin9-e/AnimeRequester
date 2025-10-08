import { searchTitle, searchId, searchClass, getKey, getGenreList } from "./api.js";
import {
  afficherResultat,
  clearResult,
  switchModeCss,
} from "./affichage.js";
const clearBtn = document.getElementById("clear");
const connexionBtn = document.getElementById("connexion");
const listGenre = []
const switchBtn = document.getElementById("switchMode");
const genreContent = document.getElementById("genreContent");
let clicked = false;


document.addEventListener('DOMContentLoaded',  async function() {
  const request = await getGenreList();

  for(let i = 0 ; i < request.length ; i++){
    listGenre.push(request[i]._id);
    
  }

  console.log(listGenre);
})
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
  genreContent.innerHTML = listGenre;

}else {
  alert("veuillez entrer le type de recherche !");
}

});


getKey();

