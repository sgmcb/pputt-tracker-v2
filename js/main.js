// (C) 2018 High Quality Ideas LLC
// v2.0.1

$( document ).ready(function() {
  console.log( "yoyoyo" );

  /* Theoretically, this hides the address bar on mobile
  document.body.requestFullscreen();
  */

});

var holeScore;  // Holds the score of the hole during its editing
var totalScore = 0; // Holds the total course score

var estCoursePos = 1;   // Holds the position (i.e. hole) where we believe that the player is on the course


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