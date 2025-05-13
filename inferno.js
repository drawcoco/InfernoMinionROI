NBR_MINION = 10;
EYEDROP = 0;
INFUS = 0;
CATCHER = 0;
INSTA_BUY = 0;
INSTA_SELL = 1;
COMPACTOR = 0;
FORMAT = 0

suffix = ["", "k", "m", "b"];

items = {
  // prix achat - prix vente - htmlElement display
  "GLOWSTONE_DUST_DISTILLATE": [1, 1, null],
  "BLAZE_ROD_DISTILLATE": [1, 1, null],
  "CRUDE_GABAGOOL_DISTILLATE": [1, 1, null],
  "MAGMA_CREAM_DISTILLATE": [1, 1, null],
  "NETHER_STALK_DISTILLATE": [1, 1, null],
  "GLOWSTONE_DUST": [1, 1, null],
  "BLAZE_ROD": [1, 1, null],
  "CRUDE_GABAGOOL": [1, 1, null],
  "MAGMA_CREAM": [1, 1, null],
  "NETHER_STALK": [1, 1, null],
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
      items[key][2].innerHTML = items[key][0] + " | " + items[key][1];
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

const compactorCheckbox = document.getElementsByClassName('compactor')[0];
compactorCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    COMPACTOR = 1;
  }
  else {
    COMPACTOR = 0;
  }
  calcTable()
})

const FormatCheckbox = document.getElementsByClassName('format')[0];
FormatCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    FORMAT = 1;
  }
  else {
    FORMAT = 0;
  }
  calcTable()
})

function formatNombre(nb) {
  lvl = 0;
  signe = 1;

  if (!FORMAT)
    return (nb)

  if (nb < 0) {
    signe = -1;
    nb *= -1;
  }
  while (nb > 1000 && lvl < 3)
  {
    nb /= 1000;
    lvl++;
  }
  nb = Math.round(nb*10*signe) / 10;
  return ( nb + suffix[lvl]);
}

function deFormatNombre(nb) {
  if (!FORMAT || (Number.isInteger(nb*10)))
    return (parseFloat(nb));
  
  test = nb.substr(-1, 1);
  lvl = suffix.indexOf(test);
  if (lvl > 0) {
    nb = nb.substr(0, nb.length - 1);
    nb *= (1000**lvl);
  }
  return (nb);
}

