Math.seedrandom(0228);
const htmlFontsize = 10; //usse this to handle rem in js
const tileWidth = 5.4*htmlFontsize; //usse this to handle 
const boardWidth = 12.0*tileWidth;

var wordArray = [];
var gameBoard = [];
var tileList = [];
var playedWord ="";
var consonants = "bcdfghjklmnpqrstvwxyz";
var vowels = "aeiou";
var selectedTileobject;

//Go ahead and start getting the large file ASAP and setting up objects and DOM
//need to do this first to make adding even listners less of a headache
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
            $(d).data("onboard", 0);
            $(d).data("committed", 0);

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


            //logical data needed for visual support
            //Let know where current home is so it can return there
            $(d).data( "homeX", tile.startingX );
            $(d).data( "homeY", tile.startingY );

            //what space am I on
            $(d).data("spaceonId", 0);

            //what tile am I
            $(d).data("iD", tileId);
            tileId++;

            

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

//Return the index, works for tiles or gameBoard 
function getId(type, xVal, yVal){
    //console.log("Finding X: " + xVal + " Y: " + yVal);
    if(type==="tile"){
    //Find Object in Memory
        for(var i=0; i < tileList.length; i++){
            if((xVal==tileList[i].realX)&&(yVal == tileList[i].realY)){
                return i;
            }
        }
    }
    console.log("XValue: " + xVal + " YValue: " + yVal);
    alert("Something isn't right");
}

function removetilefromSpace(testSpace){
	$(".gameSpaces").each(function( index ){
		if($(this).data("iD")==testSpace){
			$(this).data("storedtileId", 0); //what space is on me
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
    return 0;                
}

//rand number helper function
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//function that returns point value of a tile for scoring and formatting tiles 
function returnPointvalue(letter){

    if(letter=='a'){
        return 1;
    }

    if(letter=='b'){
        return 3;
    }

    if(letter=='c'){
        return 3;
    }

    if(letter=='d'){
        return 2;
    }

    if(letter=='e'){
        return 1;
    }

    if(letter=='f'){
        return 4;
    }

    if(letter=='g'){
        return 2;
    }
    if(letter=='h'){
        return 4;
    }
    if(letter=='i'){
        return 1;
    }
    if(letter=='j'){
        return
    }
    if(letter=='k'){
        return 5;
    }
    if(letter=='l'){
        return 1;
    }
    if(letter=='m'){
        return 4;
    }
    if(letter=='n'){
        return 1;
    }
    if(letter=='o'){
        return 1;
    }
    if(letter=='p'){
        return 3;
    }
    if(letter=='q'){
        return 10;
    }
    if(letter=='r'){
        return 1;
    }
    if(letter=='s'){
        return 1;
    }
    if(letter=='t'){
        return 1;
    }
    if(letter=='u'){
       return 1;
    }
    if(letter=='v'){
       return 4;
    }
    if(letter=='w'){
        return 4;
    }
    if(letter=='x'){
        return 8; 
    }
    if(letter=='y'){
        return 4;
    }
    if(letter=='z'){
        return 10;
    }
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

        console.log('Dropped the Object In Droppable Area - Gamespace');

        //get position of space relative to tilearea to avoid doing anything unnecesary 
        var relX = $(this).offset().left - $(".tileArea").offset().left;
        var relY = $(this).offset().top - $(".tileArea").offset().top;
        //Make tile move to the location of the space: -2 there to account for margin - should fix

        //$(this)
        //$(d).data("onboard", 0);
        if($(this).data("storedtileId")==0){

        	console.log("No Tile Found");
        	
        	//handle visual aspect of dropped tile
        	ui.draggable.css("left", relX -2); 
        	ui.draggable.css("top", relY  -2); 

        	//handle logical aspect of dropped tile
        	$(this).data("storedtileId", ui.draggable.data("iD")); //set the stored tile on gameSpace to id of tile
        	ui.draggable.data("spaceonId", $(this).data("iD")); //set the gamespaceId to of the tile object in question

        	
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

    	console.log("Start Drag: \nLeft: "+ event.pageX + "\nTop: " + event.pageY);

    	if($(this).data("spaceonId") != 0){
    		removetilefromSpace($(this).data("spaceonId"));//remove tile from space from a logical perspective
    		$(this).data("spaceonId", 0);//remove space from tile from a logical perspective 
    	}
        
    },

    // Find position where image is dropped. Handle drops outsite of board area
    stop: function(event, ui) {

        clickedTile = this;

        var mouseX = event.pageX - $(".container").offset().left;
        var mouseY = event.pageY - $(".container").offset().top; 

        if(isIntersectingsquare(mouseX, mouseY, parseInt($(".container").css("left")),  parseInt($(".container").css("top")) , parseInt($(".container").css("width")))){
            //Tile dropped over the board
             console.log("In Game Board");
        }else{//Tile dropped over location not on board - send home
 			$(clickedTile).css("left", $(clickedTile).data("homeX")); //change to home locationX
            $(clickedTile).css("top", $(clickedTile).data("homeY")); //change to home locationY
            console.log("NOT - In Game Board");
        }


    }
});

//End Event Listners
//End Event Listners
//End Event Listners
//End Event Listners
