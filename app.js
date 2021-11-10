/* -------------------- letiable assignment and initialization -------------------- */

let turnFlag = true;
let endFlag = false;
let modalDisplay = false;

const tableData = document.getElementById("table");
const rows = document.getElementsByClassName("row");
const cells = document.getElementsByClassName("col");
const modal = document.getElementById("alert-modal");
const span = document.getElementsByClassName("close")[0];
const modalContent = document.getElementById("modal-text");

span.onclick = () => {
  modal.style.display = "none";
  modalDisplay = false;
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    modalDisplay = false;
  }
};

let exCount = 0;
let ohCount = 0;

let currentBoardState = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
let currentXCount = 0;
let currentOCount = 0;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/* -------------------- BOT and its utility functions -------------------- */

// utility func to output randomized version of input array
const randomize = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[random]] = [arr[random], arr[i]];
  }
  return arr;
};

// checks boards state, filters invalid spots, returns array of valid move selections
const openCells = () => {
  let remains = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
  const checking = stateTracker();
  for (let key in checking) {
    remains = remains.filter((item) => item !== checking[key].idx);
  }
  remains = randomize(remains);
  return remains;
};

// produces the bots next move - the value that blocks users winning move, or a random move if no blocker exists
const botPicksSpot = () => {
  // assign let to first index of randomized board state
  let freeSpots = openCells()[0];
  // instantiate empty container
  let results = [];
  // instantiate shallow copy of possible winning combinations
  let combos = winningCombos.slice();
  // iterate through combos matrix
  for (let k = 0; k < combos.length; k++) {
    // iterate through current level of matrix
    for (let y = 0; y < combos[k].length; y++) {
      // check if current iteration's value is string X
      if (currentBoardState[combos[k][y]] === "X") {
        // push to container
        results.push(combos[k][y]);
      }
    }
  }

  // create unique array from container's values
  results = Array.from(new Set(results));

  // iterate through winning combination - keep track of index and it's value
  for (let [index, combo] of combos.entries()) {
    // initialize array from filtering open spots from combos
    const spotFilter = combo.filter(
      (moves) => !results.includes(Number(moves))
    );
    // check if total 'X's on board's current state is greater than / equal to two
    if (currentXCount >= 2) {
      // check if last remaining value
      if (spotFilter.length === 1) {
        // if 'X' or 'O' does not exist before move
        if (spotFilter[0] !== "X" && spotFilter[0] !== "O") {
          // if cell in question does not contain 'X' or 'O' class
          if (
            !document.getElementById(spotFilter[0]).classList.contains("X") &&
            !document.getElementById(spotFilter[0]).classList.contains("O")
          ) {
            // reassign let to return the single value of array
            freeSpots = spotFilter[0];
          }
        }
      }
    }
  }
  // return value to send to bot func
  return freeSpots;
};

// produces the bots next move - when bot has opportunity to win
const botOffense = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let move;
      let results = [];
      let combos = winningCombos.slice();
      for (let i = 0; i < combos.length; i++) {
        for (let j = 0; j < combos[i].length; j++) {
          if (currentBoardState[combos[i][j]] === "O") {
            results.push(combos[i][j]);
          }
        }
      }

      results = Array.from(new Set(results));

      for (let [index, combo] of combos.entries()) {
        const spotFilter = combo.filter(
          (moves) => !results.includes(Number(moves))
        );
        if (currentOCount >= 2) {
          if (spotFilter.length === 1) {
            if (spotFilter[0] !== "X" && spotFilter[0] !== "O") {
              if (
                !document
                  .getElementById(spotFilter[0])
                  .classList.contains("X") &&
                !document.getElementById(spotFilter[0]).classList.contains("O")
              ) {
                move = spotFilter[0];
              }
            }
          }
        }
      }
      resolve(move);
    }, 450);
  });
  return promise;
};

// removes value as a turn possibility upon invocation
const spotTaken = () => {
  const toSlice = openCells();
  return toSlice.slice(0, 1);
};

// main body for bot - checks if viable move, executes the necessary steps to simulate a user move
const bot = async () => {
  const botAttack = await botOffense();
  const botMove = botPicksSpot();
  const oh = document.createTextNode("O");
  if (typeof botAttack === "number") {
    spotTaken();
    document.getElementById(botAttack).appendChild(oh);
    currentOCount++;
    document.getElementById(botAttack).classList.add("O");
    turnFlag = true;
  } else if (botMove !== undefined) {
    spotTaken();
    document.getElementById(botMove).appendChild(oh);
    currentOCount++;
    document.getElementById(botMove).classList.add("O");
    turnFlag = true;
  }
};

