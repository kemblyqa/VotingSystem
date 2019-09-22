
var container_elem = document.getElementById("container");
container_elem.onmouseup = (event) => {
    var current_opacity = window.getComputedStyle(container_elem, ":active").getPropertyValue("opacity");
    container_elem.style.opacity = current_opacity;
    eventMouseClick();
}

container_elem.onclick = (event) => {
    
}

function eventMouseClick() {
    var timer = setInterval(()=>{

    }, 5000);
};

    /** 
 * Function that create a interface based in a json file.
 * @param {*} settings json to set the interface.
 */
function updateVoting(settings) {
    // Parse string to json.
    var settings = JSON.parse((settings))
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
        // Create the label for the checkbox.
        var label = document.createElement('label');
        label.htmlFor = "option_" + i;
        label.appendChild(document.createTextNode(settings.opciones[i]));
        // Add checkbox and label to the container.
        container.appendChild(checkbox);
        container.appendChild(label);
    }
}