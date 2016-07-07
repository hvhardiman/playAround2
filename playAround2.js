Math.seedrandom(0228);
const htmlFontsize = 8; //usse this to handle rem in js
const tileMargin = .02*htmlFontsize;
const tileWidth = 5*htmlFontsize +2*tileMargin*htmlFontsize; //usse this to handle 
const boardWidth = 12.0*tileWidth;
const boardxy = 12; 

var wordArray = [];
var gameBoard = [];
var tileList = [];
var playedWord ="";
var consonants = "bcdfghjklmnpqrstvwxyz";
var vowels = "aeiou";
var selectedTileobject;

var totalPlays = 0;
var totalPresses = 0;

var points = {a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,
    l:1,
    m:4,
    n:1,
    o:1,
    p:3,
    q:10,
    r:1,
    s:1,
    t:1,
    u:1,
    v:4,
    w:4,
    x:8,
    y:4,
    z:10
};

//Go ahead and start getting the large file ASAP and setting up objects and DOM
//need to do this first to make adding event listners less of a headache
createwordArray();
createTilelist();
createBoardspaces();

$(document).ready(function() {

});//end of .ready

//Methods
//Methods
//Methods
//Methods
//Methods

//create board objects for DOM and memory - initialization
function createBoardspaces(){

    // Create Spaces that go on the board, logical plus styling aspects
    var spaceId = 1;
    for (var n = 0; n <= 11; n++){
        for (var j = 0; j <= 11; j++){

            d = document.createElement('div');
            var space = new Object();

            space.homeX = Math.floor(j*tileWidth);;
            space.homeY = Math.floor(n*tileWidth);

            space.letterVal = "";
            space.locked = 0;

            //visual aspects
            $(d).css("left",  space.homeX);
            $(d).css("top",  space.homeY);
            $(d).addClass("onboardtextFormat");
            $(d).addClass("onboardvisFormat");

            //logical data needed for visual support
            $(d).addClass("gameSpaces");
            $(d).data("onboard", false);
            $(d).data("locked", false);

            $(d).data("storedtileId", 0); //what space is on me
            $(d).data("iD", spaceId); //who am i 
            spaceId++;

            var ranVal = getRandomArbitrary(0, 100);

            if(ranVal < 60){
                space.bonus = "none";
                $(d).text("  ");
            }

            if((ranVal>60)&&(ranVal<70)){
                 space.bonus = "TW";
                 $(d).text("TW");
                 $(d).addClass("tw");
            }

            if((ranVal>70)&&(ranVal<80)){
                 space.bonus = "DW";
                 $(d).text("DW");
                 $(d).addClass("dw");                
            }

            if((ranVal>80)&&(ranVal<90)){
                 space.bonus = "DL";
                 $(d).text("DL");
                 $(d).addClass("dl");
            }

            if((ranVal>90)&&(ranVal<100)){
                 space.bonus = "TL";
                 $(d).text("TL");
                 $(d).addClass("tl");
            }

            //Push the look to the DOM
            $(d).appendTo($(".container"));
            //Push the logical to memory
            gameBoard.push(space);
        }            
}
//  
// End of create tiles loop

}
//create tile objects for DOM and memory - initialization
function createTilelist(){

var ranVal; 
var tileId = 1; 
    for (var n = 0; n < 3; n++){

        for (var j = 0; j <= 9; j++){

            var tile = new Object();
      
            tile.startingX = Math.floor(j*tileWidth);
            tile.startingY = Math.floor(n*tileWidth);
            tile.realX = tile.homeX;
            tile.realY = tile.homeY;
            tile.played = 0;
            tile.selected = 0;

            //get ten vowels and twenty consonants 
            if(n==0){
                ranVal = getRandomArbitrary(0, 5);
                tile.value = vowels.charAt(ranVal);
            }else{
                ranVal = getRandomArbitrary(0, 21);
                tile.value = consonants.charAt(ranVal);
            }
            tileList.push(tile);

            d = document.createElement('div');

            //visual aspects of tile

            
            $(d).draggable().css("position", "absolute");  //make tile draggable
            $(d).addClass("onboardtextFormat");
            $(d).addClass("onboardvisFormat");
            $(d).addClass("tileNatural");
            //physically let tile know where it first lives change left and top to change location later
            $(d).css("left", tile.startingX);
            $(d).css("top", tile.startingY);
            // $(d).css("transform", "scale(1,1)");
            $(d).text(tile.value);


            //logical data needed for visual and other support
            //Let know where current home is so it can return there
            $(d).data( "homeX", tile.startingX );
            $(d).data( "homeY", tile.startingY );
            $(d).data( "locked", false);
                
            //what space am I on
            $(d).data("spaceonId", 0);

            //what tile am I
            $(d).data("iD", tileId);
            tileId++;

            var s = document.createElement('span');
            $(s).addClass('tilevalue');
            $(s).text(returnPointvalue(tile.value));
            $(d).append($(s));

            $(d).appendTo($(".tileArea"));
  
        }
            //Draw Main Play Board here
    }
}
//function that gets the checker file form the server and loads it in memory inside wordArray 
function createwordArray(){
    var file = "./wordsEn.txt";
    $.get(file,function(txt){ 
        var lines = txt.split("\n");
        for (var i = 0, len = lines.length; i < len; i++) {
            wordArray[i]=lines[i];
        }
    }); 
}

