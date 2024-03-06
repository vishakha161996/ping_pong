// Retrieve DOM elements
var ball = document.getElementById('ball');
var rod1 = document.getElementById('rod1');
var rod2 = document.getElementById('rod2');
const start = document.querySelector('.start');
const press = document.querySelector('.press');
const rules = document.querySelector('.rules');

// Check if it's the first time playing the game
if (localStorage.getItem("isFirstTime") !== "false") {
    localStorage.setItem("isFirstTime", "true");
  }

// Local storage keys
const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Player1";
const rod2Name = "Player2";

// Initialize variables
let score,
    maxScore,
    movement,
    rod,
    ballSpeedX = 2,
    ballSpeedY = 2;

let gameOn = false;

let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;

// Initialize game
(function () {
    // Retrieve max score and player name from local storage
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    // Show alert message based on whether it's the first time playing the game
    if (localStorage.getItem("isFirstTime") === "true") {
        localStorage.setItem("isFirstTime", "false");
        alert("This is the first time you are playing this game. LET'S START");
    } else {
        alert(rod + " has maximum score of " + (maxScore));
    }
   
    // Reset the game board
    resetBoard(rod);
})();

// Function to reset the game board
function resetBoard(rodName) {
    // Reset positions of rods and ball
    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';

    // Set initial position of the ball based on the current player
    if (rodName === rod2Name) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (rodName === rod1Name) {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -2;
    }
    
    // Display start button
    start.style.display = "block"
    score = 0;
    gameOn = false;

}

// Function to update scores on-screen
function updateScores() {
    document.getElementById('scorePlayer1').textContent = "Player 1 Score: " + scorePlayer1;
    document.getElementById('scorePlayer2').textContent = "Player 2 Score: " + scorePlayer2;
}

// Initialize player scores
let scorePlayer1 = 0;
let scorePlayer2 = 0;

// Function to handle win conditions
function storeWin(rod, score) {
    // Update scores only if the game is still ongoing
    if (gameOn) {
        if (rod === rod1Name) {
            scorePlayer1 = score;
        } else if (rod === rod2Name) {
            scorePlayer2 = score;
        }
        // Update scores on-screen
        updateScores();
    }

    // Store new max score and player name in local storage if the current score is higher
    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, maxScore);
    }
    // Clear movement interval and reset the board
    clearInterval(movement);
    resetBoard(rod);
    // Show alert message with winner and max score
    alert(rod + " wins with a score of " + score + ". Max score is: " + maxScore);

    // Reset scores to 0
    scorePlayer1 = 0;
    scorePlayer2 = 0;

    // Update scores on-screen
    updateScores();

    // Set gameOn flag to false indicating the game has ended
    gameOn = false;
}



// Event listener for key presses
window.addEventListener('keypress', function (event) {
    let rodSpeed = 20;
    console.log(event.code)

    // Move rods based on key presses
    let rodRect = rod1.getBoundingClientRect();
    if (event.code === "KeyD" && ((rodRect.x + rodRect.width) < window.innerWidth)) {
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    } else if (event.code === "KeyA" && (rodRect.x > 0)) {
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }

    // Start the game when Enter key is pressed
    if (event.code === "Enter") {
        if (!gameOn) {
            gameOn = true;
            press.style.display = 'none';
            rules.style.display = 'none';
            // Get initial ball position and dimensions
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            // Start the movement interval
            movement = setInterval(function () {
                // Move ball 
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                // Get rod positions
                let rod1X = rod1.getBoundingClientRect().x;
                let rod2X = rod2.getBoundingClientRect().x;

                // Update ball position
                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';

                // Check for ball collision with walls
                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; // Reverses the direction
                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Check for collision with Rod 1
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction

                    // Increment score for player 1
                    scorePlayer1++;

                    // Update scores on-screen
                    updateScores();

                    // Check if the game ends
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        storeWin(rod2Name, scorePlayer1);
                    }
                }

                // Check for collision with Rod 2
                else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY; // Reverses the direction

                    // Increment score for player 2
                    scorePlayer2++;

                    // Update scores on-screen
                    updateScores();

                    // Check if the game ends
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        storeWin(rod1Name, scorePlayer2);
                    }
                }
            }, 10);// Interval for ball movement
        }
    }
});