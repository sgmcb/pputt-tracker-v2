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
  
var scores = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // Length is 19 so that we can 1-index this
var totalScore = 0;

var lastClicked = 0;    // A variable to track the last hole that the user clicked




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
  
  // Get the number of the edited hole...
  var clickedHole = $(this).attr("id");
  
  // If the hole is unlocked, update the scorecard
  if ( $(this).hasClass("unlocked") ) {
    addStroke(clickedHole);
    updateCoursePosition(clickedHole);
  }
  
  // If the user taps the same hole twice, unlock it.
  // TODO: Update this for hammer.js press-and-hold function
  else if (clickedHole == lastClicked) {
    console.log("Unlocking Hole " + clickedHole);
    $(this).addClass("unlocked");
  }
  
  else {  // Conditional that will handle all clicks of locked holes?
    console.log("Double tap a hole to unlock it.");
    // TODO: Do we want to do anything if the user clicks a locked hole?
    // (How would we indicate to them that they should "Hold to unlock"? A full-screen overlay?)
  }
  
  lastClicked = clickedHole;
  
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
        $(".h"+i+"-row").removeClass("skipped");
        console.log("Locking hole "+ i);        
      }
      else { // Hole has been skipped...
        // TODO: Highlighting skipped rows 
        $(".h"+i+"-row").addClass("skipped");       
      }
      

      
    }
    
    
    
    // UNLOCK LEADING EDGE
    // TODO: For now, we're just starting with everything unlocked, so there's no action to take here...
    
    
    
    //test
    
    
    
    
    
    
    
    
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