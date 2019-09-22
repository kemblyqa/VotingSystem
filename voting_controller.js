var container_elem = document.getElementById("container");
//Global variable with timer
var privateEventTimer;
//Global variable with the class VotingSetting
var votingSetting;

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
 * @function callVotingPag call ballot page.
 * @param {*} jsonFile 
 * @returns {undefined}
 */
function callVotingPag() {
    var jsonFile = document.getElementById('text_json').value
    localStorage.setItem("file", jsonFile);
    window.location.href = 'ballot.html';
}

/**
 * @function callUpdateVoting is launch when page start.
 * @param {none}
 * @returns {undefined}
 */
function callUpdateVoting() {
    updateVoting(localStorage.getItem("file"));
}

/** 
 * Function that create a interface based in a json file.
 * @param {string} settings json to set the interface.
 */
function updateVoting(settings) {
    votingSetting = null;
    var settings = JSON.parse((settings))

    //create variables with data of json
    var { descripcion, opciones, modalidad, enBlanco, publica } = settings;
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
 * @param {JSON} settings 
 */
function generateOptions(settings) {
    // Get element where is going to add the new checkboxes.
    var container = document.getElementById("options_container")
    // Remove all items added.
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
    // Create all options specified in settings.
    for (var i = 0; i < settings.opciones.length; i++) {
        // Create the checkbox.
        var checkbox = document.createElement('input');
        if (settings.modalidad.cantidad == 1) {
            checkbox.type = "radio";
        } else {
            checkbox.type = "checkbox";
        }
        checkbox.id = "option_" + i;
        checkbox.name = "checkGroup";
        checkbox.className = "option"
        // Create the label for the checkbox.
        var label = document.createElement('label');
        label.htmlFor = "option_" + i;
        label.className = "labelInput";
        label.appendChild(document.createTextNode(settings.opciones[i]));
        // Add checkbox and label to the container.
        container.appendChild(checkbox);
        container.appendChild(label);
    }
}

/**
 * @function validateVoting used for check if the vote is valid or not
 * @returns {undefined}
 */
function validateVoting() {
    var count = 0;
    var selectElementList = [];
    var checkboxes = document.getElementById("options_container").checkGroup;
    for (var element in checkboxes) {
        if (checkboxes[element].checked) {
            selectElementList.push(getLabelTextOption(element));
            count = count + 1;
        }
    }
    //verify that mode type of voting is 'multiple' 
    if (votingSetting.getModeType() == "multiple") {
        multipleVotingValidation(count, selectElementList);
    }
    //the mode type is 'unica'
    else {
        uniqueVotingValidation(count, selectElementList);
    }
}

/**
 * @function getLabelTextOption function thet search in label list the text of check selected
 * @param {number} position position of label of element for check
 * @returns {string} return text of the label in positon search
 */
function getLabelTextOption(position) {
    var labels = document.getElementsByTagName("label");
    return labels[position].innerText;
}

/**
 * @function multipleVotingValidation verify data of multiple voting
 * @param {number} count quantity of options that the person check
 * @param {list} textList  list with text of each elements selected
 * @returns {undefined}
 */
function multipleVotingValidation(count, textList) {
    //verify if the quantity of choices is the same or less that the top quantity 
    if ((votingSetting.getModeQuantity() >= count) && (count > 0)) {
        showNotification("Your select options was: " + textList);
    }
    else if ((votingSetting.getIsWhite()) && (count === 0)) {
        //verify if person can vote blank
        showNotification("Your vote was in blank")
    }
    //if the quantity is more that the top quantity or zero with isWhite false
    else if (count > 0) {
        showNotification("Error you only can select " + votingSetting.getModeQuantity())
    }
    else {
        showNotification("Error you need to select one vote")
    }

    console.log(count)
}

/**
 * @function uniqueVotingValidation verify data of unique voting
 * @param {number} count quantity of options that the person check
 * @param {list} textList  list with text of each elements selected
 * @returns {undefined}
 */
function uniqueVotingValidation(count, textList) {
    //person was decided to vote in blank
    if ((votingSetting.getIsWhite()) && (count === 0)) {
        showNotification("Your vote was in blank")
    }
    //person select the second element
    else if (count > 0) {
        showNotification("Your vote was: " + textList[0]);
    }
    else {
        showNotification("Error you need to select one vote")
    }
}

/**
 * @function showHide this function show notification when the person vote
 * @param {string} text give the text for the notification
 * @returns {undefined} show in html the info
 */
function showNotification(text) {
    var divElement = document.getElementById("notification");
    divElement.style.display = "block";
    divElement.innerHTML = text

}