const host = "anime-db.p.rapidapi.com";

let key =null;

const api ="23581e0e60mshf94250b663de525p1cd632jsn7bbe7b3e4a81";

export async function searchTitle(name) {
  const url = `https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=${name}`;
  return await fetchData(url);
}

export async function searchId(id) {
  const url = `https://anime-db.p.rapidapi.com/anime/by-id/${id}`;
  return await fetchData(url);
}

export async function searchClass(rank) {
  const url = `https://anime-db.p.rapidapi.com/anime/by-ranking/${rank}`;
  return await fetchData(url);
}

export async function getKey() {

  key = window.sessionStorage.getItem("key");
  let resp;
  if (key == null){
    resp = window.prompt("Veuillez entrer votre clé api :");
    window.sessionStorage.setItem("key",resp);
  }
  
}

async function fetchData(url) {

  key = window.sessionStorage.getItem("key");
  let resp;

  if (key == null){
    resp = window.prompt("Veuillez entrer votre clé api :");
    window.sessionStorage.setItem("key",resp);
  }
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": host,
    },
  };

  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    alert('Erreur de requete' + error);
    console.error("Erreur API:", error);
    throw error;
  }
}
