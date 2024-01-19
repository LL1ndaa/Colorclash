import ColourClash from "./ColourClash.js";
import R from "./ramda.js";

//link it with HTML
const boardcontainer = document.getElementById("board");
const player1Stats = document.getElementById("player1");
const player2Stats = document.getElementById("player2");
const game_row = 3;
const game_col = 2;
const board_col = 3;

let hand = 0;
let hcolor = "";

//import it from api
let board = ColourClash.empty_board();
let player1 = ColourClash.player1();
let player2 = ColourClash.player2();
let currentPlayer = ColourClash.currentPlayer();

//True means can click, false means cannot click.
//To prevent from assign on token to several grid in board
let boardClickable = true;

//The page to start the game
document.addEventListener("DOMContentLoaded", function () {
    let overlay = document.getElementById("overlay");
    overlay.addEventListener("click", function () {
        overlay.style.display = "none";

    });
});






//generated a board- player1 in HTML
R.range(0, game_row).forEach(function (row_index) {
    const tr = document.createElement("tr");

    R.range(0, game_col).forEach(function (column_index) {
        const td = document.createElement("td");
        const id = `player1-${row_index}-${column_index}`;//name it
    // td.textContent = player1[row_index][column_index];
        td.id = id;

    //If player select and click the grid
        td.addEventListener("click", function () {

    // Turn this true, so that you can then click main board
            boardClickable = true;

    //If just start, player1 first click token, player 1 GO first.
            if (currentPlayer === "0") {
                currentPlayer = "1";
            }

      /*In mainboard there will have turnover.
        So if player1 click the token and it is his turn.*/
            if (currentPlayer === "1") {

        //store the value in hand, then make the token 0
                hand = player1[row_index][column_index];
                player1[row_index][column_index] = 0;

        //store the color
                hcolor = window.getComputedStyle(td).backgroundColor;
        //assign this grid to be grey means token left
                td.style.backgroundColor = "rgb(240, 240, 240)";

        // If it's not in his turn, alert player
            } else if (currentPlayer === "2") {
                alert("It's not your turn, BlazeBattler!");
            }
        });
        tr.append(td);
    });
    player1Stats.append(tr);
});


//generated a board- player2 in HTML, very similar to player1 board
R.range(0, game_row).forEach(function (row_index) {
    const tr = document.createElement("tr");

    R.range(0, game_col).forEach(function (column_index) {
        const td = document.createElement("td");
        const id = `player2-${row_index}-${column_index}`;
        td.id = id;
        td.addEventListener("click", function () {
            boardClickable = true;
            if (currentPlayer === "0") {
                currentPlayer = "2";
            }
            if (currentPlayer === "2") {
                hand = player2[row_index][column_index];
                player2[row_index][column_index] = 0;
                hcolor = window.getComputedStyle(td).backgroundColor;
                td.style.backgroundColor = "rgb(240, 240, 240)";
            } else if (currentPlayer === "1") {  // Switch to the other player
                alert("It's not your turn, CobaltKnight!");
            }
        });

        tr.append(td);

    });
    player2Stats.append(tr);
});


//generat main board--similary to player1 and layer2
function renderBoard() {
    R.range(0, game_row).forEach(function (row_index) {
        const tr = document.createElement("tr");
        R.range(0, board_col).forEach(function (column_index) {
            const td = document.createElement("td");
            const id = `board-${row_index}-${column_index}`;
            td.id = id;

            td.addEventListener("click", function () {
                if (boardClickable && hand !== 0) {
                  //if cannot make move, alert player
                    if (ColourClash.makeMove(board[row_index][
                      column_index],hand) === false) {
                        alert("Fail to cover, you lose one token.");
                    } else if
                    (ColourClash.makeMove(board[row_index][column_index], hand)
                    === true) {
                        //assign the color of the token to the grid
                        td.style.backgroundColor = hcolor;
                        hcolor = " ";

                        //assign the value of the token to the grid
                        board[row_index][column_index] = hand;
                        hand = 0;

                        td.style.border = "none";
                        // Judge who win
                        const result = ColourClash.winner(board, player1,
                           player2);
                        //and create a HTML page when game over
                        const GO = document.getElementById("game-over");
                        const GOM = document.getElementById("game-over-message");

                        if (result === "P1") {
                        // Display "Player 1 win!" on the screen
                            GOM.textContent = "BlazeBattler wins!!!";
                            GO.style.backgroundColor = "rgba(235, 28, 28, 0.7)";
                            GO.style.display = "block";

                        } else if (result === "P2") {
                            // Display "Player 2 win!" on the screen
                            GOM.textContent = "CobaltKnight wins!!!";
                            GO.style.backgroundColor = "rgba(5, 55, 235, 0.7)";
                            GO.style.display = "block";

                        } else if (result === "D") {
                            // Display "It's a draw!" on the screen
                            GOM.textContent = "It's a Draw!";
                            GO.style.backgroundColor = "rgba(62, 8, 134,0.7)";
                            GO.style.display = "block";
                        }
                    }
            // Update currentPlayer directly
                    currentPlayer = (
                        currentPlayer === "1"
                        ? "2"
                        : "1"
                    );
            //Prevent assign same token twice, need to click player
            //board then can click main again
                    boardClickable = false;

                } else {
            //if click a wrong place
                    alert(`Please select a chess in BlazeBattler or CobaltKnight first.`);
                }
            });
            tr.append(td);
        });
        boardcontainer.append(tr);
    });
}
renderBoard();







