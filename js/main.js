// (C) 2018 High Quality Ideas LLC
// v2.0.1



// CONFIG VALUES
var localStorageTimeout = 6;    // the number of hours (from game start) after which the localStorage will clear itself

var posWindowWidth = 2;  // How large of a window do we leave editable around the estimated position?

// ----

var holeScore;  // Holds the score of the hole during its editing
var totalScore; // Holds the total course score

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
  
  console.log ("Loading scores from localStorage...");
  

  // Load and update all hole scores
  var hole;
    
  for (hole = 1; hole <= 18; hole++) {
    if( score = window.localStorage.getItem('h'+hole) ) {
      console.log("Stored score for Hole "+hole+" = " + score);
    }
    else {
      score = 0; 
    }
    setHoleScore(hole,score);
    
  }
  
  // Load and update on-screen total score
  var totalScore = window.localStorage.getItem('totalScore',totalScore);
  $(".ts-number").html(totalScore);
  
  // TODO: This reload seems to be failing somehow; it's loading total score numbers lower than the sum of all the hole scores; better to just sum them up as we load them in and set that as the total score value here?
  
  
  
}



// SCORE TRACKING
// On click/tap of any row...

$( ".hole-row" ).click(function() {
  
  // Which hole are we editing with this click?
  var editingHole;
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
  
  holeScore = $(".h"+editingHole).html(); // get the hole's current score value

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
  console.log("setting hole " + hole + " score to " + strokes);
  $(".h"+hole).html(strokes);// Find hole score element even more simply?
  window.localStorage.setItem('h'+hole, strokes);
  
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