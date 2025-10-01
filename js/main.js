import { searchTitle, searchId, searchClass, getKey } from "./api.js";
import {
  afficherResultat,
  afficherResultatIdorClass,
  clearResult,
  switchModeCss,
} from "./affichage.js";
const clearBtn = document.getElementById("clear");
const connexionBtn = document.getElementById("connexion");

const switchBtn = document.getElementById("switchMode");
let clicked = false;

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
    afficherResultat(result);
  } else if (par == "Identifiant") {
    const result = await searchId(name);
    afficherResultatIdorClass(result);
  } else if (par == "Classement") {
    const result = await searchClass(name);
    afficherResultatIdorClass(result);
  } else {
    alert("veuillez entrer le type de recherche !");
  }
});


getKey();