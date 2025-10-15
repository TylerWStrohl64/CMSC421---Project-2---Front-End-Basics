/*
JavaScript File for Picture Poker
Corresponds to "picturePoker.html" & "styles.css"
*/

/*************************************************************************** */
//Global Variables:


//WIN AT >= 20
var playerCoins = 0;
var compCoins = 0;

//rank corresponds to type.
//to judge how good cards are, the ranks will be used.
let cardRank = [0, 1, 2, 3, 4, 5];
let cardType = ["Cloud", "Mushroom", "Flower", "Luigi", "Mario", "Star"];

//similar idea for combos as is cards above.
let comboRank = [0, 1, 2, 3, 4, 5, 6];
let comboType = ["Junk", "One Pair", "Two Pair", "Three Of A Kind", "Full House", "Four Of A Kind", "Five Of A Kind"];
let coinsAwarded = [0, 2, 3, 4, 6, 8, 16];

//we always have 5 cards.
let playerHand = [];
let compHand = [];

var holdDiv = document.getElementById("hold");

var luigiCards_div = document.querySelector(".luigiCards");

var lCard_divs = [
    document.getElementById("lCard1"),
    document.getElementById("lCard2"),
    document.getElementById("lCard3"),
    document.getElementById("lCard4"),
    document.getElementById("lCard5")
  ];

var myCards_div = document.querySelector(".myCards");

var mCard_divs = [
    document.getElementById("mCard1"),
    document.getElementById("mCard2"),
    document.getElementById("mCard3"),
    document.getElementById("mCard4"),
    document.getElementById("mCard5")
  ];

let lCardRaised = [false, false, false, false, false];
let mCardRaised = [false, false, false, false, false];

/*************************************************************************** */
//Classes:


class Card {

    //Default placeholder.
    constructor() {

        this.rank = 0;
        this.type = "Cloud";
    }

    getRank() {

        return this.rank;
    }

    setRank(newRank) {

        this.rank = newRank;
    }

    getType() {

        return this.type;
    }

    setType(newType) {

        this.type = newType;
    }

    //Call when distributing new cards.
    assign() {

        //randomly get a new card, and then assign it.
        var randIndex = Math.floor(Math.random()*6);
         //use the same index for both so they line up.
        var curCardRank = cardRank[randIndex];
        var curCardType = cardType[randIndex];

        this.setRank(curCardRank);
        this.setType(curCardType);
    }
}

//************************************************************************** */
//Functions:


//Create a pop-up window to explain the rules.
function openPopup() {
    window.open(
      "/picturePokerHTP.html", // URL to open
      "popupWindow",         // Window name
      "width=600,height=400,left=200,top=200" // Features
    );
  }

  function getRankCounts(hand) {
    
    const counts = {};
  
    for (const card of hand) {
      
      const rank = card.getRank();
      counts[rank] = (counts[rank] || 0) + 1;
    }
  
    console.log(counts);
    return counts;
  }

  //How the Comp/Luigi determines what Combos are in hand.
  function getComboType(hand) {
    
    const counts = Object.values(getRankCounts(hand)).sort((a, b) => b - a);
    let comboIndex = 0;
  
    
    if (counts[0] === 5) {
    
        comboIndex = 6;
    }
    else if (counts[0] === 4) {
        
        comboIndex = 5;
    }
    else if (counts[0] === 3 && counts[1] === 2) {
     
        comboIndex = 4;
     }
    else if (counts[0] === 3) {
        
        comboIndex = 3;
    }
    else if (counts[0] === 2 && counts[1] === 2) {

        comboIndex = 2;
    }
    else if (counts[0] === 2) {
        
        comboIndex = 1;
    }
  

    return {
      comboIndex: comboIndex,
      comboName: comboType[comboIndex],
      coins: coinsAwarded[comboIndex]
    };
  }

//Comp will hold any card that contributes to a combo (pair or better)
function getCompChoice() {
    
    const rankCounts = getRankCounts(compHand);
  
    //Reset
    lCardRaised = [false, false, false, false, false];
  
    //Find ranks worth holding (2 or more of the same)
    const ranksToHold = Object.keys(rankCounts).filter(rank => rankCounts[rank] >= 2).map(Number);
  
    //Loop through compHand and raise cards that match those ranks
    for (let index = 0; index < compHand.length; index++) {
      
      if (ranksToHold.includes(compHand[index].getRank())) {
        
        lCardRaised[index] = true;
      }
    }
  
    console.log("Comp is holding cards at positions:", lCardRaised);
  }

