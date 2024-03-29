/**
 * @function VotingSetting class that save the data of json
 * @param {*} description title of votation
 * @param {*} options all options that the person can vote
 * @param {*} mode_type if the person can choice more than one option
 * @param {*} mode_quantity quantity that the people can choice
 * @param {*} isWhite check if the person can vote blank
 * @param {*} public check if the votation is public or private
 * @returns {undefined}
 */
function VotingSetting(description ,options, mode_type, mode_quantity, isWhite, public) {
    this.description =  description;
    this.options = options;
    this.mode_type = mode_type;
    this.mode_quantity = mode_quantity;
    this.isWhite = isWhite;
    this.public = public;
}

VotingSetting.prototype.getDescription = function(){
    return this.description;
} 

VotingSetting.prototype.getOptions = function(){
    return this.options;
} 

VotingSetting.prototype.getModeType = function(){
    return this.mode_type;
} 

VotingSetting.prototype.getModeQuantity = function(){
    return this.mode_quantity;
} 

VotingSetting.prototype.getIsWhite = function(){
    return this.isWhite;
} 

VotingSetting.prototype.getPublic = function(){
    return this.public;
} 