/* -------------------- state tracker - win conditions - refresh game -------------------- */

// checks if move in question was the winning move
const checkWin = (boardObj) => {
  let exChoices = [];
  let ohChoices = [];
  for (let key in boardObj) {
    currentBoardState[Number(boardObj[key].idx)] = boardObj[key].choice;
    if (boardObj[key].choice === "X") {
      exChoices.push(Number(boardObj[key].idx));
    } else if (boardObj[key].choice === "O") {
      ohChoices.push(Number(boardObj[key].idx));
    }
  }
  for (let [index, combo] of winningCombos.entries()) {
    const exFilter = exChoices.filter((moves) => combo.includes(moves));
    const ohFilter = ohChoices.filter((moves) => combo.includes(moves));
    if (exFilter.length === 3) {
      endGame("X");
      setTimeout(() => {
        restartGame();
      }, 750);
    } else if (ohFilter.length === 3) {
      endGame("O");
      setTimeout(() => {
        restartGame();
      }, 750);
    } else if (Object.keys(boardObj).length === 9 && modalDisplay !== true) {
      endGame("DRAW");
      setTimeout(() => {
        restartGame();
      }, 750);
    }
  }
};

// keeps track of each moves index and value
const stateTracker = () => {
  boardState = [];
  const priorMoveArr = [].slice.call(rows);
  for (let i = 0; i < priorMoveArr.length; i++) {
    let spotCheck = priorMoveArr[i].children;
    spotCheck = Array.from(spotCheck);
    for (let j = 0; j < spotCheck.length; j++) {
      const content = spotCheck[j].classList.value;
      if (content.includes("X") || content.includes("O")) {
        boardState.push({
          idx: spotCheck[j].id,
          choice: content[content.length - 1],
        });
      }
    }
  }
  for (let key in boardState) {
    currentBoardState[Number(boardState[key].idx)] = boardState[key].choice;
  }
  return boardState;
};

// signals end of round and winner if one
const endGame = (winner) => {
  if (winner === "X") {
    exCount++;
    ohCount--;
  } else if (winner === "O") {
    ohCount++;
  }
  endFlag = true;
  turnFlag = true;
  if (winner !== "DRAW") {
    modal.style.display = "block";
    modalContent.innerHTML =
      `~ ${winner} WINS ~` +
      "<br/><br/>" +
      `the score is ` +
      "<br/>" +
      ` X's: ${exCount} ` +
      "<br/>" +
      ` O's: ${ohCount}`;
    modalDisplay = true;
  } else {
    modal.style.display = "block";
    modalContent.innerHTML =
      `~ ${winner} ~` +
      "<br/><br/>" +
      `the score remains ` +
      "<br/>" +
      ` X's: ${exCount} ` +
      "<br/>" +
      ` O's: ${ohCount}`;
    modelDisplay = true;
  }
};

// functionality for new game button, does not refresh browser
const restartGame = () => {
  endFlag = false;
  turnFlag = true;
  currentBoardState = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
  currentXCount = 0;
  currentOCount = 0;
  Array.from(document.getElementsByClassName("col")).forEach((cellText) => {
    cellText.textContent = "";
  });
  for (let row of table.rows) {
    for (let cell of row.cells) {
      cell.classList.remove("X");
      cell.classList.remove("O");
    }
  }
};

// creates X or O on click, checks if move ends game
const renderChoice = () => {
  for (let i = 0; i < rows.length; i++) {
    let rowsEvent = rows[i].addEventListener("click", (e) => {
      let table = e.target;
      let tempRes, check;
      if (table.classList.contains("X") || table.classList.contains("O")) {
        modalContent.innerHTML = "You cannot make this move";
        modal.style.display = "block";
        modalDisplay = true;
      } else if (turnFlag === true && endFlag === false) {
        const ex = document.createTextNode("X");
        table.appendChild(ex);
        table.classList.add("X");
        currentXCount++;
        turnFlag = false;

        // ---- code to play with bot ----
        setTimeout(async () => {
          await bot();
          tempRes = await stateTracker();
          check = await checkWin(tempRes);
        }, 450);

        // ---- code to play without bot ----
        //   } else if (turnFlag === false) {
        //   let oh = document.createTextNode("O");
        //   table.appendChild(oh);
        //   table.classList.add('O');
        //   turnFlag = true;
        //   tempRes = stateTracker();
        //   check = checkWin(tempRes);
      }
    });
  }
};

// function invocation
renderChoice();