function removetilefromSpace(testSpace){
	$(".gameSpaces").each(function( index ){
		if($(this).data("iD")==testSpace){
			$(this).data("storedtileId", 0); //what space is on me
            $(this).removeClass("onboardFresh");
		}  	
	});
}

//function that determins if a point (touch or mouseclick) is within a particular square
function isIntersectingsquare(pntX, pntY, squareX,squareY, width) {
    if ((pntX > squareX)&&(pntX<squareX+width)){
        if ((pntY<squareY+width)&&(pntY>squareY)){
            return 1;
        }                     
    }
    return false;                
}
//rand number helper function
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
//function that returns point value of a tile for scoring and formatting tiles
function returnPointvalue(letter){
    return points[letter];
}


//Tile Scoring Area - Methods
//Tile Scoring Area - Methods
//Tile Scoring Area - Methods
function scoreHandler(inplayList){
    
    if((checkforPlay("col",inplayList)&&(!checkforPlay("row", inplayList)))){
        handleColplay(inplayList);
        return;
    }
    
    if((!checkforPlay("col",inplayList)&&(checkforPlay("row", inplayList)))){
        handleRowplay(inplayList);
        return;
    }
    
    if((checkforPlay("col",inplayList)&&(checkforPlay("row", inplayList)))){
        handleSingletileplay(inplayList);
        return;
    }
    
}


function checkforPlay(type, inplayList){
    if(type === "row"){
        for (var w = 0; w < inplayList.length; w++){
            RowVal = getstartvalY(inplayList);
            if ((inplayList[w].fresh === true)&&(inplayList[w].yVal != RowVal)){
                return 0;
                break;
            }   
        //console.log("Passed Test 1 Row " + inplayList[w].letterVal);
        }
        
    return 1;
    }
    
    else{
        
        for (var w = 0; w < inplayList.length; w++){
            colVal = getstartvalX(inplayList);
            if ((inplayList[w].fresh === true)&&(inplayList[w].xVal != colVal)){
                return false;
                break;
            }
        //console.log("Passed Test 1 Col " + inplayList[w].letterVal);
        }
    return 1;       
    }   
}

//Can be condensed together
function getStartval(inplayList){
    for (var w = 0; w < inplayList.length; w++){
            if (inplayList[w].fresh === true){
                startVal = inplayList[w].iD; 
                //console.log(startVal);
                return startVal;
            }
    }
}
//Can be condensed together
function getstartvalX(inplayList){
    for (var w = 0; w < inplayList.length; w++){
            if (inplayList[w].fresh === true){
                return inplayList[w].xVal;
            }
    }
}
//Can be condensed together
function getstartvalY(inplayList){
    for (var w = 0; w < inplayList.length; w++){
            if (inplayList[w].fresh === true){
                return inplayList[w].yVal;
            }
    }
}


