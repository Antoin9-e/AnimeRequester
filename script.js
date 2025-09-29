console.log("hello");
const key = '23581e0e60mshf94250b663de525p1cd632jsn7bbe7b3e4a81';
const host = 'anime-db.p.rapidapi.com';
const clearBtn = document.getElementById('clear');


const connexionBtn = document.getElementById('connexion');

clearBtn.addEventListener("click",()=>{
    console.log('clear');
    clearResult();
})

connexionBtn.addEventListener("click",()=>{
    var par = document.getElementById("opt-select").options[document.getElementById('opt-select').selectedIndex].text;

    event.preventDefault();
    console.log("Btn connexion")
    console.log(par);

    if(par == 'Titre'){
        searchTitle();
    }else if(par == 'Identifiant' ){
        searchId();
    }else if (par == 'Classement'){
        searchClass();
    }else{
        alert('veuillez entrer le type de recherche !')
    }
    
})


async function searchTitle(){

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
	afficherResultat(result);
} catch (error) {
	console.error(error);
}
    
};

async function searchId(){


    const id = document.getElementById('champsTitre').value;
    console.log(id);
    const url = `https://anime-db.p.rapidapi.com/anime/by-id/${id}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': key,
            'x-rapidapi-host': host
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        afficherResultatIdorClass(result)
        console.log(result);
    } catch (error) {
        console.error(error);
    }
    
};


async function searchClass(){


    const rank = document.getElementById('champsTitre').value;
    console.log(rank);
    const url = `https://anime-db.p.rapidapi.com/anime/by-ranking/${rank}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': key,
            'x-rapidapi-host': host
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        afficherResultatIdorClass(result)


      
        console.log(result);
    } catch (error) {
        console.error(error);
    }
    
};


function afficherResultat(result){
    
    clearResult();

	result = JSON.parse(result);
	console.log(result);
	
	let resultDiv = document.getElementById('result');
    resultDiv.classList.remove('hidden');

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
	synopsis.innerHTML = "<strong>Synopsis :</strong> " + result.data[i].synopsis;
	conteneur.appendChild(synopsis);
 
	genre.textContent = "Genre : " + result.data[i].genres;
	conteneur.appendChild(genre);
	ranking.textContent = "Classement : " + result.data[i].ranking;
	conteneur.appendChild(ranking);
	episodes.textContent = "Nombre d'épisodes : " + result.data[i].episodes;
	conteneur.appendChild(episodes);

    conteneur.className += ' flex flex-col items-center justify-center border-b-2';
    image.className += 'shadow-lg mt-5'
    titre.className += ' font-bold text-2xl mb-2 text-center text-justify';
    episodes.className += 'mb-5'
    synopsis.className += ' text-justify mt-5 mb-5 md:w-[75%] text-center'

	}
	
}


function afficherResultatIdorClass(result){
    
    clearResult();
	result = JSON.parse(result);
	console.log(result);
	
	let resultDiv = document.getElementById('result');
    resultDiv.classList.remove('hidden');

	
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
 
	genre.textContent = "Genre : " + result.genres;
	conteneur.appendChild(genre);
	ranking.textContent = "Classement : " + result.ranking;
	conteneur.appendChild(ranking);
	episodes.textContent = "Nombre d'épisodes : " + result.episodes;
	conteneur.appendChild(episodes);

    conteneur.className += ' flex flex-col items-center justify-center border-b-2';
    titre.className += ' font-bold text-2xl mb-2 text-center text-justify';
    episodes.className += 'mb-5'
    synopsis.className += ' text-justify mt-5 mb-5 md:w-[75%]'

	
	
}

function clearResult(){
    resultDiv = document.getElementById('result');
    while (resultDiv.firstChild) {
     resultDiv.removeChild(resultDiv.firstChild);
    }

    resultDiv.className += ' hidden';

}