function nbrMinionChanged(event) {
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
  minVal = 9999999;
  maxVal = -9999999;

  tableau = document.getElementsByClassName('tableau')[0];
  var rows = tableau.rows;

  //-------------------- HEADER -------------------
  head = ["Tier", "", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  for(let a = 0; a < 13; a++) {
    rows[0].cells[a].innerHTML = head[a];
  }

  //-------------------- CALCULATE SPEEDS -------------------
  speed = ["1102", "1068", "1033", "999", "964", "930", "895", "861", "827", "792", "758"];
  for (a = 0; a < 11; a++) {
    speed[a] = speed[a] / (1 + 0.18 * NBR_MINION + INFUS * 0.1 + CATCHER * 0.2);
  }

  //-------------------- LINE 1 - NO FUEL -------------------
  rows[1].cells[0].innerHTML = "No fuel";
  for (let a = 0; a < 14; a++) {
    if (a > 1 && a < 13) {
      gabagoolGenerated = 24*60*60 / (speed[a-2]); // PARTIE GENERATION GABAGOOL BASE

        rows[1].cells[a].innerHTML = formatNombre(Math.round((
          gabagoolGenerated * items["CRUDE_GABAGOOL"][INSTA_SELL]
          - EYEDROP * items["CAPSAICIN_EYEDROPS_NO_CHARGES"][INSTA_BUY] // PRIX CAPSAICIN EYEDROP
        ) * 10) / 10);// ARRONDI A 0.1 PRES
      if (deFormatNombre(rows[1].cells[a].innerHTML) < minVal)
        minVal = deFormatNombre(rows[1].cells[a].innerHTML);
      if (deFormatNombre(rows[1].cells[a].innerHTML) > maxVal)
        maxVal = deFormatNombre(rows[1].cells[a].innerHTML);
    }
  }
  
  elements = [
    ["Glowstone", "GLOWSTONE_DUST", "GLOWSTONE_DUST_DISTILLATE"],
    ["Blaze Rod", "BLAZE_ROD", "BLAZE_ROD_DISTILLATE"],
    ["Gabagool", "CRUDE_GABAGOOL", "CRUDE_GABAGOOL_DISTILLATE"],
    ["Magma cream", "MAGMA_CREAM", "MAGMA_CREAM_DISTILLATE"],
    ["Nether wart", "NETHER_STALK", "NETHER_STALK_DISTILLATE"]
  ]
  //-------------------- LINE 2 to 7 - FUEL FUEL -------------------
  rows[2].cells[0].innerHTML = "Fuel fuel";

  for (let b = 0; b < 5; b++) {
    rows[3 + b].cells[1].innerHTML = elements[b][0];
    for(let a = 0; a < 14; a++) {
      if (a > 1 && a < 13) {
        let gabagoolGenerated = 1/5 * 24*60*60 / (speed[a-2] / 10) // PARTIE GENERATION GABAGOOL BASE
        gabagoolGenerated += (b == 2 ? 4/5 * 24*60*60 / (speed[a-2] / 10) : 0) // PARTIE GENERATION GABAGOOL BASE
        rows[3 + b].cells[a].innerHTML = formatNombre(Math.round((
          (b != 2 ? 4/5 * 24*60*60 / (speed[a-2] / 10) * items[elements[b][1]][INSTA_SELL] : 0) // PARTIE GENERATION FUEL
          + (COMPACTOR ?
            Math.floor(gabagoolGenerated/192) * items["VERY_CRUDE_GABAGOOL"][INSTA_SELL] + gabagoolGenerated%192 * items["CRUDE_GABAGOOL"][INSTA_SELL] :
            gabagoolGenerated * items["CRUDE_GABAGOOL"][INSTA_SELL]) // PARTIE GENERATION GABAGOOL BASE
          - (6*items[elements[b][2]][INSTA_BUY] + items["FUEL_GABAGOOL"][INSTA_BUY] + 2*items["INFERNO_FUEL_BLOCK"][INSTA_BUY]) // PRIX PARTIE CRAFT FUEL
          - EYEDROP * items["CAPSAICIN_EYEDROPS_NO_CHARGES"][INSTA_BUY] // PRIX CAPSAICIN EYEDROP
        ) * 10 ) / 10); // ARRONDI A 0.1 PRES
        if (deFormatNombre(rows[3 + b].cells[a].innerHTML) < minVal)
          minVal = deFormatNombre(rows[3 + b].cells[a].innerHTML);
        if (deFormatNombre(rows[3 + b].cells[a].innerHTML) > maxVal)
          maxVal = deFormatNombre(rows[3 + b].cells[a].innerHTML);
      }
    }
  }

  //-------------------- LINE 8 to 13 - HEAVY FUEL -------------------
  rows[8].cells[0].innerHTML = "Heavy fuel";

  for (let b = 0; b < 5; b++) {
    rows[9 + b].cells[1].innerHTML = elements[b][0];
    for(let a = 0; a < 14; a++) {
      if (a > 1 && a < 13) {
        let gabagoolGenerated = 1/5 * 24*60*60 / (speed[a-2] / 15) // PARTIE GENERATION GABAGOOL BASE
        gabagoolGenerated += (b == 2 ? 4/5 * 24*60*60 / (speed[a-2] / 15) : 0) // PARTIE GENERATION GABAGOOL BASE
        rows[9 + b].cells[a].innerHTML = formatNombre(Math.round((
          (b != 2 ? 4/5 * 24*60*60 / (speed[a-2] / 15) * items[elements[b][1]][INSTA_SELL] : 0) // PARTIE GENERATION FUEL
          + (COMPACTOR ?
            Math.floor(gabagoolGenerated/192) * items["VERY_CRUDE_GABAGOOL"][INSTA_SELL] + gabagoolGenerated%192 * items["CRUDE_GABAGOOL"][INSTA_SELL] :
            gabagoolGenerated * items["CRUDE_GABAGOOL"][INSTA_SELL]) // PARTIE GENERATION GABAGOOL BASE
          - (6*items[elements[b][2]][INSTA_BUY] + items["HEAVY_GABAGOOL"][INSTA_BUY] + 2*items["INFERNO_FUEL_BLOCK"][INSTA_BUY]) // PRIX PARTIE CRAFT FUEL
          - EYEDROP * items["CAPSAICIN_EYEDROPS_NO_CHARGES"][INSTA_BUY] // PRIX CAPSAICIN EYEDROP
        ) * 10 ) / 10); // ARRONDI A 0.1 PRES
        if (deFormatNombre(rows[9 + b].cells[a].innerHTML) < minVal)
          minVal = deFormatNombre(rows[9 + b].cells[a].innerHTML);
        if (deFormatNombre(rows[9 + b].cells[a].innerHTML) > maxVal)
          maxVal = deFormatNombre(rows[9 + b].cells[a].innerHTML);
      }
    }
  }

  //-------------------- LINE 14 to 20 - HYPERGOLIC FUEL -------------------
  rows[14].cells[0].innerHTML = "Hypergolic fuel";

  for (let b = 0; b < 5; b++) {
    rows[15 + b].cells[1].innerHTML = elements[b][0];
    for(let a = 0; a < 14; a++) {
      if (a > 1 && a < 13) {
        let gabagoolGenerated = 1/5 * 24*60*60 / (speed[a-2] / 20) // PARTIE GENERATION GABAGOOL BASE
        gabagoolGenerated += (b == 2 ? 4/5 * 24*60*60 / (speed[a-2] / 20) : 0) // PARTIE GENERATION GABAGOOL BASE
        rows[15 + b].cells[a].innerHTML = formatNombre(Math.round((
          (b != 2 ? 4/5 * 24*60*60 / (speed[a-2] / 20) * items[elements[b][1]][INSTA_SELL] : 0) // PARTIE GENERATION FUEL
          + (COMPACTOR ?
            Math.floor(gabagoolGenerated/192) * items["VERY_CRUDE_GABAGOOL"][INSTA_SELL] + gabagoolGenerated%192 * items["CRUDE_GABAGOOL"][INSTA_SELL] :
            gabagoolGenerated * items["CRUDE_GABAGOOL"][INSTA_SELL]) // PARTIE GENERATION GABAGOOL BASE
          - (6*items[elements[b][2]][INSTA_BUY] + items["HYPERGOLIC_GABAGOOL"][INSTA_BUY] + 2*items["INFERNO_FUEL_BLOCK"][INSTA_BUY]) // PRIX PARTIE CRAFT FUEL
          + 1/256 * 24*60*60 / (speed[a-2] / 20) * items["CHILI_PEPPER"][INSTA_SELL] // CHILI PEPPER
          + 1/458182 * 24*60*60 / (speed[a-2] / 20) * items["REAPER_PEPPER"][INSTA_SELL] // REAPER PEPPER
          + 1/16364 * 24*60*60 / (speed[a-2] / 20) * items["INFERNO_VERTEX"][INSTA_SELL] // VERTEX
          + (a > 10 ? 2 : 1) * (1 + 0.3*EYEDROP) * 1/1570909 * 24*60*60 / (speed[a-2] / 20) * items["INFERNO_APEX"][INSTA_SELL] // APEX
          - EYEDROP * items["CAPSAICIN_EYEDROPS_NO_CHARGES"][INSTA_BUY] // PRIX CAPSAICIN EYEDROP
        ) * 10 ) / 10); // ARRONDI A 0.1 PRES
        if (deFormatNombre(rows[15 + b].cells[a].innerHTML) < minVal)
          minVal = deFormatNombre(rows[15 + b].cells[a].innerHTML);
        if (deFormatNombre(rows[15 + b].cells[a].innerHTML) > maxVal)
          maxVal = deFormatNombre(rows[15 + b].cells[a].innerHTML);
      }
    }
  }
  
  n = Math.PI / 10;
  
  for (let b = 0; b < 20; b++) {
    for (let a = 0; a < 13; a++) {
      if (b == 0 || b == 2 || b == 8 || b == 14) {
        // Lignes fuel
      }
      else {
        if (a == 0 || a == 1) {
          // colonne entete
        }
        else {
          val = deFormatNombre(rows[b].cells[a].innerHTML);
          if (val < 0)
            rows[b].cells[a].style.backgroundColor = "rgb(" + (176 + (249-176) * Math.pow(val / minVal, n))  + ", " + (176 + (38-176) * Math.pow(val / minVal, n)) + ", " + (176 + (9-176) * Math.pow(val / minVal, n)) + ")";
          else
            rows[b].cells[a].style.backgroundColor = "rgb(" + (176 + (1-176) * Math.pow(val / maxVal, n))  + ", " + (176 + (212-176) * Math.pow(val / maxVal, n)) + ", " + (176 + (73-176) * Math.pow(val / maxVal, n)) + ")";
        }
      }
    }
  }
}