function handleSingletileplay(inplayList){
    var startVal = getStartval(inplayList);
    
    var bottomVal = getbottomVal(startVal, inplayList);
    var topVal = gettopVal(startVal, inplayList); 
    var rightVal = getrightVal(startVal, inplayList);
    var leftVal = getleftVal(startVal, inplayList);
    
    if(bottomVal!=topVal){
        
        var wordLength = ((bottomVal - topVal)/boardxy);
        var res = testColword(topVal, wordLength, inplayList);
        
        if(res === true){
            console.log("SINGLE TILE UP DOWN A WORD!!");
            indicateRightandlock(); 
                
        } else{
                
            console.log("SINGLE TILE UP DOWN NOT A WORD!!");
            indicateWrong();
            return;
        }
    }
        

    
    if(leftVal!=rightVal){
        var wordLength = rightVal - leftVal;
        var res = testRowword(leftVal, wordLength, inplayList);
        
        if(res === true){
            console.log("SINGLE TILE LEFT RIGHT A WORD!!");
            indicateRightandlock();  
        }else{
            console.log("SINGLE TILE LEFT RIGHT NOT A WORD!!");
            indicateWrong(); 
            return;
        }
        
    }

        
    if((leftVal == rightVal)&&(bottomVal == topVal)){
        console.log("BAD PLAY SINGLE TILE!!");
        return;
    }
    
}


