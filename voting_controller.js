//Global variable with the class VotingSetting
var votingSetting;

/** 
 * Function that create a interface based in a json file.
 * @param {*} settings json to set the interface.
 */
function updateVoting(settings) {
    // Parse string to json.
    var settings = JSON.parse((settings))

    //create variables with data of json
    var {descripcion,opciones, modalidad, enBlanco, publica}= settings;
    votingSetting = new VotingSetting(descripcion, opciones, modalidad.modo, modalidad.cantidad, enBlanco, publica);

    // Set question title from settings.
    document.getElementById("question_text").innerHTML = settings.descripcion;
    // Set options title from settings.
    var text = "Selección [" + settings.modalidad.modo + "] puede selecionar [" + settings.modalidad.cantidad + "] opciones"
    document.getElementById("options_title").innerHTML = text;
    //  Call the function to generate all options.
    generateOptions(settings);
}
/**
 * Generate checkboxes based in available options.
 * @param {*} settings 
 */
function generateOptions(settings) {
    // Get element where is going to add the new checkboxes.
    var container = document.getElementById("options_container");
    // Create all options specified in settings.
    for (var i = 0; i < settings.opciones.length; i++) {
        // Create the checkbox.
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "option_" + i;
        checkbox.name = "voteCheck"
        // Create the label for the checkbox.
        var label = document.createElement('label');
        label.htmlFor = "option_" + i;
        label.appendChild(document.createTextNode(settings.opciones[i]));
        // Add checkbox and label to the container.
        container.appendChild(checkbox);
        container.appendChild(label);
    }
}

/**
 * @function validateVoting used for check if the vote is valid or not
 * @returns return response json with result of voting
 */
function validateVoting() {
    var cont = 0; 
    var checkboxes = document.getElementById("options_container").voteCheck;
    for (var x in checkboxes) {
        if (checkboxes[x].checked) {
         cont = cont + 1;
        }
    }
    console.log(cont)
    showHide("hola")
}

function showHide(switchTextDiv) {
    var x = document.getElementById("notification");
    x.style.display = "block";
    x.innerHTML = switchTextDiv

}