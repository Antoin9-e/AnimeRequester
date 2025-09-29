console.log("hello");
const key = '23581e0e60mshf94250b663de525p1cd632jsn7bbe7b3e4a81';
const host = 'anime-db.p.rapidapi.com';



const connexionBtn = document.getElementById('connexion');
let result;

connexionBtn.addEventListener("click",()=>{
    event.preventDefault();
    console.log("Btn connexion")
    
   SearchTitle();
})


async function SearchTitle(){

    const name = document.getElementById('champsTitre').value;
    console.log(name);

const url = `https://anime-db.p.rapidapi.com/anime?page=1&size=10&search= ${name}`;
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': key,
		'x-rapidapi-host': host
	}
};


try {
	const response = await fetch(url, options);
	result = await response.text();
	afficherResultat();
} catch (error) {
	console.error(error);
}
    
};

function afficherResultat(){
	result = JSON.parse(result);
	console.log(result);
	
	let resultDiv = document.getElementById('result');
	for (let i = 0; i < result.data.length; i++) {
	const titre = document.createElement("h2");
	const image = document.createElement("img");
	const synopsis = document.createElement("p");
	const genre = document.createElement("p");
	const ranking = document.createElement("p");
	const episodes = document.createElement("p");

	titre.textContent = result.data[i].title;
	resultDiv.appendChild(titre);
	image.src = result.data[i].image;
	resultDiv.appendChild(image);
	synopsis.textContent = "Synopsis : " + result.data[i].synopsis;
	resultDiv.appendChild(synopsis);
	genre.textContent = "Genre : " + result.data[i].genre;
	resultDiv.appendChild(genre);
	ranking.textContent = "Classement : " + result.data[i].ranking;
	resultDiv.appendChild(ranking);
	episodes.textContent = "Nombre d'épisodes : " + result.data[i].episodes;
	resultDiv.appendChild(episodes);
	}
	
}