//Col Check Methods
function handleColplay(inplayList){
    var startVal = getStartval(inplayList); 
    var bottomVal = getbottomVal(startVal, inplayList);
    var finaltestCol = gaptestCol(bottomVal, inplayList);
    
    var currentScore =0;
    
    if(finaltestCol == false){
        console.log("Bad Play Col: Gap - STOP!!");
        return;
    }
    
    var topVal = gettopVal(startVal, inplayList);
    var wordLength = ((bottomVal - topVal)/boardxy);
    //console.log("wordLengthValue is: " + wordLength);
    //begin to push characters on string
    testColword(topVal, wordLength, inplayList).then(function(res){
        if(res){
            console.log("MAIN COL Word IS A WORD!!");
            testperpendicularRows(inplayList).then(function(goodperpPlay){
                console.log("goodperprowPlay: " + goodperpPlay);
                if(goodperpPlay){
                    indicateRightandlock(); 
                }else{
                    console.log("Some ROW Subword NOT A WORD!!");
                    indicateWrong();
                }
            });
            
        }else{
            console.log("MAIN WORD NOT A WORD!!");
            indicateWrong();
        }
    });   
}
function getbottomVal(topmostLocation, inplayList){    
    var result; 
    var query = topmostLocation + boardxy;  //start at topmostlocation and move down the column     
    var w = 1; 
    while(true){
        result = $.grep(inplayList, function(e){ return e.iD == query; });
        if (result.length == 0) {
            return query - boardxy; //subtrack away one because was incremented to test next space
        }else{
            w++;
            query = topmostLocation + w*boardxy; 
        }
    }
}
function gaptestCol(bottomLocation, inplayList){
    for (var w = 0; w < inplayList.length; w++){
            if ((inplayList[w].fresh === 1)&&(inplayList[w].iD > bottomLocation)){
                return false;
            }
    }
}
function gettopVal(topmostLocation, inplayList){    
    var result; 
    var query = topmostLocation - boardxy;  //start at topmostlocation and move up the column - so subtract    
    var w = 1; 
    while(true){
        result = $.grep(inplayList, function(e){ return e.iD == query; });
        if (result.length == 0) {
            return query + boardxy; //addone because was incremented to test next space (which is decrement going up column)
        }else{
            w++;
            query = topmostLocation - w*boardxy; 
        }
    }
}
function testColword(start, length, inplayList){  

    var query = start;
    var testString = "";
    var result;
    
    
    for(var i = 0; i<=length; i++){
        query = start+i*boardxy; 
        result = $.grep(inplayList, function(e){ return e.iD == query; })[0];
        testString+=result.letterVal;
    }
    
    console.log("Testing!! " + testString);
    
    return isaWord(testString).then(function(returnval){
        console.log("Done with Is Word Promise Col");

        if(returnval){
            return scoreColword(start, length, inplayList);; 
        }else{
            return false;
        }
    });
}
function testperpendicularRows(inplayList){  

    var playStatus = true;
    
    var promise = new Promise(function(resolve, reject) {
    
        for (var w = 0; w < inplayList.length; w++){
            if (inplayList[w].fresh === true){
                startVal = inplayList[w].iD; 
                var rightVal = getrightVal(startVal, inplayList);
                var leftVal = getleftVal(startVal, inplayList);
                var wordLength = ((rightVal - leftVal));
                if(wordLength!=0){
                    testRowword(leftVal, wordLength, inplayList).then(function(res){
                        console.log("Returned Val: " + res);
                    //console.log(startVal);
                        if(res){
                            console.log("SUB Word IS A WORD: Perpendicular Row!!");
                        }else{

                            console.log("Bad Play: Perpendicular Row - STOP!!");   
                            playStatus = false;
                        }
                    });
                }
            }
        }

        resolve(playStatus);

    });
    
    console.log("playStatus resolved perpRows: " + playStatus);
    return promise;

}
function scoreColword(start, length, inplayList){  

    var query = start;
    var result;
    
    var subScore = 0;
    var multiplier = 1;
    
    for(var i = 0; i<=length; i++){
        query = start+i*boardxy; 
        result = $.grep(inplayList, function(e){ return e.iD == query; })[0];
        
        if((result.bonus!= "  ")&&(result.bonus!=undefined)){
            if(result.bonus=="TL"){
                subScore = subScore + returnPointvalue(result.letterVal) * 3;
            }
            if(result.bonus=="DL"){
                subScore = subScore + returnPointvalue(result.letterVal) * 2;
            }
            if(result.bonus=="TW"){
                multiplier = multiplier * 3;
                subScore = subScore + returnPointvalue(result.letterVal);
            }
            if(result.bonus=="DW"){
                multiplier = multiplier * 2;
                subScore = subScore + returnPointvalue(result.letterVal);
            }
        }else{
            
            subScore = subScore + returnPointvalue(result.letterVal);
        }
    }
    subScore = subScore * multiplier;
    $(".scoreIndicator").text(subScore);
    return subScore;
}
//END Col Score Methods

