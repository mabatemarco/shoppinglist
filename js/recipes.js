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

let curDay = function () {
  today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return (`${mm}-${dd}-${yyyy}`);
};

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
  console.log(response)
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
  let found;
  instructions.innerHTML = "Enjoy!";
  document.querySelector('.choices').style.display = "none";
  document.querySelector('.results').style.display = "flex";
  document.querySelector('.results').style.flexWrap = "wrap"
  document.querySelector('#date').innerHTML += ` (${curDay()})`
  for (let i = 0; i < idArray.length; i++) {
    let response = await axios.get(`${specific}${idArray[i]}?api_key=${apiKey}`)
    let div = document.createElement('div');
    div.classList.add('finalrecipe');
    div.innerHTML = `<img src=${response.data.PhotoUrl}><h2>${response.data.Title}</h2><a target ="_blank" href=${response.data.WebURL}>View Recipe</a>`;
    document.querySelector('.finalrecipes').appendChild(div);
    console.log(response.data.Ingredients)
    response.data.Ingredients.forEach(function (ing) {
      let obj = {
        name: ing.Name,
        amount: ing.Quantity,
        unit: ing.Unit
      };
      if (ingredients.length === 0) {
        ingredients.push(obj);
      } else {
        found = false;
        for (n = 0; n < ingredients.length; n++) {
          if (obj.name === ingredients[n].name && obj.amount === ingredients[n].amount) {
            ingredients[n].amount += obj.amount;
            found = true;
          };
        };
        if (found === false) {
          ingredients.push(obj)
        }
      };
    })
  }
  ingredients.sort(function (a, b) {
    var keyA = a.name;
    var keyB = b.name;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  document.querySelector('#listLoad').style.display = "none";
  let toBuy = document.querySelector('#toBuy');
  ingredients.forEach(function (food) {
    let item = document.createElement('li');
    item.innerHTML = `${food.amount} ${food.unit} ${food.name}`;
    toBuy.appendChild(item);
  });
  let saveButton = document.createElement('button');
  saveButton.innerHTML = "Save as PDF";
  saveButton.addEventListener('click', function () { save(ingredients) });
  toBuy.appendChild(saveButton);
};



function save(ingredients) {
  let listItems = ' \n \n ';
  let listItems2 = ' \n \n ';
  let listItems3 = ' \n \n ';
  if (ingredients.length < 62) {
    for (let i = 0; i < ingredients.length; i++) {
      listItems += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
    }
  } else if (ingredients.length < 124) {
    for (let i = 0; i < 61; i++) {
      listItems += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
    };
    for (let i = 61; i < 123; i++) {
      listItems2 += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
    };
  } else {
    for (let i = 0; i < 61; i++) {
      listItems += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
    };
    for (let i = 61; i < 123; i++) {
      listItems2 += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
    };
    for (let i = 123; i < ingredients.length; i++) {
      listItems3 += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
    };
  }
  let page1 = 'Shopping List (' + curDay() + ')' + listItems
  let doc = new jsPDF();
  let pages = Math.ceil(ingredients.length / 62);
  doc.setFontSize(10);
  doc.text(page1, 20, 20);
  for (let i = 1; i < pages; i++) {
    let curPage = listItems + i
    doc.addPage();
    doc.setFontSize(10);
    doc.text(curPage, 20, 20)
  }
  let fileName = `ingredients${curDay()}.pdf`;
  doc.save(fileName);
}