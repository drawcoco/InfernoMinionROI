NBR_MINION = 10;
EYEDROP = 0;
INFUS = 0;
CATCHER = 0;
INSTA_BUY = 0;
INSTA_SELL = 1;
FREE_WILL = 0;
POST_CARD = 0;
items = {
  // prix achat - prix vente - htmlElement display
  "GLOWSTONE_DUST_DISTILLATE": [1, 1, null],
  "BLAZE_ROD_DISTILLATE": [1, 1, null],
  "CRUDE_GABAGOOL_DISTILLATE": [1, 1, null],
  "MAGMA_CREAM_DISTILLATE": [1, 1, null],
  "NETHER_STALK_DISTILLATE": [1, 1, null],
  "ENCHANTED_GLOWSTONE_DUST": [1, 1, null],
  "ENCHANTED_BLAZE_POWDER": [1, 1, null],
  "CRUDE_GABAGOOL": [1, 1, null],
  "ENCHANTED_MAGMA_CREAM": [1, 1, null],
  "ENCHANTED_NETHER_STALK": [1, 1, null],
  "FUEL_GABAGOOL": [1, 1, null],
  "HEAVY_GABAGOOL": [1, 1, null],
  "HYPERGOLIC_GABAGOOL": [1, 1, null],
  "INFERNO_FUEL_BLOCK": [1, 1, null],
  "CAPSAICIN_EYEDROPS_NO_CHARGES": [1, 1, null],
  "CHILI_PEPPER": [1, 1, null],
  "REAPER_PEPPER": [1, 1, null],
  "INFERNO_VERTEX": [1, 1, null],
  "INFERNO_APEX": [1, 1, null],
  "VERY_CRUDE_GABAGOOL": [1, 1, null]
};
// Link [2] to each line in html
for(var key in items) {
  items[key][2] = document.getElementsByClassName(key)[0];
}

// Function for adding space of big numbers
function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); //I dont understand this regex but it works
  return parts.join(".");
}

/* Pourquoi ?
fetch('https://sky.shiiyu.moe/api/v2/profile/drawcoco')
.then(response => {
  if (!response.ok) {
    throw new Error('counldn\'t call API');
  }
  return response.json();
})
.then(data => {
  console.log(data);
})*/


fetch('https://api.hypixel.net/v2/skyblock/bazaar')
  .then(response => {
    if (!response.ok) {
      throw new Error('counldn\'t call API');
    }
    return response.json();
  })
  .then(data => {

    for (var key in items) {
      items[key][0] = Math.round(data['products'][key]['quick_status']['sellPrice'] * 10) / 10;
      items[key][1] = Math.round(data['products'][key]['quick_status']['buyPrice'] * 10) / 10;
      console.log(key);
      console.log(items)
      items[key][2].innerHTML = numberWithSpaces(items[key][0]) + " | " + numberWithSpaces(items[key][1]);
    }

    calcTable(0, 0, 0);
  })
  .catch(error => {
    console.log('Error: ', error);
  })


const eyedropCheckbox = document.getElementsByClassName('eyedrop')[0];
eyedropCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    EYEDROP = 1;
  }
  else {
    EYEDROP = 0;
  }
  calcTable()
})

const infusCheckbox = document.getElementsByClassName('mythrilInfusion')[0];
infusCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    INFUS = 1;
  }
  else {
    INFUS = 0;
  }
  calcTable()
})

const catcherCheckbox = document.getElementsByClassName('flyCatcher')[0];
catcherCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    CATCHER = 1;
  }
  else {
    CATCHER = 0;
  }
  calcTable()
})
const freeWillCheckbox = document.getElementsByClassName('freeWill')[0];
freeWillCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    FREE_WILL = 1;
  }
  else {
    FREE_WILL = 0;
  }
  calcTable()
})
const postCardCheckbox = document.getElementsByClassName('postCard')[0];
postCardCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    POST_CARD = 1;
  }
  else {
    POST_CARD = 0;
  }
  calcTable()
})

const instabuyCheckbox = document.getElementsByClassName('instabuy')[0];
instabuyCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    INSTA_BUY = 1;
  }
  else {
    INSTA_BUY = 0;
  }
  calcTable()
})

const instasellCheckbox = document.getElementsByClassName('instasell')[0];
instasellCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    INSTA_SELL = 0;
  }
  else {
    INSTA_SELL = 1;
  }
  calcTable()
})

function nbrMinionChanged(event) {
  console.log(event);
  if (event.value == "") {
    NBR_MINION = 0;
  }
  else {
    NBR_MINION = parseInt(event.value);
  }
  calcTable()
}

