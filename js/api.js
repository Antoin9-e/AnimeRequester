const key = "23581e0e60mshf94250b663de525p1cd632jsn7bbe7b3e4a81";
const host = "anime-db.p.rapidapi.com";

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

async function fetchData(url) {
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