//Row Check Methods
function handleRowplay(inplayList){
    var startVal = getStartval(inplayList); 
    var rightVal = getrightVal(startVal, inplayList);
    var finaltestRow = gaptestRow(rightVal, inplayList);
    
    if(finaltestRow == false){
        console.log("Bad Play Row: Gap - STOP!!");
        return false;
    }
    
    var leftVal = getleftVal(startVal, inplayList);
    var wordLength = ((rightVal - leftVal));
    //console.log("wordLengthValue is: " + wordLength);
    testRowword(leftVal, wordLength, inplayList).then(function(res){
        console.log("Returned Val: " + res);
        
        if(res){
            console.log("MAIN ROW Word IS A WORD!!");
            testperpendicularCols(inplayList).then(function(goodperpPlay){
                console.log("goodperpColPlay: " + goodperpPlay);
                if(goodperpPlay){
                    indicateRightandlock(); 
                }else{
                    console.log("Some COL Subword NOT A WORD!!");
                    indicateWrong();
                }
            });
            
        }else{
            console.log("MAIN WORD NOT A WORD!!");
            indicateWrong();
        }
           
    });
    //begin to push characters on string
    
}
function getrightVal(leftmostLocation, inplayList){    
    var result; 
    var query = leftmostLocation + 1;  //start at lefgmostlocation and move left on the row     
    var w = 1; 
    while(true){
        result = $.grep(inplayList, function(e){ return e.iD == query; });
        if (result.length == 0) {
            return query - 1; //subtrack away one because was incremented to test next space
        }else{
            w++;
            query = leftmostLocation + w; 
        }
    }
}
function gaptestRow(rightlocation, inplayList){
    for (var w = 0; w < inplayList.length; w++){
            if ((inplayList[w].fresh === 1)&&(inplayList[w].iD > rightlocation)){
                return false;
            }
    }
}
function getleftVal(leftmostLocation, inplayList){    
    var result; 
    var query = leftmostLocation - 1;  //start at lefgmostlocation and move left on the row     
    var w = 1; 
    while(true){
        result = $.grep(inplayList, function(e){ return e.iD == query; });
        if (result.length == 0) {
            return query + 1; //subtrack away one because was incremented to test next space
        }else{
            w++;
            query = leftmostLocation - w; 
        }
    }
}
function testRowword(start, length, inplayList){  

    var query = start;
    var testString = "";
    var result;
    
    
    for(var i = 0; i<=length; i++){
        query = start+i; 
        result = $.grep(inplayList, function(e){ return e.iD == query; })[0];
        testString+=result.letterVal;
    }
    
    console.log("Testing!! " + testString);

    return isaWord(testString).then(function(returnval){
        console.log("Done with Is Word Promise Row");
        if(returnval){
            return scoreRowword(start, length, inplayList);
        }else{
            return false;
        }
    });

}
function testperpendicularCols(inplayList){      
    
    var playStatus = true;
    
    var promise = new Promise(function(resolve, reject) {
        
        
        for (var w = 0; w < inplayList.length; w++){
            if (inplayList[w].fresh === true){
                startVal = inplayList[w].iD; 
                var bottomVal = getbottomVal(startVal, inplayList);
                var topVal = gettopVal(startVal, inplayList);
                var wordLength = ((bottomVal - topVal)/boardxy);

                if(wordLength!=0){
                    testColword(topVal, wordLength, inplayList).then(function(res){
                //console.log(startVal);
                        if(res){
                            console.log("SUB Word IS A WORD: Perpendicular Col!!");
                        }else{

                            console.log("Bad Play: Perpendicular Col - STOP!!");  
                            playStatus = false;
                        }
                    });
                }
            }
        }
        
        resolve(playStatus);
        
    });
    
     console.log("playStatus resolved perpCols: " + playStatus);
     return promise;
}
function scoreRowword(start, length, inplayList){  

    var query = start;
    var result;
    
    var subScore = 0;
    var multiplier = 1;
    
    
    
    for(var i = 0; i<=length; i++){
        query = start+i; 
        result = $.grep(inplayList, function(e){ return e.iD == query; })[0];
        
        if((result.bonus!= "  ")&&(result.bonus!=undefined)){
            if(result.bonus=="TL"){
                subScore = subScore + returnPointvalue(result.letterVal) * 3;
            }
            if(result.bonus=="DL"){
                subScore = subScore + returnPointvalue(result.letterVal) * 2;
            }
            if(result.bonus=="TW"){
                multiplier = multiplier * 3;
                subScore = subScore + returnPointvalue(result.letterVal);
            }
            if(result.bonus=="DW"){
                multiplier = multiplier * 2;
                subScore = subScore + returnPointvalue(result.letterVal);
            }
        }else{
            
            subScore = subScore + returnPointvalue(result.letterVal);
        }
    }
    subScore = subScore * multiplier;
    $(".scoreIndicator").text(subScore);
    return subScore;
}
//End Row Score Methods

