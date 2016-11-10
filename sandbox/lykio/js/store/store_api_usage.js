// demo page code

var avatarData;
var selectedGender;
var selectedHairLength ; //short | long
var selectedHairColor;
var selectedDress;
var selectedBody;
var selectedFace;

var randomBody;
var randomHairColor;
var randomDress;
var randomFace;

var hairColorDDLId = "hairColorDDL";
var hairLengthDDLId = "hairLengthDDL";
var dressDDLId = "dressDDL";
var bodyDDLId = "bodyDDL";
var faceDDLId = "faceDDL";

var hairAssetId = "hairAsset";
var dressAssetId = "dressAsset";
var bodyAssetId = "bodyAsset";
var faceAssetId = "faceAsset";

var assetMap = {};
assetMap[hairColorDDLId] = hairAssetId;
assetMap[dressDDLId] = dressAssetId;
assetMap[bodyDDLId] = bodyAssetId;
assetMap[faceDDLId] = faceAssetId;

storeApi.getDefaultAvatarCreationOptions(function(error,json){
    if(!error) {
        avatarData = json;
    }

});

function initSelectors(gender){

    if(gender =="-"){
        //reset all
        resetAllDDLs();
    }else{
        setImgAsset(hairAssetId,null);
        selectedGender = gender;
        //filter json data by gender and create the DDLs
        if(selectedHairLength == null) {
            selectedHairLength = "short"; //default value
        }

        createDDL(hairLengthDDLId,getHairLengthOptions(),$('#'+hairLengthDDLId+' :selected').text());

        createDDL(hairColorDDLId,getHairColorOptions(gender,selectedHairLength),$('#'+hairColorDDLId+' :selected').text());

        createDDL(dressDDLId,getDressOptions(gender),$('#'+dressDDLId+' :selected').text());

        createDDL(bodyDDLId,getBodyOptions(gender),$('#'+bodyDDLId+' :selected').text());

        createDDL(faceDDLId,getFaceOptions(gender,$('#'+bodyDDLId).val()),$('#'+faceDDLId+' :selected').text());

        fillRandomValuesOnEmptySelections();
    }
}

function resetAllDDLs(){
    $('#'+hairLengthDDLId).empty();
    $('#'+hairColorDDLId).empty();
    $('#'+dressDDLId).empty();
    $('#'+bodyDDLId).empty();
    $('#'+faceDDLId).empty();
    setImgAsset(hairAssetId,null);
    setImgAsset(dressAssetId,null);
    setImgAsset(bodyAssetId,null);
    setImgAsset(faceAssetId,null);

}

function createDDL(id, options, selectedText){
    $('#'+id).empty();
    var item,selected;
    for (var key in options) {
        item = options[key];
        selected = item.name == selectedText? ' selected="selected" ' : '';
        $('#' + id).append('<option '+selected+' value="'+item.value+'">'+item.name+'</option>');
        if(selected.length>4 && assetMap[id] != null && item.value!='-'){
            setImgAsset(assetMap[id],item.value);
        }
    }

}

function getHairLengthOptions(){
    var options = [
        {'value':'short', 'name': 'Short Hair'},
        {'value':'long', 'name': 'Long Hair'}
    ]

    return options;
}

function getHairColorOptions(gender, length){ // short | long
    var options = [];
    var option;
    options.push({'value':'-', 'name': '-'});
    for(var key in avatarData.storeItems){
        option = avatarData.storeItems[key];
        if(option.type == "hair" && option.gender == gender && option.propertyKey =="length" && option.propertyValue == length ){
            var item = {};
            item.value = option.itemcode;
            item.name = option.name;
            options.push(item);
        }
    }
    randomHairColor = options.length >1 ? options[getRandomInt(1,options.length-1)].value : null;
    return options;
}

function hairColorChange(value){
    selectedHairColor = value;
    setImgAsset(hairAssetId,value);
}

function hairLengthChange(value){
    selectedHairLength = value;
    var selectedColorText = $('#'+hairColorDDLId+' :selected').text();
    $('#'+hairColorDDLId).empty();
    createDDL(hairColorDDLId,getHairColorOptions(selectedGender,selectedHairLength),selectedColorText);
    setImgAsset(hairAssetId,$('#'+hairColorDDLId).val());
}

function setImgAsset(id,itemcode){
    var src = itemcode == null || itemcode.length < 4? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' : avatarData.storeItems[itemcode].uri;
    $('#'+id).attr("src",src);
}

/**
 * DRESS code
 * */

function getDressOptions(gender){ // short | long
    var options = [];
    var option;
    options.push({'value':'-', 'name': '-'});
    for(var key in avatarData.storeItems){
        option = avatarData.storeItems[key];
        if(option.type == "dress" && option.gender == gender){
            var item = {};
            item.value = option.itemcode;
            item.name = option.name;
            options.push(item);
        }
    }
    randomDress = options.length >1 ? options[getRandomInt(1,options.length-1)].value : null;
    return options;
}

function dressChange(value){
    selectedDress = value;
    setImgAsset(dressAssetId,value);
}

/**
 * BODY-SKIN code
 * */

function getBodyOptions(gender){ // short | long
    var options = [];
    var option;
    options.push({'value':'-', 'name': '-'});
    for(var key in avatarData.storeItems){
        option = avatarData.storeItems[key];
        if(option.type == "body" && option.gender == gender){
            var item = {};
            item.value = option.itemcode;
            item.name = option.name;
            options.push(item);
        }
    }
    randomBody = options.length >1 ? options[getRandomInt(1,options.length-1)].value : null;
    return options;
}

function bodyChange(value){
    selectedBody = value;
    setImgAsset(bodyAssetId,value);

    var selectedFaceText = $('#'+faceDDLId+' :selected').text();
    $('#'+faceDDLId).empty();
    createDDL(faceDDLId,getFaceOptions(selectedGender,selectedBody),selectedFaceText);
    setImgAsset(faceAssetId,$('#'+faceDDLId).val());
}

/**
 * FACE code
 * */

function getFaceOptions(gender, body){ // short | long
    var options = [];
    var option;
    options.push({'value':'-', 'name': '-'});
    for(var key in avatarData.storeItems){
        option = avatarData.storeItems[key];
        if(option.type == "head" && option.gender == gender && option.propertyKey =="body" && option.propertyValue == body){
            var item = {};
            item.value = option.itemcode;
            item.name = option.name;
            options.push(item);
        }
    }
    randomFace = options.length >1 ? options[getRandomInt(1,options.length-1)].value : null;
    return options;
}

function faceChange(value){
    selectedFace = value;
    setImgAsset(faceAssetId,value);
}

function fillRandomValuesOnEmptySelections() {
    if (selectedBody == null || $('#'+bodyDDLId).val() == '-') {
        $('#'+bodyDDLId).val(randomBody);
        bodyChange(randomBody);
    }


    if (selectedDress == null || $('#'+dressDDLId).val() == '-') {
        $('#'+dressDDLId).val(randomDress);
        dressChange(randomDress);
    }

    if (selectedFace == null || $('#'+faceDDLId).val() == '-') {
        $('#'+faceDDLId).val(randomFace);
        faceChange(randomFace);
    }

    if (selectedHairColor == null || $('#'+hairColorDDLId).val() == '-') {
        $('#'+hairColorDDLId).val(randomHairColor);
        hairColorChange(randomHairColor);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

