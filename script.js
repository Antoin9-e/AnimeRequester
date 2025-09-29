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
        afficherResultat(result)

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

        afficherResultat(result)
        console.log(result);
    } catch (error) {
        console.error(error);
    }
    
};


function afficherResultat(result){
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

function clearResult(){
    resultDiv = document.getElementById('result');
    resultDiv.removeAllChild();

}
