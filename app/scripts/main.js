// Global Objects
var avatarOptions = {};
avatarOptions.sex = 'm';
avatarOptions.name = '';
avatarOptions.Itemcode = [[],[],[],[],[]];
avatarOptions.DBData;


/***********************
NEW CODE - DB
************************/

var dbCode = (function(){

    var avatarData;
    var selectedHairLength; //short | long

    storeApi.getDefaultAvatarCreationOptions(function(error,json){
        if(!error) {

            //Save JSON
            avatarData = json;
            avatarOptions.DBData = avatarData;
        }

    });


    /*****************
    ADJUSTED FUNCTIONS
    ******************/
    function initOptions(gender){
        console.log('> initOptions | gender: '+gender);

        //Create Options
        var allOptions=[];
        var tempOptions=[];

        //filter json data by gender and create the DDLs
        if(selectedHairLength == null || selectedHairLength == undefined) {
            selectedHairLength = 'short'; //default value
        }

        tempOptions = getOptionsDDL(avatarOptions.Itemcode[0], getHairLengthOptions());
        allOptions.push(tempOptions);

        tempOptions = getOptionsDDL(avatarOptions.Itemcode[1], getHairColorOptions(gender,selectedHairLength));
        allOptions.push(tempOptions);

        tempOptions = getOptionsDDL(avatarOptions.Itemcode[2], getDressOptions(gender));
        allOptions.push(tempOptions);

        tempOptions = getOptionsDDL(avatarOptions.Itemcode[3], getBodyOptions(gender));
        allOptions.push(tempOptions);

        tempOptions = getOptionsDDL(avatarOptions.Itemcode[4], getFaceOptions(gender,avatarOptions.Itemcode[3][0]));
        allOptions.push(tempOptions);


        //console.log("allOptions Names: "+allOptions);

        return allOptions;
    }

    function getOptionsDDL(arrayId, options){
        //console.log(">> getOptionsDDL: "+arrayId);

        var item;
        var itemsName=[];

        for (var key in options) {
            item = options[key];
            itemsName.push(item.name);
            arrayId.push(item.value);
            /*
            console.log("item.name: "+item.name);
            console.log("item.value: "+item.value);
            */
        }

        /*
        console.log("itemsName Array: "+itemsName);
        console.log("arrayId: "+arrayId);

        console.log("avatarOptions.Itemcode: "+avatarOptions.Itemcode);
        */


        return itemsName;
    }


    /**********************
    GET FUNCTIONS
    **********************/

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
        for(var key in avatarData.storeItems){
            option = avatarData.storeItems[key];
            if(option.type == 'hair' && option.gender == gender && option.propertyKey =='length' && option.propertyValue == length ){
                var item = {};
                item.value = option.itemcode;
                item.name = option.name;
                options.push(item);
            }
        }
        //randomHairColor = options.length >1 ? options[getRandomInt(1,options.length-1)].value : null;
        return options;
    }

    function getDressOptions(gender){ // short | long
        var options = [];
        var option;
        //options.push({'value':'-', 'name': '-'});
        for(var key in avatarData.storeItems){
            option = avatarData.storeItems[key];
            if(option.type == 'dress' && option.gender == gender){
                var item = {};
                item.value = option.itemcode;
                item.name = option.name;
                options.push(item);
            }
        }
        //randomDress = options.length >1 ? options[getRandomInt(1,options.length-1)].value : null;
        return options;
    }

    function getBodyOptions(gender){ // short | long
        var options = [];
        var option;
        //options.push({'value':'-', 'name': '-'});
        for(var key in avatarData.storeItems){
            option = avatarData.storeItems[key];
            if(option.type == 'body' && option.gender == gender){
                var item = {};
                item.value = option.itemcode;
                item.name = option.name;
                options.push(item);
            }
        }
        //randomBody = options.length >1 ? options[getRandomInt(1,options.length-1)].value : null;
        return options;
    }

    function getFaceOptions(gender, body){ // short | long
        var options = [];
        var option;
        //options.push({'value':'-', 'name': '-'});
        for(var key in avatarData.storeItems){
            option = avatarData.storeItems[key];
            if(option.type == 'head' && option.gender == gender && option.propertyKey =='body' && option.propertyValue == body){
                var item = {};
                item.value = option.itemcode;
                item.name = option.name;
                options.push(item);
            }
        }
        //randomFace = options.length >1 ? options[getRandomInt(1,options.length-1)].value : null;
        return options;
    }

    /**********************
    SET FUNCTIONS
    **********************/

    function setOptionsDDL(arrayId, options){

        console.log('>> setOptionsDDL initial: '+arrayId);

        var item;

        for (var key in options) {
            item = options[key];

            var itemName = item.name.substr(0, 3).toLowerCase();

            for (var i = 0; i < options.length; i++) {
                
                var tempArrayID = arrayId[i].substr(0, 3).toLowerCase();
                
                //var result = arrayId[i].includes(itemName);
                var result = tempArrayID.indexOf(itemName) > -1;

                if(result){
                    arrayId[i]=item.value;
                    break;
                }
            }

        }

        console.log('Final arrayId: '+arrayId);
    }


    function hairLengthChange(value){
        setOptionsDDL(avatarOptions.Itemcode[1], getHairColorOptions(avatarOptions.sex,value));
    }


    function bodyChange(value){
        setOptionsDDL(avatarOptions.Itemcode[4], getFaceOptions(avatarOptions.sex,value));
    }

    /*
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    */

    return {
        pubInitOptions: initOptions,
        pubHairLengthChange: hairLengthChange,
        pubBodyChange: bodyChange,

    }

})();