function isaWord(testWord){
    
    var baseuri = "http://api.wordnik.com:80/v4/word.json/"; 
    var word = testWord;
    var theRest = "/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=005e228be6690fb08500a0521b4058f1441f25d7df48d1930";
    var finalAddress = baseuri + word + theRest;
   
    return $.getJSON( finalAddress, function( data ) {
     
    }).then(function(data) {
        console.log(".get JSON DONE!")
        //console.log(data);
        console.log(data);
        if($.isEmptyObject(data)){
            console.log("NOT A WORD AJAX: " + word);
            return false;
        }else{
            console.log("IS A WORD AJAX: " + word);
            return true;
        }
    });
    
    
//    $.ajax({
//        dataType: "json",
//        url: url,
//        data: data,
//        success: success
//    });
    
    
//    var baseuri = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/"; 
//    var word = testWord;
//    var theRest = "?key=66692fc8-763e-4328-9575-f6ac1888c2d5";
//    var finalAddress = baseuri + word + theRest;
//    $.get(finalAddress, function(data){
//        
//        005e228be6690fb08500a0521b4058f1441f25d7df48d1930
//        http://api.wordnik.com:80/v4/word.json/tresd?useCanonical=false&includeSuggestions=false&api_key=
//        
//        
//        var json = $.xml2json(data);
//        console.log(json);
//        console.log(json["#document"].entry_list.suggestion);
//        if(json["#document"].entry_list.suggestion === undefined){
//            console.log("GOOD WORD REST: " + testWord);
//            return true;
//        }else{
//            console.log("BAD WORD REST: " + testWord);
//            return false;
//        }
//        
//
//    }, 'xml')
    
//  $.getJSON('http://www.dictionaryapi.com/api/v1/references/collegiate/xml/test?key=66692fc8-763e-4328-9575-f6ac1888c2d5', function(data){
//    console.log(data);
//  });
    
    
}
function indicateWrong(){
    $(".tileNatural.onboardFresh").addClass("tileWrong");
    setTimeout(function () {
        $(".tileNatural.onboardFresh").toggleClass("tileWrong");
    }, 1000);

}
function indicateRightandlock(){
    $(".tileNatural.onboardFresh").each(function( index ){
        if(!$(this).data("locked")){
            $(this).draggable( "destroy" );  
            $(this).addClass("tileLocked");
            $(this).data("locked", true);
            $(this).removeClass("onboardFresh");
        }
        
    });
    $(".gameSpaces.onboardFresh").data("locked", true);
}
//END Methods
//END Methods
//END Methods
//END Methods


//Event Listners
//Event Listners
//Event Listners
//Event Listners
//When the "p" is clicked check whatever word is in the box and change the text box color - Tester
$( ".form" ).click(function() {
    var found = 0;
    for(i = 0; i < wordArray.length; i++){
        testString = wordArray[i].replace(/(\r\n|\n|\r)/gm,"");
        //alert(testString);
        if($(".tBox").val() == testString){
            found = 1;
            $(".tBox").css("background-color","green");
        }
    } 
    if(!found){
        $(".tBox").css("background-color","red");
    }   
});


$(".container").click(function(event) {//Should be mouseup when building the rest - HH
            // console.log("mouseup on " +  $(d).css("left") + " " + $(d).css("top"));
    
    var relX = event.pageX - $(".container").offset().left;
    var relY = event.pageY - $(".container").offset().top;   
    //console.log("relX : " + relX + " Y:  " + relY);

    for(var i=0; i < gameBoard.length; i++){
        if(isIntersectingsquare(relX, relY, gameBoard[i].homeX, gameBoard[i].homeY, tileWidth)){
            console.log("Tile Pressed " + gameBoard[i].homeX + " " + gameBoard[i].homeY);
        }
    }

});