// Function to render the game board
// function renderBoard() {

//   [0,1,2].forEach(function(row_index){//R.range(0, player_row)
//     const tr= document.createElement("tr");

//     [0,1,2].forEach(function(column_index){
//       const td= document.createElement("td");
//       const id = `board-${row_index}-${column_index}`;
//       // td.textContent = board[row_index][column_index];
//       td.id = id; // Assign the unique ID to the <td> element
//       td.addEventListener('click', function() {
//         if (currentPlayer === "player1") {
//           if (ColourClash.makeMove(board[row_index][column_index], hand)
//=== true) {
//             td.style.backgroundColor = hcolor;
//             board[row_index][column_index] = hand;
//             console.log(board[row_index][column_index]);
//             td.style.border = "none";
//             ColourClash.winner(board, currentPlayer);
//             ColourClash.currentPlayer = (ColourClash.currentPlayer ===
//"player1") ? "player2" : "player1";
//           }
//         } else {
//           console.log("It's not your turn, Player 1!");
//         }
//       });


//       )});


//       tr.append(td);

//       };
//     boardcontainer.append(tr)};

// renderBoard();

//   for (let row_index = 0; row_index < 3; row_index++) {
//     for (let column_index = 0; column_index < 3; column_index++) {
//       const cell = document.createElement('div');
//       cell.className = 'cell';
//       cell.textContent = board[row_index][column_index];
//       // cell.addEventListener('click', () => handleCellClick(row_index,
// column_index));
//       cell.onclick= function(){
//         board[row_index][column_index]=hand;
//         console.log(board[row_index][column_index])
//         cell.textContent = board[row_index][column_index]
//       };

//       boardcontainer.appendChild(cell);
//     }
//   }
// }


// function handleCellClick(row_index, column_index) {
//   const clickedCellPlayer1 = player1Stats.querySelector(
//`#player1-${row_index}-${row_index}`);

//   board[row_index][column_index]=clickedCellPlayer1;
//   return console.log(board[row_index][column_index])

//   // renderBoard();
// }
// let currentplayer= ColourClash.currentplayer;
// let row=ColourClash.row;
// let col=ColourClash.col;
// let makeMove=ColourClash.makeMove();
// let makeMove=ColourClash.makeMove();
// player1=ColourClash. currentplayer;
// var player1=ColourClash.player1;
// var player2= ColourClash.player2;

// let board = ColourClash.emptyboard();
// console.log(board);

// const player1 = ColourClash.player1;
// const player2 = ColourClash.player2;
// const player1= document.getElementById("player1");
//     for (let row = 0; row < row_index; row++) {//R.range(0, player_row)
//       const tr= document.createElement("tr");

//       for (let col = 0; col < column_index; col++) {
//         const td= document.createElement("td");
//         const id = `player1-${row_index}-${column_index}`;
// Unique ID for each grid
//           // td.textContent = ColourClash.player1[row_index][column_index];
//         td.id = id; // Assign the unique ID to the <td> element

//         td.onclick= function(){
//           console.log(`${row_index},${column_index}`)//not really sure
//         // td.addEventListener('click', () =>
//handlePlayer1CellClick(row, col));

//         };
//         tr.append(td);};


//         player1.append(tr);
//       };
// const row_index=3;
// const column_index=2;
// for (let row = 0; row < row_index; row++) {
//   for (let col = 0; col < column_index; col++) {
//     const cell = document.getElementById(`player1-${row}-${col}`);
//     cell.addEventListener('click', () => handleCellClick(row, col));
//   }
// }
 // renderboard[row_index][column_index]=hand;
  // ColourClash.makeMove(ColourClash.currentplayer,
  //ColourClash.empty_board, row, col);

  // Get the clicked cell in player1
  // const clickedCellPlayer1 = player1Stats.querySelector
  //(`#player1-${row}-${col}`);

  // // Assign the value from player1 to the board
  // board[row][col] = player1[row][col];

  // // Update the text content of the clicked cell in player1 and the board
  // clickedCellPlayer1.textContent = player1[row][col];

  // Make the move using the ColourClash function
  // ColourClash.makeMove(ColourClash.currentplayer, board, row, col);

  // Render the updated board
  // function resetPlayer1GridsColor(row, column) {
//   const player1Grids = document.querySelectorAll("#player1 td");
//   player1Grids.forEach(function(grid) {
//     if (grid.id == `player1-${row}-${column}`) {
//       grid.style.backgroundColor = "transparent";
//     }
//   });
// }

    // td.addEventListener('click', function() {
    //   console.log(player2[row_index][column_index]);
    //   hand = player2[row_index][column_index];
    //   hcolor = getComputedStyle(td).backgroundColor;
    //   td.style.backgroundColor = "rgb(240, 240, 240)";
    // });
