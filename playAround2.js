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

// var dropOptions = {
//     accept: ".tileNatural",
//     over: function(event, ui){
//         $(this).addClass('gamespace_hover');
//     },
//     out: function(event, ui){
//         $(this).removeClass('gamespace_hover')
//     }, 
//     drop: function(event, ui){
//         //code 
//     }
// }
//$(d).droppable(dropOptions); - use this with above dropOptions decleration


$(document).ready(function() {

    //GOOD EXAMPLE HERE
    // $(".container").on('mouseenter', '.gameSpaces', function(){
    //     $(this).addClass('gamespace_hover');
    // });

    // $(".container").on('mouseleave', '.gameSpaces', function(){
    //     $(this).removeClass('gamespace_hover');
    // });
    //ready for update and draw here

});//end of .ready

//Methods
//Methods
//Methods
//Methods
//Methods

// function drawGamecomponents(){

//  for(var i=0; i < 30; i++){
//      if(tileList[i].played ==0){//Only display tiles that have not been played here
//          d = document.createElement('div');
//          $(d).css("left", tileList[i].homeX);
//             $(d).css("top", tileList[i].homeY);
//             $(d).text(tileList[i].value);
//             $(d).addClass("onboardFormat");
//             $(d).addClass("boardspace");
//             $(d).addClass("tileNatural");
//             $(d).appendTo($(".tileArea"));
//      }
//         console.log(tileList[i].value);
//     }

// }

//create board objects for DOM and memory - initialization
function createBoardspaces(){

    // Create Spaces that go on the board, logical plus styling aspects
    for (var n = 0; n <= 11; n++){
        for (var j = 0; j <= 11; j++){
            //Draw Main Play Board here
            //Since One Time Deal, will leave here instead of 'draw' function
            d = document.createElement('div');
            var space = new Object();

            space.homeX = Math.floor(j*tileWidth);;
            space.homeY = Math.floor(n*tileWidth);

            space.letterVal = "";
            space.locked = 0;

            $(d).css("left",  space.homeX);
            $(d).css("top",  space.homeY);
            $(d).addClass("onboardtextFormat");
            $(d).addClass("onboardvisFormat");
            $(d).addClass("gameSpaces");

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

            $(d).draggable().css("position", "absolute");

            //physically let tile know where it first lives change left and top to change location later
            $(d).css("left", tile.startingX);
            $(d).css("top", tile.startingY);

            //Let know where current home is so it can return there
            $(d).data( "homeX", tile.startingX );
            $(d).data( "homeY", tile.startingY );

            // $(d).css("transform", "scale(1,1)");
            $(d).text(tile.value);
            $(d).addClass("onboardtextFormat");
            $(d).addClass("onboardvisFormat");
            $(d).addClass("tileNatural");
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
        console.log('Dropped the Object');

        var relX = $(this).offset().left - $(".tileArea").offset().left;
        var relY = $(this).offset().top - $(".tileArea").offset().top;

        //remove from tile div
        ui.draggable.css("left", relX -2); 
        ui.draggable.css("top", relY  -2); 

       	console.log("relX: " + relX);
        console.log("relY: " + relY);
        //ui.draggable.css(("zIndex", "1000"));    
    }

});
// Make images draggable.
$(".tileNatural").draggable({

    // Find original position of dragged image.
    stack: ".tileNatural",
    start: function(event, ui) {

        // Show start dragged position of image.
        //var Startpos = $(this).offset();
        //console.log("START: \nLeft: "+ Startpos.left + "\nTop: " + Startpos.top);
        console.log("Start Mouse: \nLeft: "+ event.pageX + "\nTop: " + event.pageY);
    },

    // Find position where image is dropped.
    stop: function(event, ui) {
        clickedTile = this;
        // Show dropped position.
        
        var mouseX = event.pageX - $(".container").offset().left;
        var mouseY = event.pageY - $(".container").offset().top; 

        //var Stoppos = $(this).offset();
        //console.log("STOP: \nLeft: "+ Stoppos.left + "\nTop: " + Stoppos.top);
        //console.log("End Mouse: \nLeft: "+ event.pageX + "\nTop: " + event.pageY); //event.pageY - mouse y
        //console.log("Container PosX: " + $(".container").css("left") + " " + "Container Width: " + $(".container").css("width"));
        //$(".container").css("width") is subbing for 
        //console.log("relX : " + mouseX + " Y:  " + mouseY + "Left Container: " + parseInt($(".container").css("left")) + " Top Container: " + parseInt($(".container").css("top")) + " Width: " + parseInt($(".container").css("width")));
        //console.log("boardWidth " + boardWidth)


        if(isIntersectingsquare(mouseX, mouseY, parseInt($(".container").css("left")),  parseInt($(".container").css("top")) , parseInt($(".container").css("width")))){
            //Tile dropped over the board

            //iterate over .gameSpaces
            $( ".gameSpaces" ).each(function( index ) {
                var gameSpace = this; 
                //console.log(index + ": " + $( this ).text() );
                if(isIntersectingsquare(mouseX, mouseY, parseInt($(gameSpace).css("left")),  parseInt($(".container").css("top")) , parseInt($(".container").css("width")))){

                }
                //see which one is in question with isIntersecting(mouseX, mouseY, $(gameSpace).css("left"), top, width )
                //if in question
                    //Determine what is happening in this tile
                        //if nothing 
                            //place tile by doing....... 

                        //if something determine what and send home 


            });
            


            console.log("In Game Board");




        }else{//Tile dropped over location not on board
            $(clickedTile).css("left", $(clickedTile).data("homeX")); //change to home locationX
            $(clickedTile).css("top", $(clickedTile).data("homeY")); //change to home locationY
            console.log("NOT - In Game Board");
        }


    }
});

//Determine which tile has been selected
// $(".tileNatural").click(function(event) {
//             // console.log("mouseup on " +  $(d).css("left") + " " + $(d).css("top"));
    
//     //console.log("Tile Area Clicked"); 
//     //console.log("client X: " + event.clientX + " Y:  " + event.clientY);  
//     // var relX = event.pageX - $(".tileArea").offset().left;
//     // var relY = event.pageY - $(".tileArea").offset().top;   
    
//     //console.log("relX : " + relX + " Y:  " + relY);
//     console.log("scale value: " + $(this).css("transform")[7]);

//     if($(this).css("transform")[7] == 2){return false;}

//     var activeX = Math.round($(this).position().left); 
//     var activeY = Math.round($(this).position().top); 
//     var memId= getId("tile", activeX, activeY);

//    //Handle Formating first so the sizes are right when comparing next input
//     $( ".tileNatural" ).each(function( index ) {
//         if((activeX === Math.round($(this).position().left))&&(activeY === Math.round($(this).position().top))){
//             $(this).css("transform", "scale(2,2)");
//         }else{
//             $(this).css("transform", "scale(1,1)");
//         }
//     });

//     //Handle Object
//     for(var i = 0; i < tileList.length; i++){
//         if(i != memId){
//            tileList[i].selected = 0;
//         }else{
//            tileList[i].selected = 1;
//         }
//     }

 
//         // for(var i = 0; i < tileList.length; i++){
//         // if(i != memId){
//         //     $(this).css("transform", "scale(1,1)");
//         // }else{
//         //     $(this).css("transform", "scale(2,2)");
//         // }
//    // }



    
    
// });
//End Event Listners
//End Event Listners
//End Event Listners
//End Event Listners