/*************
CREATE SLIDER
**************/

avatarOptions.createSliderDiv = function (title) {

    var slidersDiv = document.getElementById('sliders');

    // create a new div element
    var newDiv = document.createElement('div');

    newDiv.className ='col-xs-12 col-sm-12 col-md-6 slider';

    newDiv.innerHTML = '<div class="row sliderContents"><div class="col-xs-3 col-sm-2 prev"></div><div class="col-xs-6 col-sm-4 sliderContent"><div class="row sliderTitle"><h2>'+title+'</h2></div><div class="row sliderList"><ul></ul></div></div><div class="col-xs-3 col-sm-2 next"></div></div><!--End slider -->';

    slidersDiv.appendChild(newDiv);

    return newDiv;
}

avatarOptions.createSliderContent = function (options, sex, callback) {
    //console.log("> CreateSliderContent Options: "+options);

    // Get Params
    var titleArray=['Hair Length', 'Hair Colour', 'Chiton', 'Skin', 'Face']
    var newSliderDiv, myUl, newLi;


    for (var i = 0; i < options.length; i++) {

        // Get New Slider DIv
        newSliderDiv = avatarOptions.createSliderDiv(titleArray[i]);
        //console.log("newSliderDiv: "+newSliderDiv);

        myUl = newSliderDiv.getElementsByTagName('ul')[0];
        //console.log("myUl: "+myUl);

        for (var j = 0; j < options[i].length; j++) {

            newLi = document.createElement('li');


            if(j==0){
               newLi.innerHTML = '<span class="activate">'+options[i][j]+'</span>';
            } else {
                newLi.innerHTML = '<span>'+options[i][j]+'</span>';
            }

            myUl.appendChild(newLi);

            //console.log("createSliderContent.innerHTML: "+newLi.innerHTML);

        } //End of For j

        avatarOptions.theSlider(newSliderDiv);

    } // End of For i

    // Finally create the 2 buttons
    var createAvatarButtons = avatarOptions.createAvatarButtons();

    if (callback && typeof(callback) === 'function') {
        callback();
    }

}

avatarOptions.createAvatarButtons = function () {

    var avatarButtonsDiv = document.getElementById('sliders');

    // create a new div element
    var newDiv = document.createElement('div');
    newDiv.id ='avatarButtons';
    newDiv.className ='col-sm-12';

    //newDiv.innerHTML = '<div class="col-xs-3 col-sm-2 col-sm-offset-2"></div><div class="col-xs-6 col-sm-5 avatarButContainer"><div id="randomButton" class="row avatarButton"><a href="#"><img src="images/scr2_but_random.png" alt="random"></a></div><div id="doneButton" class="row avatarButton"><a href="#"><img src="images/scr2_but_done.png" alt="random"></a></div></div><div class="col-xs-3 col-sm-2"></div>';
    newDiv.innerHTML = '<div class="col-xs-3 col-sm-2 col-md-7"></div><div class="col-xs-3 col-sm-3 col-md-3 avatarButContainer"><div id="randomButton" class="row avatarButton"><a href="#"><img src="images/scr2_but_random.png" alt="random"></a></div><div id="doneButton" class="row avatarButton"><a href="#"><img src="images/scr2_but_done.png" alt="random"></a></div></div>';
    avatarButtonsDiv.appendChild(newDiv);

    return newDiv;
}

