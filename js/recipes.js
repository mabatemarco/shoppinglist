let apiKey = '6H134A6LKGCYegNQSebrFu36RM0uI221';
let random = 'https://api2.bigoven.com/recipes/top25random?';
let specific = 'https://api2.bigoven.com/recipes/';
let categoryInput = document.querySelector('#dish');
let iIngredientsInput = document.querySelector('#iIngredients');
let eIngredientsInput = document.querySelector('#eIngredients');
let cuisineInput = document.querySelector('#cuisine');
let boxesInput = document.querySelectorAll('input[type=checkbox]');
let submit = document.querySelector('#submit');
let idArray = [];

submit.addEventListener('click', search);

async function search() {
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
  console.log(random)
  let response = await axios.get(`${random}&api_key=${apiKey}`);
  console.log(response)
  populate(response.data.Results)
}

function populate(data) {
  console.log(data)
  document.querySelector('.selection').style.display = "none";
  document.querySelector('.choices').style.display = "flex";
  document.querySelector('.choices').style.flexWrap = "wrap";
  document.querySelector('.choices').style.justifyContent = "space-around";
  for (let i = 0; i < 12; i++) {
    let div = document.createElement('div');
    div.classList.add('choice');
    div.innerHTML = `<h2>${data[i].Title}</h2><img src = ${data[i].PhotoUrl}><p>Servings - ${data[i].Servings}</p>`;
    div.addEventListener('click', function () { select(div, data[i].RecipeID) });
    document.querySelector('.choices').appendChild(div);
  }
  let finalize = document.createElement('button');
  finalize.innerHTML = "Confirm Choices";
  finalize.addEventListener('click', finalLists);
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

function finalLists() {
  document.querySelector('.choices').style.display = "none";
  document.querySelector('.results').style.display = "flex";
  document.querySelector('.results').style.justifyContent = "space-around";
  idArray.forEach(async function (current) {
    let response = await axios.get(`${specific}${current}?api_key=${apiKey}`);
    console.log(response)
  })
}