$(".gameSpaces").droppable({

    accept: ".tileNatural",
    // over: function(event, ui){
    //     $(this).addClass('gamespace_hover');
    // },
    // out: function(event, ui){
    //     $(this).removeClass('gamespace_hover')
    // }, 
    tolerance: "pointer",
    hoverClass: "gamespace_hover",
    drop: function(event, ui){
        //get position of space relative to tilearea to avoid doing anything unnecesary 
        var relX = $(this).offset().left - $(".tileArea").offset().left;
        var relY = $(this).offset().top - $(".tileArea").offset().top;
        //Make tile move to the location of the space: -2 there to account for margin - should fix

        //$(this)
        //$(d).data("onboard", 0);
        if($(this).data("storedtileId")==0){
        	
        	//handle visual aspect of dropped tile
        	ui.draggable.css("left", relX -2); 
        	ui.draggable.css("top",  relY  -2); 

        	//handle logical aspect of dropped tile
        	$(this).data("storedtileId", ui.draggable.data("iD")); //set the stored tile on gameSpace to id of tile
        	ui.draggable.data("spaceonId", $(this).data("iD")); //set the gamespaceId to of the tile object in question
            $(this).data("letterVal", ui.draggable.text());
            
            ui.draggable.addClass("onboardFresh");
            $(this).addClass("onboardFresh");

        	//append 
        	// ui.draggable.css("left",-2); 
        	// ui.draggable.css("top",  -2); 
        	// $(this).append(ui.draggable);
        	
    	}else{
    		console.log("Tile Found");
    		ui.draggable.css("left", ui.draggable.data("homeX")); //change to home locationX
            ui.draggable.css("top", ui.draggable.data("homeY")); //change to home locationY
    	}

       	//console.log("relX: " + relX);
        //console.log("relY: " + relY);
    
    }

});
// Make tiles draggable.
$(".tileNatural").draggable({

    // Find original position of dragged image.
    stack: ".tileNatural",
    start: function(event, ui) {


    	if($(this).data("spaceonId") != 0){
    		removetilefromSpace($(this).data("spaceonId"));//remove tile from space from a logical perspective
    		$(this).data("spaceonId", 0);//remove space from tile from a logical perspective 
            $(this).removeClass("onboardFresh");
    	}
        
    },

    // Find position where image is dropped. Handle drops outsite of board area
    stop: function(event, ui) {

        clickedTile = this;

        var mouseX = event.pageX - $(".container").offset().left;
        var mouseY = event.pageY - $(".container").offset().top; 

        if(isIntersectingsquare(mouseX, mouseY, parseInt($(".container").css("left")),  parseInt($(".container").css("top")) , parseInt($(".container").css("width")))){
            //Tile dropped over the board
        }else{//Tile dropped over location not on board - send home
 			$(clickedTile).css("left", $(clickedTile).data("homeX")); //change to home locationX
            $(clickedTile).css("top", $(clickedTile).data("homeY")); //change to home locationY
//            removetilefromSpace($(this).data("spaceonId"));//remove tile from space from a logical perspective
//    		$(this).data("spaceonId", 0);//remove space from tile from a logical perspective 
//            $(this).removeClass("onboardFresh");
    
        }


    }
});

//Tile Scoring Area - Event Listener button
//Tile Scoring Area - Event Listener button
//Tile Scoring Area - Event Listener button

//When the "checkBtn" is clicked create a scoring object (list of played and locked tiles) to be passed to the scoreHandler 
$( ".checkBtn" ).click(function() {
    console.log("*****Start of Play*****")
    var scoringObject = [];
    var newtileFound = false;
    
    $(".gameSpaces").each(function( index ){
        
        var entry = new Object();
        
        if($(this).data("storedtileId")!=0){
            //location info and letter
            entry.xVal = $(this).css("left");
            entry.yVal = $(this).css("top");
            entry.letterVal = $(this).data("letterVal")[0];
            entry.iD = $(this).data("iD")
            
            //assume locked
            entry.fresh = false;
//            console.log("Lock Status Tile: " + $(".tileNatural.onboardFresh").data("locked"));
//            console.log("Lock Status Space: " + $(this).data("locked"));
            if($(this).data("locked")==false){//if tile is fresh to board
//                console.log("HERE");
                newtileFound = true;
                entry.fresh = true;
                entry.bonus = $(this).text();
                
            }      
        
            scoringObject.push(entry);
        }
        
	});

    if(newtileFound){
        scoreHandler(scoringObject);
    }else{
        console.log("no new tiles");
    }
    
    
});




//End Event Listners
//End Event Listners
//End Event Listners
//End Event Listners

