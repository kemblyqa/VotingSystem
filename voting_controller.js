//Global variable with timer
var privateEventTimer;
//Global variable with the class VotingSetting
var votingSetting;
//Global variable with the options reference
var options_container = null;

/**
 * @function callVotingPag call ballot page.
 * @param {*} jsonFile 
 * @returns {undefined}
 */
function callVotingPag() {
    var jsonFile = document.getElementById('text_json').value;
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
 * @function updateVoting create a interface based in a json file.
 * @param {string} settings json to set the interface.
 */
function updateVoting(settings) {
    options_container = document.getElementById("text_row");
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
    // Set private mode if it is required
    if (!votingSetting.getPublic()) enablePrivateMode();
    //  Call the function to generate all options.
    generateOptions(settings);
}

/** 
 * @function keepCurrentOpacityOptions Resets the 5s timeout when a click is detected.
 */
function keepCurrentOpacityOptions() {
    clearTimeout(privateEventTimer);
    privateEventTimer = setTimeout(()=>{
        setOpacityAgain();
    }, 5000);
};

/** 
 * @function setOpacityAgain Set opacity as the beginning with a transition
 */
function setOpacityAgain(){
    options_container.style.transition = "opacity 1s ease-in-out";
    options_container.style.opacity = 0.8;
}

/** 
 * @function enablePrivateMode Enables the private mode if is required
 */
function enablePrivateMode(){
    //set opacity value in private mode
    options_container.style.opacity = 0.8;
    //this listeners help to handle the moves of the mouse and changes the opacity according to this.
    options_container.addEventListener("mouseup", setCurrentOpacity);
    options_container.addEventListener("mousedown", changeOpacityEvent);
    options_container.addEventListener("click", updateCurrentOpacity);
    options_container.addEventListener("touchend", setCurrentOpacity);
    options_container.addEventListener("touchstart", changeOpacityEvent);
}

/** 
 * @function setCurrentOpacity Get the opacity detected in mouseup and set this value to the current style of the options
 * @param {any} Listener event
 */
function setCurrentOpacity() {
    var current_opacity = window.getComputedStyle(options_container, null).getPropertyValue("opacity");
    options_container.style.opacity = current_opacity;
    keepCurrentOpacityOptions();
}

/** 
 * @function changeOpacityEvent Set a transition to change the opacity until the mouse is up
 */
function changeOpacityEvent() {
    options_container.style.transition = "opacity 2s ease-in-out";
    options_container.style.opacity = 0;
}

/** 
 * @function updateCurrentOpacity If mouse clicks over the options, the timeout will be reseted
 */
function updateCurrentOpacity(e) {
    keepCurrentOpacityOptions();   
}

/** 
 * @function disablePrivateMode Removes the events that executes in private mode
 */
function disablePrivateMode(){
    options_container.removeEventListener("mouseup", setCurrentOpacity);
    options_container.removeEventListener("mousedown", changeOpacityEvent);
    options_container.removeEventListener("click", updateCurrentOpacity);
    options_container.removeEventListener("touchend", setCurrentOpacity);
    options_container.removeEventListener("touchstart", changeOpacityEvent);
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
        if(!votingSetting.getPublic()) disablePrivateMode();
    }
    else if ((votingSetting.getIsWhite()) && (count === 0)) {
        //verify if person can vote blank
        showNotification("Your vote was in blank");
        if(!votingSetting.getPublic()) disablePrivateMode();
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
        showNotification("Your vote was in blank");
        if(!votingSetting.getPublic()) disablePrivateMode();
    }
    //person select the second element
    else if (count > 0) {
        showNotification("Your vote was: " + textList[0]);
        if(!votingSetting.getPublic()) disablePrivateMode();
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