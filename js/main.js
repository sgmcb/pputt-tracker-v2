// (C) 2018 High Quality Ideas LLC
// v2.1.1


// CONFIG VALUES
var localStorageTimeout = 6;    // the number of hours (from game start) after which the localStorage will clear itself

var posWindowWidth = 2;  // How large of a window do we leave editable around the estimated position?



// GLOBAL VARIABLES
var estCoursePos = 1;
var scores = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // Length is 19 so that we can 1-index this
var totalScore = 0;





// NEW GAME DETECTION
function isNewGame(currentTime) {
  
  var prevGameStart = window.localStorage.getItem('prevGameStart');
  console.log("Last game started at: " + prevGameStart);
  var timeSince = nowSecs - prevGameStart; // calculate the time since we last started a game on this device (in seconds)
  var timeoutInSecs = (localStorageTimeout*60*60);
  
  console.log("Time since last game start=" + timeSince + " (seconds)");
  
  if( timeSince < timeoutInSecs ) {
    return false;
  }
  
  else { 
    return true;    
  }  
  
  
  
  
}

// LOADING STORED SCORES

function reloadScores() {
  console.log("Reload scores from memory...");
  
  var i;
  var strokes;
  
  for ( i = 1; i <=18; i++) {
    strokes = parseInt( window.localStorage.getItem('h'+i) );
    
    if( isNaN(strokes) ) {
      strokes = 0;
    }

    // IFF the score for the hole isn't still zero...
    if(strokes > 0) {
      setHoleScore(i, strokes);
      totalScore += strokes;
    }
  }
  
  $(".total").html(totalScore);
  
}



function clearStoredScores() {
  window.localStorage.clear();
}


// SCORE UPDATING

function setHoleScore(hole, score) {

  scores[hole] = score;
  window.localStorage.setItem('h'+hole, score);
  $(".h"+hole).html(score);// Find hole score element even more simply?
  console.log("set hole " + hole + " score to " + score);  
  
}

function updateTotalScore() {
  $(".total").html(totalScore);
}


function addStroke(hole) {

  var strokes = scores[hole];
  
  // TODO: Remove this when we start using a "subtractStroke" function
  // Conditionals to loop score from 6 to 1
  if (strokes == 6) {
    strokes = 1;
    totalScore -= 5;
  }
  
  else {
    strokes++;
    totalScore++;
  }
  
  setHoleScore(hole,strokes);
  updateTotalScore();
  
  
   
}

// TODO: Add a removeStroke() function...


// On click/tap of any row...

$( ".hole-row" ).click(function() {
  
  var editingHole = $(this).attr("id");

  //updateCoursePosition(editingHole);  
  addStroke(editingHole);
  
  
});


// ESTIMATING COURSE POSITION

function updateCoursePosition(hole) {
  
    // estCoursePos is updated, but only ever increases
  if ( editingHole >= estCoursePos ) {
    estCoursePos = parseInt(editingHole) + 1;
    console.log("New estCoursePose="+estCoursePos);
  }

  // Updating estimated course position
  if(editingHole >= (estCoursePos+posWindowWidth)) {
  }
    
}
    
    

// ---------
// MAIN LOOP


$( document ).ready(function() {
  console.log("Main Loop running...");

  // Get the time to pass to isNewGame
  var now = new Date();
  nowSecs = now.getTime()/1000;
  console.log("Current time is: " + nowSecs +" (in epoch-seconds)");

  if( !isNewGame(nowSecs) ) {
    reloadScores();  
    
    
  }
  else {
    clearStoredScores();
    window.localStorage.setItem('prevGameStart',nowSecs);
  }


});





// DEBUG ONLY: Clear Local Storage on Header Click


$(".header").click(function() {
  window.localStorage.clear();
  console.log("localStorage cleared");
  
});