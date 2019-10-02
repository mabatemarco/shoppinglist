let apiKey = '6H134A6LKGCYegNQSebrFu36RM0uI221';
let random = 'https://api2.bigoven.com/recipes/top25random?';
let specific = 'https://api2.bigoven.com/recipe/';
let instructions = document.querySelector('.instructions');
let categoryInput = document.querySelector('#dish');
let iIngredientsInput = document.querySelector('#iIngredients');
let eIngredientsInput = document.querySelector('#eIngredients');
let cuisineInput = document.querySelector('#cuisine');
let boxesInput = document.querySelectorAll('input[type=checkbox]');
let submit = document.querySelector('#submit');
let idArray = [];
var ingredients = [];

submit.addEventListener('click', search);

async function search() {
  submit.style.display = 'none'
  document.querySelector('.loader').style.display = 'block'
  let category = categoryInput.options[categoryInput.selectedIndex].value;
  let iIngredients = iIngredientsInput.value;
  let eIngredients = eIngredientsInput.value;
  let cuisine = cuisineInput.options[cuisineInput.selectedIndex].value;
  let boxes = [];
  for (let i = 0; i < 5; i++) {
    if (boxesInput[i].checked) {
      boxes.push(boxesInput[i].value)
    }
  };
  random = `${random}include_primarycat=${category}`;
  if (iIngredients) {
    iIngredients = iIngredients.replace(' ', '%20').replace(', ', '%2c%20');
    random = `${random}&include_ing=${iIngredients}`;
  };
  if (eIngredients) {
    eIngredients = eIngredients.replace(' ', '%20').replace(', ', '%2c%20');
    random = `${random}&exclude_ing=${eIngredients}`;
  };
  if (cuisine) {
    random = `${random}&cuisine=${cuisine}`
  };
  if (boxes.includes("gluten")) {
    random = `${random}&glf=1`
  };
  if (boxes.includes("nut")) {
    random = `${random}&tnf=1&ntf=1`
  };
  if (boxes.includes("shellfish")) {
    random = `${random}&slf=1`
  };
  if (boxes.includes("vegetarian")) {
    random = `${random}&vtn=1`
  };
  if (boxes.includes("vegan")) {
    random = `${random}&vgn=1`
  };
  let response = await axios.get(`${random}&photos=true&api_key=${apiKey}`);
  populate(response.data.Results)
}

function populate(data) {
  document.querySelector('.selection').style.display = "none";
  document.querySelector('.choices').style.display = "flex";
  document.querySelector('.choices').style.flexWrap = "wrap";
  document.querySelector('.choices').style.justifyContent = "space-around";
  instructions.innerHTML = "Pick Your Meals"
  for (let i = 0; i < 12; i++) {
    let div = document.createElement('div');
    div.classList.add('choice');
    div.innerHTML = `<h2>${data[i].Title}</h2><img src = ${data[i].PhotoUrl}><p>Servings - ${data[i].Servings}</p>`;
    div.addEventListener('click', function () { select(div, data[i].RecipeID) });
    document.querySelector('.choices').appendChild(div);
  }
  let finalize = document.createElement('button');
  finalize.innerHTML = "Confirm Choices";
  finalize.addEventListener('click', finalList);
  document.querySelector('.choices').appendChild(finalize);
}

function select(div, id) {
  div.classList.toggle('picked');
  if (idArray.includes(id)) {
    var index = idArray.indexOf(id);
    idArray.splice(index, 1);
  } else {
    idArray.push(id);
  }
}

async function finalList() {
  instructions.innerHTML = "Enjoy";
  document.querySelector('.choices').style.display = "none";
  document.querySelector('.results').style.display = "flex";
  for (let i = 0; i < idArray.length; i++) {
    let response = await axios.get(`${specific}${idArray[i]}?api_key=${apiKey}`)
    let div = document.createElement('div');
    div.classList.add('finalrecipe');
    div.innerHTML = `<img src=${response.data.PhotoUrl}><h2>${response.data.Title}</h2><a target ="_blank" href=${response.data.WebURL}>View the Recipe</a>`;
    document.querySelector('.finalrecipes').appendChild(div);
    response.data.Ingredients.forEach(function (ing) {
      let obj = {
        name: ing.Name,
        amount: ing.Quantity,
        unit: ing.Unit
      };
      ingredients.push(obj);
    })
    if (i === (idArray.length - 1)) {
      shopping();
    }
  }
};

function shopping() {
  let shoppingList = [];
  let found;
  for (let n = 0; n < ingredients.length; n++) {
    found = false;
    if (n === 0) {
      shoppingList.push(ingredients[n]);
    } else {
      for (i = 0; i < shoppingList.length; i++) {
        if (ingredients[n].name === shoppingList[i].name) {
          shoppingList[i].amount += ingredients[n].amount;
          found = true;
        };
      };
      if (found === false) {
        shoppingList.push(ingredients[n])
      }
    };
  };
  let toBuy = document.querySelector('#toBuy');
  shoppingList.forEach(function (food) {
    let item = document.createElement('li');
    item.innerHTML = `${food.amount} ${food.unit} ${food.name}`;
    toBuy.appendChild(item);
  })
};