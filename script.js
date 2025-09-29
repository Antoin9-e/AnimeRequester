console.log("hello");
const key = '23581e0e60mshf94250b663de525p1cd632jsn7bbe7b3e4a81';
const host = 'anime-db.p.rapidapi.com';


const connexionBtn = document.getElementById('connexion');

connexionBtn.addEventListener("click",()=>{
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
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}
    
};