/*****************
MAIN FUNCTIONALITY
*****************/

/* SLIDER CONTROLS*/
avatarOptions.theSlider = function (newSliderDiv) {

    var counter = 0;
    var items = newSliderDiv.querySelectorAll('ul>li>span');
    var numItems = items.length; // total number of slides

    // this function is what cycles the slides, showing the next or previous slide and hiding all the others
    var showCurrent = function(){
        var itemToShow = Math.abs(counter%numItems);// uses remainder (aka modulo) operator to get the actual index of the element to show

        // remove .show from whichever element currently has it
        // http://stackoverflow.com/a/16053538/2006057
        [].forEach.call(items, function(el){
            el.classList.remove('activate');
        });

        // add .activate to the one item that's supposed to have it
        items[itemToShow].classList.add('activate');

        return itemToShow;
    };

    // add click events to prev & next buttons
    newSliderDiv.querySelector('.next').addEventListener('click', function() {
        counter++;
        var currentItem = showCurrent();

        // Update for current item changed
        avatarOptions.updateAvatar($(newSliderDiv).index(), currentItem);
    }, false);

    newSliderDiv.querySelector('.prev').addEventListener('click', function() {
        counter--;
        var currentItem = showCurrent();

        // Update for current item changed
        avatarOptions.updateAvatar($(newSliderDiv).index(), currentItem);
    }, false);

};

