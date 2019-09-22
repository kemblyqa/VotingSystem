var container_elem = document.getElementById("container");
var privateEventTimer;

container_elem.addEventListener("mouseup", (e)=>{
    e.preventDefault();
    var current_opacity = window.getComputedStyle(container_elem, null).getPropertyValue("opacity");
    console.log("mouseup event", container_elem.style.opacity);
    container_elem.style.opacity = current_opacity;
    console.log(current_opacity);
    eventMouseClick();
})
container_elem.addEventListener("mousedown", (e)=>{
    e.preventDefault();
    container_elem.style.transition = "opacity 2s ease-in-out";
    container_elem.style.opacity = 0;
})
container_elem.addEventListener("click", (e)=>{
    e.preventDefault();
    eventMouseClick();    
})
function eventMouseClick() {
    clearTimeout(privateEventTimer);
    privateEventTimer = setTimeout(()=>{
        revertPrivateMode();
    }, 5000);
};

function revertPrivateMode(){
    container_elem.style.transition = "opacity 1s ease-in-out";
    container_elem.style.opacity = 0.8;
}

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