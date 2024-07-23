document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('searchBox');
    const cocktailContainer = document.getElementById('cocktailContainer');
    const cocktailModal = document.getElementById('cocktailModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close');
    const favouritesButton = document.getElementById('favouritesButton');
    
    searchBox.addEventListener('input', () => {
    const query = searchBox.value;
    if (query.length === 1) {
    fetchCocktails(query);
    }
     });
    
    closeModal.addEventListener('click', () => {
    cocktailModal.style.display = 'none';
    });
     favouritesButton.addEventListener('click', showFavourites);
     window.onclick = (event) => {
     if (event.target === cocktailModal) {
    cocktailModal.style.display = 'none';
     }
     };
     async function fetchCocktails(query) {
     try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${query}`);
     if (!response.ok) {
     throw new Error(`HTTP error! status: ${response.status}`);
    }
     const data = await response.json();
     displayCocktails(data.drinks);
     } catch (error) {
     console.error('Error fetching cocktails:', error);
     cocktailContainer.innerHTML = '<p>Failed to fetch cocktails. Please try again later.</p>';
     }
    }
     
    function displayCocktails(cocktails) {
     cocktailContainer.innerHTML = '';
     if (cocktails) {
     cocktails.forEach(cocktail => {
    const cocktailDiv = document.createElement('div');
     cocktailDiv.className = 'cocktail';
     cocktailDiv.innerHTML = `
     <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
    <h2>${cocktail.strDrink}</h2>
     `;
     cocktailDiv.addEventListener('click', () => showCocktailDetails(cocktail));
     cocktailContainer.appendChild(cocktailDiv);
     });
     } else {
     cocktailContainer.innerHTML = '<p>No cocktails found.</p>';
    }
     }
     function showCocktailDetails(cocktail) {
    const ingredients = [];
     for (let i = 1; i <= 15; i++) {
     if (cocktail[`strIngredient${i}`]) {
     ingredients.push(`${cocktail[`strIngredient${i}`]} - ${cocktail[`strMeasure${i}`] || ''}`);
     } else {
     break;
     }
     }
     modalContent.innerHTML = `
     <h2>${cocktail.strDrink}</h2>
     <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
     <h3>Ingredients:</h3>
     <ul>${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
     <h3>Instructions:</h3>
     <p>${cocktail.strInstructions}</p>
     <button id="saveButton">♥</button>
     `;
    document.getElementById('saveButton').addEventListener('click', () => saveToFavourites(cocktail));
    cocktailModal.style.display = 'block';
     }
    function saveToFavourites(cocktail) {
     let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
     favourites.push(cocktail);
     localStorage.setItem('favourites', JSON.stringify(favourites));
     alert('Cocktail saved to favourites!');
     }
     function showFavourites() {
     let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
     if (favourites.length > 0) {
     displayCocktails(favourites);
     } else {
     cocktailContainer.innerHTML = '<p>No favourite cocktails saved.</p>';
     }
     }
    });