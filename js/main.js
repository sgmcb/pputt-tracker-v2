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
var editingHole;

var estCoursePos = 1;   // Holds the position (i.e. hole) where we believe that the player is on the course





// On click/tap
$( ".hole-row.active" ).click(function() {
  editingHole = $(this).attr("id");
  console.log("Editing hole " + editingHole);
  
  
  holeScore = $( this ).find(".hole-score").html();
  
  
  
  // What to do if the score is at 6...  
  if(holeScore==6) {
    console.log("Score cannot exceed 6.");
    holeScore=1;
    totalScore = totalScore - 5;
  }
  
  // Regular score
  else {
    holeScore++;
    totalScore++;    
  }
  
  
  
  

  
  // Increment the total score here
  //$( this ).find(".hole-score").html(holeScore);
  $( this ).find(".h"+editingHole).html(holeScore);
  
  // Increment the total score
  $(".ts-number").html(totalScore);
  
  
  console.log("score click" + holeScore);
});













// Try to prevent reload
window.onbeforeunload=function() { 
  return 'Please save'
}