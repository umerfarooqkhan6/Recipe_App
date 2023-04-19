const searchForm = document.querySelector("form");
const searchResultDiv = document.querySelector(".search-result");
const container = document.querySelector(".container");

let searchQuery = "";
const APP_key = "aa4850b798184e7882e8b74dfa862e64";

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector("input").value;
  fetchAPI();
});


fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${APP_key}&number=5`)
.then((data)=>data.json())
.then(data => storing(data.results))

function storing(data){
  let storedData=JSON.stringify(data);
  localStorage.setItem("foodData21",storedData);
  }

let data = JSON.parse(localStorage.getItem("foodData21"));

console.log(data);
recipes = document.querySelector(".search-result");

recipes.innerHTML = data.map((sPro, index) => {
  return `
  <div class="item">
    <img src="${sPro.image}" alt="" />
    <div class="flex-container">
      <h1 class="title">${sPro.title}</h1>
      <a class="view-button" href="" target="_blank">View Recipe</a>
    </div>
    <p class="item-data">Ingredients:</p>
    <p class="item_data2">Rice,Meat,Butter</p>
  </div>
  

    `;
});


  

async function fetchAPI() {
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}&apiKey=${APP_key}&number=5`;
  const response = await fetch(baseURL);
  const data = await response.json();
  
  generateHTML(data.results);
}


function generateHTML(results) {
  let generatedHTML = "";

  results.forEach((result) => {
    generatedHTML += `<div class="item">
        <img src="${result.image}" alt="">
        <div class="flex-container">
          <h1 class="title">${result.title}</h1>
          <a class="view-button" id="ingredientInfo_${result.id}" href="#">View Recipe</a>
        </div>
        <p class="item-data">Ingredients:</p>
        <p class="item-data2" class="para_colour" id="pIngredients_${result.id}">Calories: 120</p>
      </div>`;

    fetchAPI1(result);
    recipeInfo(result);
  });

  searchResultDiv.innerHTML = generatedHTML;
}

async function fetchAPI1(result) {
  console.log(result.id);
  const baseURL1 = `https://api.spoonacular.com/recipes/${result.id}/ingredientWidget.json?apiKey=${APP_key}`;
  const response1 = await fetch(baseURL1);
  const data1 = await response1.json();

  let ingArr = data1.ingredients;

  let ingElement = [];
  ingArr.forEach((element) => {
    ingElement.push(element.name);
  });

  console.log(ingElement);

  console.log(document.getElementById(`pIngredients_${result.id}`));
  document.getElementById(`pIngredients_${result.id}`).innerHTML = ingElement;
}

async function recipeInfo(result) {
  const baseURL2 = `https://api.spoonacular.com/recipes/${result.id}/analyzedInstructions?apiKey=${APP_key}`;
  const response2 = await fetch(baseURL2);
  const data2 = await response2.json();

  document
    .getElementById(`ingredientInfo_${result.id}`)
    .addEventListener("click", () => {
      myfunc(data2, result);
    });
}
function myfunc(data2, result) {
  let arr = data2[0].steps;
  let arrInfo = [];
  arr.forEach((element) => {
    arrInfo.push(element.step);
  });

  document.getElementById("search_result").innerHTML = `
        <div class="recipe_information">
        <h3>Information</h3>
        
        <img class="info_img" src="${result.image}" alt="">
            <p id="item-data1">Title</p>
            <p class="item-data">${result.title}</p>
            <p id="item-data1">Ingredients</p>
            <p class="item-data" id="pIngredients_${result.id}"></p>
            <p id="item-data1">Steps for making Recipe</p>
            <p class="item-data">${arrInfo}</p>
    </div>`;
  fetchAPI1(result);
}
