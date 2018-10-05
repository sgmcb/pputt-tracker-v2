// (C) 2018 High Quality Ideas LLC
// v2.0.1


/*
function toggleFullScreen() {

  var doc = window.document;
  var docEl = doc.documentElement;
  
  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
};
*/

function goFS() {
  var doc = window.document;
  var docEl = doc.documentElement;
  
  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  
  requestFullScreen.call(docEl);
  
};



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
var posWindowW = 2;  // How large of a window do we leave editable around the estimated position?



$(".header").click(function() {
  goFS();
  
})


// On click/tap
$( ".hole-row" ).click(function() {
  
  // Which hole are we editing with this click?
  editingHole = $(this).attr("id");
  console.log("Editing hole " + editingHole);
  
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
   
  // Update score fields
  $( this ).find(".h"+editingHole).html(holeScore);   // Hole score
  $(".ts-number").html(totalScore);                   // Total score
  
  
  console.log("score click" + holeScore);
});




/*

var hammertime = new Hammer(myElement, myOptions);
hammertime.on('pan', function(ev) {
	console.log(ev);
});

*/





// Try to prevent reload
window.onbeforeunload=function() { 
  alert('Are you sure you want to leave?');
  return 'Please save your scores'
}