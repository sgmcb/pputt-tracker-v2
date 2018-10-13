// (C) 2018 High Quality Ideas LLC
// v2.0.1



// CONFIG VALUES
var localStorageTimeout = 6;    // the number of hours (from game start) after which the localStorage will clear itself

var posWindowWidth = 2;  // How large of a window do we leave editable around the estimated position?

// ----

var holeScore;  // Holds the score of the hole during its editing
var totalScore = 0; // Holds the total course score
var editingHole;

var estCoursePos = 1;   // Holds the position (i.e. hole) where we believe that the player is on the course



var nowSecs;

// DOCUMENT READY
$( document ).ready(function() {
  console.log( "yoyoyo" );

  var now = new Date();
  nowSecs = now.getTime()/1000;
  console.log("Current time is: " + nowSecs +" (in epoch-seconds)");
  
  // Check if this is a new game
  if ( isNewGame(nowSecs) ) {
    console.log("Let the games begin!");
    localStorage.setItem('prevGameStart',nowSecs);
    
    setTotalScore(0);
    
    
  }
  
  else {
    loadScoresFromStorage();
  }

  
  
  
  
  

});


// NEW GAME DETECTION
// For now, simple timestamp comparison
// TODO: Default state should be true? Only false IFF it detects valid previous scores...

function isNewGame(nowSecs) {
  
  var prevGameStart = window.localStorage.getItem('prevGameStart');
  console.log("Last game started at: " + prevGameStart);
  var timeSince = nowSecs - prevGameStart; // calculate the time since we last started a game on this device (in seconds)
  var timeoutInSecs = (localStorageTimeout*60*60);
  
  console.log("Time since last game start=" + timeSince + " (seconds)");
  
  if( timeSince < timeoutInSecs ) {
    return false;
  }
  
  else {
    window.localStorage.clear();
    console.log("localStorage cleared");
      
    return true;    
  }
}





// Loading existing scores...

function loadScoresFromStorage() {
  
  // Load and update on-screen total score
  var ls_totalScore = window.localStorage.getItem('totalScore',totalScore);
  $(".ts-number").html(ls_totalScore);
  
  // Load and update all hole scores
  // for-loop
  
  
  
  
  
}



// SCORE TRACKING
// On click/tap of any row...

$( ".hole-row" ).click(function() {
  
  // Which hole are we editing with this click?
  editingHole = $(this).attr("id");
  
  // -----------------------
  // COURSE POSITION UPDATES
  
  // estCoursePos is updated, but only ever increases
  if ( editingHole >= estCoursePos ) {
    estCoursePos = parseInt(editingHole) + 1;
    console.log("New estCoursePose="+estCoursePos);
  }

  // Updating estimated course position
  if(editingHole >= (estCoursePos+posWindowWidth)) {
    
    
  }
  
  // ----------------
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
  console.log("Update: Hole=" + editingHole + " // Score=" + holeScore);
  setHoleScore(editingHole, holeScore);
  setTotalScore(totalScore);
  
  
  
  
  
});


// SET HOLE SCORE
// Combined update of on-screen, displayed score, and localStore value
function setHoleScore(hole, strokes) {
  $(".h"+editingHole).html(strokes);// Find hole score element even more simply?
  window.localStorage.setItem(editingHole, strokes);
  
}


// SET TOTAL SCORE
// Combined update of on-screen, displayed score, and localStore value
function setTotalScore(strokes) {
  $(".ts-number").html(strokes);
  window.localStorage.setItem('totalScore', strokes);
}


// DEBUG ONLY: Clear Local Storage on Header Click


$(".header").click(function() {
  window.localStorage.clear();
  console.log("localStorage cleared");
  
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