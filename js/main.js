// (C) 2018 High Quality Ideas LLC
// v2.1.1

// CONFIG VALUES
var localStorageTimeout = 6;    // the number of hours (from game start) after which the localStorage will clear itself

var editWindowTrail = 2;  // How many holes "behind" the player stay unlocked?
var editWindowLead = 2;  // How many holes "in front of" the player are unlocked?
  //^^ These variables define the number of "unlocked" holes that we have at any given time. The total number of unlocked holes will be (Trail+Lead+1).

// GLOBAL VARIABLES
var estCoursePos = 1;
var trailingEdge = 1- editWindowTrail;
var leadingEdge = 1+ editWindowLead;

var FALSE = 0;
var TRUE = 1;


var lockStatus = [FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE];
  //^^ Trying out an array to track which holes are locked and unlocked? This feels kludge-y, though...
  
/* TODO: Use a single "status" array for holes with an enum of states? e.g.
  0 = "Unreached" - hole that the editing window's leading edge hasn't reached yet
  1 = "Unlocked"  - hole in the current editing window
  2 = "Complete"  - hole with a score that is behind the trailing edge; locked
  3 = "Skipped"   - hole with a zero score that is before a hole with an entered score
  
  
  // N.B. Keep in mind what info we are and are not putting into localStorage... more data in javascript is more info that we need to be writing to the device...
  
  
  
  Give a bit more though to how conditional and integer operations on these values may be more elegant based on their order...
*/

// USE AN "unlocked holes" array that contains the numbers of all unlocked holes?



var holeStatus = [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  //^^ This is defined manually; make sure that the number of unlocked holes at the start is equal to (editWindowLead + 1)   
  
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
      updateCoursePosition(i);
    }
  }
  
  $(".total").html(totalScore);
  
  // TODO: Run a "lockPrevHoles" routine
  
}



function clearStoredScores() {
  window.localStorage.clear();
}


// SCORE UPDATING

function setHoleScore(hole, score) {

  scores[hole] = score;
  window.localStorage.setItem('h'+hole, score);
  $(".h"+hole).html(score);// Find hole score element even more simply?
  //console.log("set hole " + hole + " score to " + score);  
  
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

$(".hole.row").click(function() {
  
  // WHY is this still applying even after the "unlocked" class is removed from the DOM element?
  // I don't like this workaround, but I don't seem to have much choice...
  // ALTHOUGH: This gives us the ability to detect presses on locked rows and potentially act on them; is it better to do that all in one .click function, or have a separate jQuery selector for actions on locked elements?
  
  
  if ( $(this).hasClass("unlocked") ) {
    console.log("WTF?");
    
    // Get the number of the edited hole...
    var editingHole = $(this).attr("id");
    
    addStroke(editingHole);
    updateCoursePosition(editingHole);    
  }
  
  else {
    // TODO: Do we want to do anything if the user clicks a locked hole?
    // (How would we indicate to them that they should "Hold to unlock"? A full-screen overlay?)
  }
});


// ESTIMATING COURSE POSITION

function updateCoursePosition(hole) {
  
  // Estimate Position is updated if the hole under editing is at or past where we think we are...
  if ( hole >= estCoursePos ) {
    estCoursePos = parseInt(hole) + 1;    // Not sure why this line/function is interpreting hole as a text variable; seems to be working fine everywhere else...
    console.log("New estCoursePos="+estCoursePos);
    
    // Update position window edges
    trailingEdge = estCoursePos - editWindowTrail;
    leadingEdge = estCoursePos + editWindowLead;
    
    // TRAILING EDGE updates
      // TODO: Find a more elegant way to do this; this is pretty brute-force...
    for ( var i = 1; i < trailingEdge; i++) {
      
      if (scores[i] > 0) {
        $(".h"+i+"-row").removeClass("unlocked");
        console.log("Locking hole "+ i);        
      }
      else { // Hole has been skipped...
        // TODO: Highlighting skipped rows 
        $(".h"+i+"-row").addClass("skipped");       
      }
      

      
    }
    
    
    
    // UNLOCK LEADING EDGE
    // TODO: For now, we're just starting with everything unlocked, so there's no action to take here...
    
    
    
    
    
    
    
    
    
    
    
    
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