//cardRank also corresponds to imageArray index:
function swapImage(curCard_div, cardRank) {

    const imageArray = [
        "images/picturePoker/cloud.PNG",
        "images/picturePoker/mushroom.PNG",
        "images/picturePoker/flower.PNG",
        "images/picturePoker/luigi.PNG",
        "images/picturePoker/mario.PNG",
        "images/picturePoker/star.PNG",
        "images/picturePoker/card.PNG"
      ];

      
    //Animate fade-out
    console.log(curCard_div);
    curCard_div.classList.add("swap-out");

    setTimeout(() => {
        
        //Swap image after fade-out
        curCard_div.innerHTML = `<img src="${imageArray[cardRank]}" alt="i am a card">`;

        //Animate fade-in
        curCard_div.classList.remove("swap-out");
        curCard_div.classList.add("swap-in");

        //Clean up after animation
        setTimeout(() => {
        curCard_div.classList.remove("swap-in");
        }, 400);
    }, 400);
}

//How many cards get distributed depends on howMany have been discarded (or if a new hand is being given)
//This will get called for either the player (you) or the comp (luigi).
function distributeCards(howMany, toWho) {

    //[if need be] replace cards.
    if (howMany < 5) {

        if (toWho === "Player") {

            for (var mcrIndex = 0; mcrIndex < 5; mcrIndex++) {

                //if card is raised, remove and replace. otherwise the card should stay the same.
                if (mCardRaised[mcrIndex] === true) {

                    var repCard = new Card();
                    repCard.assign();
                    
                    //this replaces the card.
                    playerHand[mcrIndex] = repCard;

                    //replace the image.
                    let mCard_div = mCard_divs[mcrIndex];
                    swapImage(mCard_div, repCard.getRank());

                    mCardRaised[mcrIndex] = false;
                    console.log(mCardRaised[mcrIndex]);
                }
            }
        }
        else if (toWho === "Comp") {

            for (var lcrIndex = 0; lcrIndex < 5; lcrIndex++) {

                if (lCardRaised[lcrIndex] === true) {

                    var repCard = new Card();
                    repCard.assign();
                    
                    //this replaces the card.
                    compHand[lcrIndex] = repCard;
                }
            }
        }
    }
    else {
        
    //this loop runs if there are already 5 cards in the hand.
    //do not use howMany or the loop will not work properly.
    for (var index = 0; index < 5; index++) {

        var curCard = new Card();
        curCard.assign();

        if (toWho === "Player") {

            playerHand.push(curCard);
            let mCard_div = mCard_divs[index];
            swapImage(mCard_div, curCard.getRank());
        }
        else if (toWho === "Comp") {

            compHand.push(curCard);
            let lCard_div = lCard_divs[index];
            //this will use the generic card image.
            swapImage(lCard_div, 6);
        }
    }
    }
}

//Call when the hold or draw button has been clicked.
function compTurn() {
    
    console.log("compTurn function called.");
  
    //decide what to hold
    getCompChoice();
  
    const howMany = lCardRaised.filter(held => held).length;
    distributeCards(howMany, "Comp");
  
    setTimeout(() => {
      roundResult();
    }, 1000);
  }

