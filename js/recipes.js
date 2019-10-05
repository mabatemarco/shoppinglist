let apiKey = '6H134A6LKGCYegNQSebrFu36RM0uI221';
let random = 'https://api2.bigoven.com/recipes/top25random?';
let specific = 'https://api2.bigoven.com/recipe/';
let instructions = document.querySelector('.instructions');
let iIngredientsInput = document.querySelector('#iIngredients');
let eIngredientsInput = document.querySelector('#eIngredients');
let cuisineInput = document.querySelector('#cuisine');
let boxesInput = document.querySelectorAll('input[type=checkbox]');
let submit = document.querySelector('#submit');
let idArray = [];
var ingredients = [];
let body = document.querySelector('.allMeals')

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
  let iIngredients = iIngredientsInput.value;
  let eIngredients = eIngredientsInput.value;
  let cuisine = cuisineInput.options[cuisineInput.selectedIndex].value;
  let boxes = [];
  for (let i = 0; i < 5; i++) {
    if (boxesInput[i].checked) {
      boxes.push(boxesInput[i].value)
    }
  };
  let preferences = '';
  let restrictions = '';
  if (iIngredients) {
    iIngredients = iIngredients.replace(' ', '%20').replace(', ', '%2c%20');
    preferences = `${preferences}&include_ing=${iIngredients}`;
  };
  if (eIngredients) {
    eIngredients = eIngredients.replace(' ', '%20').replace(', ', '%2c%20');
    restrictions = `${restrictions}&exclude_ing=${eIngredients}`;
  };
  if (cuisine) {
    preferences = `${preferences}&cuisine=${cuisine}`
  };
  if (boxes.includes("gluten")) {
    restrictions = `${restrictions}&glf=1`
  };
  if (boxes.includes("nut")) {
    restrictions = `${restrictions}&tnf=1&ntf=1`
  };
  if (boxes.includes("shellfish")) {
    restrictions = `${restrictions}&slf=1`
  };
  if (boxes.includes("vegetarian")) {
    restrictions = `${restrictions}&vtn=1`
  };
  if (boxes.includes("vegan")) {
    restrictions = `${restrictions}&vgn=1`
  };
  let main = await axios.get(`${random}include_primarycat=maindish${preferences}${restrictions}&photos=true&api_key=${apiKey}`);
  let side = await axios.get(`${random}include_primarycat=sidedish&cuisine=${cuisine}${restrictions}&photos=true&api_key=${apiKey}`);
  let dessert = await axios.get(`${random}include_primarycat=desserts${restrictions}&photos=true&api_key=${apiKey}`);
  populate(main.data.Results, side.data.Results, dessert.data.Results)
}

function populate(main, side, dessert) {
  document.querySelector('.selection').style.display = "none";
  document.querySelector('.allMeals').style.display = "block"
  instructions.innerHTML = "Pick Your Meals";
  let mainh3 = document.createElement('h3');
  mainh3.innerHTML = 'Main Courses';
  body.insertBefore(mainh3, body.childNodes[0]);
  let sideh3 = document.createElement('h3');
  sideh3.innerHTML = 'Side Dishes';
  body.insertBefore(sideh3, body.childNodes[3]);
  let desserth3 = document.createElement('h3');
  desserth3.innerHTML = 'Desserts';
  body.insertBefore(desserth3, body.childNodes[6]);
  if (main.length < 8) {
    for (let i = 0; i < main.length; i++) {
      let div = document.createElement('div');
      div.classList.add('choice');
      div.innerHTML = `<h2>${main[i].Title}</h2><img src = ${main[i].PhotoUrl}><p>Servings - ${main[i].Servings}</p>`;
      div.addEventListener('click', function () { select(div, main[i].RecipeID) });
      document.querySelector('#mainChoices').appendChild(div);
    }
  } else {
    for (let i = 0; i < 8; i++) {
      let div = document.createElement('div');
      div.classList.add('choice');
      div.innerHTML = `<h2>${main[i].Title}</h2><img src = ${main[i].PhotoUrl}><p>Servings - ${main[i].Servings}</p>`;
      div.addEventListener('click', function () { select(div, main[i].RecipeID) });
      document.querySelector('#mainChoices').appendChild(div);
    };
    if (side.length < 8) {
      for (let i = 0; i < side.length; i++) {
        let div = document.createElement('div');
        div.classList.add('choice');
        div.innerHTML = `<h2>${side[i].Title}</h2><img src = ${side[i].PhotoUrl}><p>Servings - ${side[i].Servings}</p>`;
        div.addEventListener('click', function () { select(div, side[i].RecipeID) });
        document.querySelector('#sideChoices').appendChild(div);
      }
    } else {
      for (let i = 0; i < 8; i++) {
        let div = document.createElement('div');
        div.classList.add('choice');
        div.innerHTML = `<h2>${side[i].Title}</h2><img src = ${side[i].PhotoUrl}><p>Servings - ${side[i].Servings}</p>`;
        div.addEventListener('click', function () { select(div, side[i].RecipeID) });
        document.querySelector('#sideChoices').appendChild(div);
      }
    };
    if (dessert.length < 8) {
      for (let i = 0; i < dessert.length; i++) {
        let div = document.createElement('div');
        div.classList.add('choice');
        div.innerHTML = `<h2>${dessert[i].Title}</h2><img src = ${dessert[i].PhotoUrl}><p>Servings - ${dessert[i].Servings}</p>`;
        div.addEventListener('click', function () { select(div, dessert[i].RecipeID) });
        document.querySelector('#dessertChoices').appendChild(div);
      }
    } else {
      for (let i = 0; i < 8; i++) {
        let div = document.createElement('div');
        div.classList.add('choice');
        div.innerHTML = `<h2>${dessert[i].Title}</h2><img src = ${dessert[i].PhotoUrl}><p>Servings - ${dessert[i].Servings}</p>`;
        div.addEventListener('click', function () { select(div, dessert[i].RecipeID) });
        document.querySelector('#dessertChoices').appendChild(div);
      }
    }
  };
  let finalize = document.createElement('button');
  finalize.innerHTML = "Confirm Choices";
  finalize.addEventListener('click', finalList);
  document.querySelector('.allMeals').appendChild(finalize);
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
  body.style.display = "none";
  document.querySelector('.results').style.display = "flex";
  document.querySelector('.results').style.flexWrap = "wrap"
  document.querySelector('#date').innerHTML += ` (${curDay()})`
  for (let i = 0; i < idArray.length; i++) {
    let response = await axios.get(`${specific}${idArray[i]}?api_key=${apiKey}`)
    let div = document.createElement('div');
    div.classList.add('finalrecipe');
    div.innerHTML = `<img src=${response.data.PhotoUrl}><h2>${response.data.Title}</h2><a target ="_blank" href=${response.data.WebURL}>View Recipe</a>`;
    document.querySelector('.finalrecipes').appendChild(div);
    response.data.Ingredients.forEach(function (ing) {
      let amt = ing.Quantity.toString();
      if (amt.length > 5) {
        amt = parseFloat(amt).toFixed(2);
      }
      let obj = {
        name: ing.Name,
        amount: amt,
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



function save() {
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
  } else if (ingredients.length < 186) {
    for (let i = 0; i < 61; i++) {
      listItems += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
    };
    for (let i = 61; i < 123; i++) {
      listItems2 += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
    };
    for (let i = 123; i < ingredients.length; i++) {
      listItems3 += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
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
    for (let i = 185; i < ingredients.length; i++) {
      listItems4 += `${ingredients[i].amount} ${ingredients[i].unit} ${ingredients[i].name} \n `
    }
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