/* RANDOM */
avatarOptions.randomizeAvatar = function () {

    // Get Params
    var optionArray = [];

    var getRandomInt = function(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /* EVENTS */

    document.querySelector('#randomButton').addEventListener('click', function() {

        var ulItems = document.querySelectorAll('.slider>.sliderContents>.sliderContent>.sliderList>ul');


        for (var i = 0; i < avatarOptions.Itemcode.length; i++) {

            // Check if male/female exists for this set
            optionArray = avatarOptions.Itemcode[i];
            // Get A random number for this set
            var myRandom = getRandomInt(0, (optionArray.length-1));
            console.log('%%%myRandom: '+myRandom);
            // Get the current/specific Spans
            var spanItems = ulItems[i].querySelectorAll('li>span');

            [].forEach.call(spanItems, function(el){
                el.classList.remove('activate');
            });

            // add .activate to the one item that's supposed to have it
            spanItems[myRandom].classList.add('activate');

            // Update for current item changed
            avatarOptions.updateAvatar(i, myRandom);
        }

    }, false);

};

/* DONE */
avatarOptions.doneAvatar = function () {


    /* EVENTS */
    document.querySelector('#doneButton').addEventListener('click', function() {
        console.log('> DONE doneAvatar');

        var getCurrentNextItem,currentIndex;
        var savedItems = [];
        // Object for DB
        var avatar = {};
        avatar.name = avatarOptions.name;
        avatar.gender = avatarOptions.sex;

        for (var i = 1; i < avatarOptions.Itemcode.length; i++) {

            getCurrentNextItem = document.getElementById('sliders').getElementsByClassName('activate')[i].parentElement;
            currentIndex = $(getCurrentNextItem).index();
            savedItems.push(avatarOptions.Itemcode[i][currentIndex]);

            /*
            console.log('getCurrentNextItem: '+getCurrentNextItem);
            console.log('currentIndex: '+currentIndex);
            console.log('avatarOptions.Itemcode[i][currentIndex]: '+avatarOptions.Itemcode[i][currentIndex]);
            */

        }


        /*console.log('Saved Objects: '+savedItems); */


        avatar.hairId = avatarOptions.DBData.storeItems[savedItems[0]].id;
        avatar.dressId = avatarOptions.DBData.storeItems[savedItems[1]].id;
        avatar.bodyId = avatarOptions.DBData.storeItems[savedItems[2]].id;
        avatar.headId = avatarOptions.DBData.storeItems[savedItems[3]].id;

        console.log(avatar);


        userApi.saveAvatar(avatar, false, function(error, data){
            if(!error){
                alert(LangMessages.get('avatar.saved.successfully'));
                window.location = "/";
            }else if(data.status == 403){
                alert(LangMessages.get('avatar.name.already.exists'));
            }else{
                console.log(data);
                alert(error)
            }
        });




    }, false);


}

/***************************************
LOAD/SEND DATA
***************************************/

avatarOptions.setImgAsset = function (itemcode) {
    var src = itemcode == null || itemcode.length < 4? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' : avatarOptions.DBData.storeItems[itemcode].uri;
    console.log('My Image: '+src);

    avatarOptions.changeItem(itemcode);
}

/* UPDATE */
avatarOptions.updateAvatar = function (optionIndex, itemIndex) {

    var getCurrentNextItem, currentIndex;

    if(optionIndex==0){
        dbCode.pubHairLengthChange(avatarOptions.Itemcode[optionIndex][itemIndex]);

        // Update Hair Color as well
        getCurrentNextItem = document.getElementById('sliders').getElementsByClassName('activate')[1].parentElement;
        currentIndex = $(getCurrentNextItem).index();

        avatarOptions.setImgAsset(avatarOptions.Itemcode[optionIndex+1][currentIndex]);

    } else if(optionIndex==3){
        avatarOptions.setImgAsset(avatarOptions.Itemcode[optionIndex][itemIndex]);

        // Update Face as well
        getCurrentNextItem = document.getElementById('sliders').getElementsByClassName('activate')[4].parentElement;
        currentIndex = $(getCurrentNextItem).index();

        dbCode.pubBodyChange(avatarOptions.Itemcode[optionIndex][itemIndex]);
        avatarOptions.setImgAsset(avatarOptions.Itemcode[optionIndex+1][currentIndex]);

    } else {
        avatarOptions.setImgAsset(avatarOptions.Itemcode[optionIndex][itemIndex]);
    }

}


/* SEND */
avatarOptions.changeItem = function (itemcode) {
	avatar.changeItem(itemcode, avatarOptions.DBData.storeItems[itemcode].type);

}

/***************************************
FIRST SCREEN
***************************************/
avatarOptions.firstScreen = function () {

    // GET INPUT VALUE
    avatarOptions.name = document.getElementById('scr1Input').value;

    // CHANGE SCREENS
    document.getElementById('content').style.display = 'block';
    document.getElementById('scr1content').style.display = 'none';

    $('.header h1').html(avatarOptions.name+', please choose your basic appearance!');

    /***************************************
        !!! LOAD NEXT SCREEN DATA!!!
    ***************************************/

    avatarOptions.createSliderContent(dbCode.pubInitOptions(avatarOptions.sex), avatarOptions.sex, function() {
        console.log('!!! Finished createSliderContent !!!');

        // Build Default Avatar
        avatar.setGameType('Creation');
		avatar.setItemsJSON(avatarOptions.DBData);
		avatar.setAvatarInfo({'name':avatarOptions.name,
			'sex':avatarOptions.sex,
            'body':avatarOptions.Itemcode[3][0],
			'head':avatarOptions.Itemcode[4][0],
			'hair':avatarOptions.Itemcode[1][0],
			'dress':avatarOptions.Itemcode[2][0]
            });

		avatar.startMeUp();

        // Call Events for 2 buttons
        avatarOptions.randomizeAvatar();
        avatarOptions.doneAvatar();

    });

};
avatarOptions.firstScreenEvents = function () {

    document.querySelector('#scr1_boy').addEventListener('click', function() {
        avatarOptions.sex ='m';
        avatarOptions.firstScreen();

    }, false);

    document.querySelector('#scr1_girl').addEventListener('click', function() {
        avatarOptions.sex ='f';
        avatarOptions.firstScreen();

    }, false);

};

/**
 *
**/

$(document).ready(function () {

    // 1st Screen
    avatarOptions.firstScreenEvents();

});