//Call at the end of compTurn()
function roundResult() {
    
    const playerCombo = getComboType(playerHand);
    const compCombo = getComboType(compHand);
  
    // Reveal Luigi's cards
    for (let index = 0; index < compHand.length; index++) {
        
        const lCard_div = lCard_divs[index];
        const cardRank = compHand[index].getRank();
        swapImage(lCard_div, cardRank);
    }   

    holdDiv.innerHTML = 
    `
    <h2>${compCombo.comboName}</h2>
    <h2>${playerCombo.comboName}</h2>
    `;

    setTimeout(() => {
        
         //player win
        if (playerCombo.comboIndex > compCombo.comboIndex) {
        
            playerCoins += playerCombo.coins;
            document.getElementById("playerCoins").textContent = playerCoins;

            holdDiv.innerHTML = 
            `
            <h2></h2>
            <h2>You Win This Round!</h2>
            `;
        } 
        //luigi / comp win
        else if (compCombo.comboIndex > playerCombo.comboIndex) {
        
            compCoins += compCombo.coins;
            document.getElementById("luigiCoins").textContent = compCoins;

            holdDiv.innerHTML = 
            `
            <h2></h2>
            <h2>You Lose This Round.</h2>
            `;
        } 
        //same combo or draw:
        else {

            const playerRanks = playerHand.map(card => card.getRank()).sort((a, b) => b - a);
            const compRanks = compHand.map(card => card.getRank()).sort((a, b) => b - a);
      
            if (playerRanks[0] > compRanks[0]) {
              
                playerCoins += playerCombo.coins;
                document.getElementById("playerCoins").textContent = playerCoins;
              
                holdDiv.innerHTML = 
                `
                <h2></h2>
                <h2>You Win This Round!</h2>
                `;
            } 
            else if (compRanks[0] > playerRanks[0]) {
              
                compCoins += compCombo.coins;
                document.getElementById("luigiCoins").textContent = compCoins;
                
                holdDiv.innerHTML = 
                `
                <h2></h2>
                <h2>You Lose This Round.</h2>
                `;
            } 
            else {
              
                holdDiv.innerHTML = 
                `
                <h2></h2>
                <h2>Draw.</h2>
                `;
            }
          }

      }, 4000);

    setTimeout(() => {
        newRound();
      }, 6000);
  }

//Called after a round is complete or at the start of the game.
function newRound() {

    if (playerCoins >= 20) {
    
        holdDiv.innerHTML = 
        `
        <h2>You Win :) Refresh the Page to Play Again!</h2>
        `;
    }
    else if (compCoins >= 20) {

        holdDiv.innerHTML = 
        `
        <h2>You Lose :( Refresh the Page to Play Again!</h2>
        `;
    }
    else {

        console.log("newRound function called.");

         //clear combo text
        holdDiv.innerHTML = "";

        playerHand = [];
        compHand = [];

        distributeCards(5, "Player");
        distributeCards(5, "Comp");

        holdDiv.style.backgroundImage = "url('images/picturePoker/HOLD.PNG')";
         //re-enable clicks
        holdDiv.style.pointerEvents = "auto";
    }
}

/************************************************************************** */
//EventListeners [using the div variables initialized]:

holdDiv.addEventListener("click", () => {
  
    const isDrawMode = mCardRaised.includes(true);
    //if we click the draw button, distributeCards() needs to be called
    if (isDrawMode) {
        
        const howMany = mCardRaised.filter(held => held).length;
        distributeCards(howMany, "Player");

        //Reset selection visuals
        mCardRaised = [false, false, false, false, false];
        mCard_divs.forEach(card => {
            
            card.style.transform = "translateY(0px)";
            card.style.transition = "transform 0.2s ease";
        });

        holdDiv.style.backgroundImage = "url('images/picturePoker/HOLD.PNG')";
    }
    //disable further clicks
    holdDiv.style.pointerEvents = "none";

    //Trigger comp turn
    setTimeout(() => {
        compTurn();
      }, 2000);
  });

mCard_divs.forEach((cardDiv, index) => {

    cardDiv.addEventListener("click", () => {

    //Raise card slightly
    if (!mCardRaised[index]) {

        cardDiv.style.transform = "translateY(-10px)";
        cardDiv.style.transition = "transform 0.2s ease";
        mCardRaised[index] = true;
    }
    //Return to original pos
    else {
        
        cardDiv.style.transform = "translateY(0px)";
        cardDiv.style.transition = "transform 0.2s ease";
        mCardRaised[index] = false;
    }

    //update the hold/draw button accordingly.
    const anyRaised = mCardRaised.includes(true);
    holdDiv.style.backgroundImage = anyRaised
      ? "url('images/picturePoker/DRAW.PNG')"
      : "url('images/picturePoker/HOLD.PNG')";

    });
  });

//In place so that the HTML & JavaScript are not out of sync on page load.
//Prevents issues with null or undefined values.
document.addEventListener("DOMContentLoaded", () => {
    
    mCard_divs = [
        document.getElementById("mCard1"),
        document.getElementById("mCard2"),
        document.getElementById("mCard3"),
        document.getElementById("mCard4"),
        document.getElementById("mCard5")
      ];

    newRound();
  });