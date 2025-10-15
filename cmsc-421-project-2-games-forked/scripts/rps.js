/*
JavaScript File for [RPS] "Rock Paper Scissor Lizzar Spoc"
Corresponds to "rps.html" & "styles.css"
*/

/*************************************************************************** */
//Global Variables:
var playerScore = 0;
var compScore = 0;

var playerScore_span = document.getElementById("player-score");
var compScore_span = document.getElementById("comp-score");

//These correspond to css
var scoreBoard_div = document.querySelector(".scoreboard");
var result_div = document.querySelector(".result");
var result_p   = document.querySelector(".result p");

//div for each choice [used for eventListeners]
var rock_div = document.getElementById("rock");
var paper_div = document.getElementById("paper");
var scissors_div = document.getElementById("scissors");
var lizard_div = document.getElementById("lizard");
var spock_div = document.getElementById("spock");
/*************************************************************************** */
//Functions:

//create a pop-up window to explain the rules.
function openPopup() {
    window.open(
      "/rpsHTP.html", // URL to open
      "popupWindow",         // Window name
      "width=600,height=400,left=200,top=200" // Features
    );
  }

function getCompChoice() {
    
    //var array is function-scoped.
    var choices = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];
    var index = Math.floor(Math.random()*5);
    return choices[index];
}

function gameOutcome(playerChoice) {

    var compChoice = getCompChoice();

    //Result = Draw
    if (playerChoice === compChoice) {

        result_p.innerHTML = "Its a Draw! No Points!";
    }
    //Result != Draw
    else {

        switch (playerChoice + " " + compChoice) {

            //Cases where Player Wins
            case "Rock Scissors":
            case "Rock Lizard":
            case "Paper Rock":
            case "Paper Spock":
            case "Scissors Paper":
            case "Scissors Lizard":
            case "Lizard Paper":
            case "Lizard Spock":
            case "Spock Rock":
            case "Spock Scissors":
                result_p.innerHTML = (playerChoice + " beats " + compChoice + "!! You get a point!");
                playerScore++;
                playerScore_span.innerHTML = playerScore;
                break;

            //Cases where Comp Wins (just the player ones from above but flipped)
            case "Scissors Rock":
            case "Lizard Rock":
            case "Rock Paper":
            case "Spock Paper":
            case "Paper Scissors":
            case "Lizard Scissors":
            case "Paper Lizard":
            case "Spock Lizard":
            case "Rock Spock":
            case "Scissors Spock":
                result_p.innerHTML = (compChoice + " beats " + playerChoice + "!! Comp gets a point!");
                compScore++;
                compScore_span.innerHTML = compScore;
                break;
            }
        }

    if ((playerScore === 10) || (compScore === 10)) {

        gameEnd();
    }
}

function gameEnd() {

    //result_p.innerHTML = "The game is over. Now finish the function.";
    if (playerScore === 10) {

        result_p.innerHTML = "You reached 10 points first. You Win! :)" + "\n" + "Refresh the Page to Play Again!";
    }
    else {

        result_p.innerHTML = "Comp reached 10 points first. You Lose! :(" + "\n" + "Refresh the Page to Play Again!";
    }
}

/************************************************************************** */
//EventListeners [using the div variables initialized]:
rock_div.addEventListener('click', function() {gameOutcome("Rock");});
paper_div.addEventListener('click', function() {gameOutcome("Paper");});
scissors_div.addEventListener('click', function() {gameOutcome("Scissors");});  
lizard_div.addEventListener('click', function() {gameOutcome("Lizard");});  
spock_div.addEventListener('click', function() {gameOutcome("Spock");}); 