import { searchTitle, searchId, searchClass } from "./api.js";
import {
  afficherResultat,
  afficherResultatIdorClass,
  clearResult,
} from "./affichage.js";
const clearBtn = document.getElementById("clear");
const connexionBtn = document.getElementById("connexion");

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
