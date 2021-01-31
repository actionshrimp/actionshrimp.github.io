let flourTotalCell = document.getElementById('itab-flour-total');
let defaultFlourTotal = 650;

let baseRecipe = {
    'flour-sw': 670,
    'flour-r': 50,
    'flour-w': 80,
    'water': 575,
    'leaven': 160,
    'salt': 17
};

flourTotalCell.innerHTML = '<input id="itab-flour-total-input" type="number" value="' + defaultFlourTotal + '" min="0" /><button id="itab-flour-total-reset">Reset</button>';

let flourTotalInput = document.getElementById('itab-flour-total-input');
let flourTotalReset = document.getElementById('itab-flour-total-reset');

function updateIngredients() {
    let flourTotal = flourTotalInput.value;
    let ratio = flourTotal / (baseRecipe['flour-sw'] + baseRecipe['flour-r'] + baseRecipe['flour-w']);

    var totalWeight = 0;
    for (const [k, v] of Object.entries(baseRecipe)) {
        var w = v * ratio;
        document.getElementById('itab-' + k).innerHTML = Math.round(w) + "g";
        totalWeight += w;
    }

    document.getElementById('itab-loaf-weight').innerHTML = Math.round(totalWeight / 2) + "g";
}

flourTotalInput.addEventListener('change', function () {
    updateIngredients();
});

flourTotalReset.addEventListener('click', function () {
    flourTotalInput.value = defaultFlourTotal;
    updateIngredients();
})