function calcTable()
{
  //Init of min/max for gradiant
  minVal = 9999999;
  maxVal = -9999999;

  tableau = document.getElementsByClassName('tableau')[0];
  var rows = tableau.rows;

  //-------------------- HEADER -------------------
  head = ["tier", "", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", ""];
  for(let a = 0; a < 14; a++) {
    rows[0].cells[a].innerHTML = head[a];
  }

  //-------------------- CALCULATE SPEEDS -------------------
  timeBetweenActions = ["1003", "982", "950", "919", "886", "855", "823", "792", "760", "728", "697"]; //Base time

  for (a = 0; a < 11; a++) {
    timeBetweenActions[a] = timeBetweenActions[a] / (1 + 0.18 * NBR_MINION + INFUS * 0.1 + CATCHER * 0.2 + FREE_WILL * 0.1 + POST_CARD * 0.05); // Time after no-fuels bonus
  }

  //temp
  speed = timeBetweenActions
  //-------------------- LINE 1 - NO FUEL -------------------
  rows[1].cells[0].innerHTML = "No fuel";
  for (let a = 0; a < 14; a++) {
    if (a > 1 && a < 13) {
      gabagoolGenerated = 24*60*60 / (2*timeBetweenActions[a-2]); // PARTIE GENERATION GABAGOOL BASE
      
      profit = Math.round((gabagoolGenerated * items["VERY_CRUDE_GABAGOOL"][INSTA_SELL] / 192) * 10) / 10;// ARRONDI A 0.1 PRES
      
      //Search of the min/max for gradiant
      if (parseFloat(profit) < minVal)
        minVal = parseFloat(profit);
      if (parseFloat(profit) > maxVal)
        maxVal = parseFloat(profit);
      
      // TODO
      rows[1].cells[a].innerHTML = profit //numberWithSpaces(profit) impossible de le faire car le gradiant cherche la valeur exacte pour la colorier
    }
  }
  
  elements = [
    ["Glowstone", "ENCHANTED_GLOWSTONE_DUST", "GLOWSTONE_DUST_DISTILLATE", 160, 2.5],
    ["Blaze Rod", "ENCHANTED_BLAZE_POWDER", "BLAZE_ROD_DISTILLATE", 160, 1],
    ["Gabagool", "VERY_CRUDE_GABAGOOL", "CRUDE_GABAGOOL_DISTILLATE", 192, 1],
    ["Magma cream", "ENCHANTED_MAGMA_CREAM", "MAGMA_CREAM_DISTILLATE", 160, 2],
    ["Nether wart", "ENCHANTED_NETHER_STALK", "NETHER_STALK_DISTILLATE", 160, 5]
  ]
  //-------------------- LINE 2 to 7 - FUEL FUEL -------------------
  rows[2].cells[0].innerHTML = "Fuel fuel";
  
  timeBetweenActionsWithBasicFuel = new Array(11);
  for (a = 0; a < 11; a++) {
    timeBetweenActionsWithBasicFuel[a] = timeBetweenActions[a] / (1 + 10); // Time after fuel bonus
  }
  for (let b = 0; b < 5; b++) {
    rows[3 + b].cells[1].innerHTML = elements[b][0];
    for(let a = 0; a < 14; a++) {
      if (a > 1 && a < 13) {
        gabagoolGenerated = 0.2 * 24*60*60 / (2*timeBetweenActionsWithBasicFuel[a-2]);
        otherItemGenerated = 4 * gabagoolGenerated;
        
        profit = gabagoolGenerated * items["VERY_CRUDE_GABAGOOL"][INSTA_SELL] / 192 + otherItemGenerated * elements[b][4] * items[elements[b][1]][INSTA_SELL] / elements[b][3];
        profit -= 6*items[elements[b][2]][INSTA_BUY] + items["FUEL_GABAGOOL"][INSTA_BUY] + 2*items["INFERNO_FUEL_BLOCK"][INSTA_BUY];
        
        profit = Math.round(profit*10) / 10;

        if (parseFloat(profit) < minVal)
          minVal = parseFloat(profit);
        if (parseFloat(profit) > maxVal)
          maxVal = parseFloat(profit);
        
        rows[3 + b].cells[a].innerHTML = profit;
      }
    }
  }

  //-------------------- LINE 8 to 13 - HEAVY FUEL -------------------
  rows[8].cells[0].innerHTML = "Heavy fuel";

  timeBetweenActionsWithHeavyFuel = new Array(11)
  for (a = 0; a < 11; a++) {
    timeBetweenActionsWithHeavyFuel[a] = timeBetweenActions[a] / (1 + 15); // Time after fuel bonus
  }

  for (let b = 0; b < 5; b++) {
    rows[9 + b].cells[1].innerHTML = elements[b][0];
    for(let a = 0; a < 14; a++) {
      if (a > 1 && a < 13) {
        gabagoolGenerated = 0.2 * 24*60*60 / (2*timeBetweenActionsWithHeavyFuel[a-2]);
        otherItemGenerated = 4 * gabagoolGenerated;
        
        profit = gabagoolGenerated * items["VERY_CRUDE_GABAGOOL"][INSTA_SELL] / 192 + otherItemGenerated * elements[b][4] * items[elements[b][1]][INSTA_SELL] / elements[b][3];
        profit -= 6*items[elements[b][2]][INSTA_BUY] + items["HEAVY_GABAGOOL"][INSTA_BUY] + 2*items["INFERNO_FUEL_BLOCK"][INSTA_BUY];
        
        profit = Math.round(profit*10) / 10;

        if (parseFloat(profit) < minVal)
          minVal = parseFloat(profit);
        if (parseFloat(profit) > maxVal)
          maxVal = parseFloat(profit);

        rows[9 + b].cells[a].innerHTML = profit;
      }
    }
  }

  //-------------------- LINE 14 to 20 - HYPERGOLIC FUEL -------------------
  rows[14].cells[0].innerHTML = "Hypergolic fuel";

  timeBetweenActionsWithHyperFuel = new Array(11)
  for (a = 0; a < 11; a++) {
    timeBetweenActionsWithHyperFuel[a] = timeBetweenActions[a] / (1 + 20); // Time after fuel bonus
  }

  for (let b = 0; b < 5; b++) {
    rows[15 + b].cells[1].innerHTML = elements[b][0];
    for(let a = 0; a < 14; a++) {
      if (a > 1 && a < 13) {
        gabagoolGenerated = 0.2 * 24*60*60 / (2*timeBetweenActionsWithHyperFuel[a-2]);
        otherItemGenerated = 4 * gabagoolGenerated;
        rollsRareDrops = gabagoolGenerated + otherItemGenerated // Rare drops are roll every gathering action

        profit = gabagoolGenerated * items["VERY_CRUDE_GABAGOOL"][INSTA_SELL] / 192 + otherItemGenerated * elements[b][4] * items[elements[b][1]][INSTA_SELL] / elements[b][3];
        profit += (1/136 * items["CHILI_PEPPER"][INSTA_SELL] + 
                  1/5950 * items["INFERNO_VERTEX"][INSTA_SELL] +
                  1/1309091 * (a > 10 ? 2 : 1) * items["INFERNO_APEX"][INSTA_SELL] +
                  1/458182 * items["REAPER_PEPPER"][INSTA_SELL]
                ) * rollsRareDrops * (1 + 0.3*EYEDROP) ;
        profit -= 6*items[elements[b][2]][INSTA_BUY] + items["HYPERGOLIC_GABAGOOL"][INSTA_BUY] + 2*items["INFERNO_FUEL_BLOCK"][INSTA_BUY];
        profit -= EYEDROP * items["CAPSAICIN_EYEDROPS_NO_CHARGES"][INSTA_BUY]

        profit = Math.round(profit*10) / 10;

        if (parseFloat(profit) < minVal)
          minVal = parseFloat(profit);
        if (parseFloat(profit) > maxVal)
          maxVal = parseFloat(profit);
        
        rows[15 + b].cells[a].innerHTML = profit;
      }
    }
  }


  n = Math.PI / 10;

  for (let b = 0; b < 20; b++) {
    for (let a = 0; a < 14; a++) {
      if (b == 0 || b == 2 || b == 8 || b == 14) {
        rows[b].cells[a].style.backgroundColor = "rgb(1, 1, 1)";
      }
      else {
        if (a == 0 || a == 1 || a == 13) {
          rows[b].cells[a].style.backgroundColor = "rgb(1, 1, 1)";
        }
        else {
          val = parseFloat(rows[b].cells[a].innerHTML);
          if (val < 0)
            rows[b].cells[a].style.backgroundColor = "rgb(" + (176 + (249-176) * Math.pow(val / minVal, n))  + ", " + (176 + (38-176) * Math.pow(val / minVal, n)) + ", " + (176 + (9-176) * Math.pow(val / minVal, n)) + ")";
          else
          rows[b].cells[a].style.backgroundColor = "rgb(" + (176 + (1-176) * Math.pow(val / maxVal, n))  + ", " + (176 + (212-176) * Math.pow(val / maxVal, n)) + ", " + (176 + (73-176) * Math.pow(val / maxVal, n)) + ")";
        }
      }
    }
  }
}