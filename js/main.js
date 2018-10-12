// (C) 2018 High Quality Ideas LLC
// v2.0.1



$( document ).ready(function() {
  console.log( "yoyoyo" );
  
  
  

});

var holeScore;  // Holds the score of the hole during its editing
var totalScore = 0; // Holds the total course score
var editingHole;

var estCoursePos = 1;   // Holds the position (i.e. hole) where we believe that the player is on the course
var posWindowW = 2;  // How large of a window do we leave editable around the estimated position?



// On click/tap
$( ".hole-row" ).click(function() {
  
  // Which hole are we editing with this click?
  editingHole = $(this).attr("id");
  //console.log("Editing hole: " + editingHole);
  
  // COURSE POSITION UPDATES
  
  // estCoursePos is updated, but only ever increases
  if ( editingHole > estCoursePos ) {
    estCoursePos = parseInt(editingHole) + 1;
    console.log("New estCoursePose="+estCoursePos);
  }

  // Updating estimated course position
  if(editingHole >= (estCoursePos+posWindowW)) {
    
    
  }
  
  // UPDATE THE SCORE  
  holeScore = $( this ).find(".hole-score").html();

  // IFF Score=6  
  if(holeScore==6) {
    console.log("Score cannot exceed 6.");
    holeScore=1;
    totalScore = totalScore - 5;
    

  }
  
  // Score<6
  else {
    holeScore++;
    totalScore++;    
  }
  
  console.log("Update: Hole=" + editingHole + " // Score=" + holeScore);
   
  // Update score fields
  $( this ).find(".h"+editingHole).html(holeScore);   // Hole score
  window.localStorage.setItem(editingHole, holeScore);
  
  $(".ts-number").html(totalScore);                   // Total score
  window.localStorage.setItem('totalScore',totalScore);
  
  
  
  
  
});




/*

var hammertime = new Hammer(myElement, myOptions);
hammertime.on('pan', function(ev) {
	console.log(ev);
});

*/


// Try to prevent reload
// NB: Appears to have no effect on mobile browsers
/* // NOT USING DURING DEV B/C IT SLOWS ME DOWN — McB
window.onbeforeunload=function() { 
  alert('Are you sure you want to leave?');
  return 'Please save your scores'
}
*/