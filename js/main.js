// (C) 2018 High Quality Ideas LLC
// v2.0.1

$( document ).ready(function() {
    console.log( "yoyoyo" );

});

var holeScore;
var totalScore = 0;


$( ".hole-row" ).click(function() {
  holeScore = $( this ).find(".hole-score").html();
  
  // TODO: Add something to catch people when they hit 6 strokes?
  holeScore++;
  totalScore++;
  
  // Increment the score here
  $( this ).find(".hole-score").html(holeScore);
  
  // Increment the total score
  $(".ts-number").html(totalScore);
  
  
  
  console.log("score click" + holeScore);
});