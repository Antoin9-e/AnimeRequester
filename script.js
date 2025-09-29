console.log("hello");
const key = '23581e0e60mshf94250b663de525p1cd632jsn7bbe7b3e4a81';
const host = 'anime-db.p.rapidapi.com';



const connexionBtn = document.getElementById('connexion');

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
	const result = await response.text();
	console.log(result);
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
        console.log(result);
    } catch (error) {
        console.error(error);
    }
    
};
