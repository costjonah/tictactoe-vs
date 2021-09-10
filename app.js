var turnFlag = true;
var endFlag = false;
var modalDisplay = false;

var tableData = document.getElementById('table');
var rows = document.getElementsByClassName('row');
var cells = document.getElementsByClassName('col');

var modal = document.getElementById('alert-modal');
var span = document.getElementsByClassName("close")[0];
var modalContent = document.getElementById("modal-text");

span.onclick = function () {
  modal.style.display = "none";
  modalDisplay = false;
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    modalDisplay = false;
  }
};

var exCount = 0;
var ohCount = 0;

var currentBoardState = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
var currentXCount = 0;

var winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// checks if move in question was the winning move
var checkWin = (boardObj) => {
  var exChoices = [];
  var ohChoices = [];
  for (var key in boardObj) {
    currentBoardState[Number(boardObj[key].idx)] = boardObj[key].choice;
    if (boardObj[key].choice === 'X') {
      exChoices.push(Number(boardObj[key].idx));
    } else if (boardObj[key].choice === 'O') {
      ohChoices.push(Number(boardObj[key].idx));
    }
  }
  for (var [index, combo] of winningCombos.entries()) {
    var exFilter = exChoices.filter((moves) => combo.includes(moves));
    var ohFilter = ohChoices.filter((moves) => combo.includes(moves));
    if (exFilter.length === 3) {
      exCount++;
      endGame('X');
      restartGame();
    } else if (ohFilter.length === 3) {
      ohCount++;
      endGame('O');
      restartGame();
    } else if (Object.keys(boardObj).length === 9 && modalDisplay !== true) {
      endGame('DRAW');
      restartGame();
    }
  }
};

// keeps track of each moves index and value
var stateTracker = () => {
  boardState = [];
  var priorMoveArr = [].slice.call(rows);
  for (var i = 0; i < priorMoveArr.length; i++) {
    var spotCheck = priorMoveArr[i].children;
    spotCheck = Array.from(spotCheck);
    for (var j = 0; j < spotCheck.length; j++) {
      var content = spotCheck[j].classList.value;
      if (content.includes('X') || content.includes('O')) {
        boardState.push({
          idx: spotCheck[j].id,
          choice: content[content.length - 1]
        });
      }
    }
  }
  for (var key in boardState) {
    currentBoardState[Number(boardState[key].idx)] = boardState[key].choice;
  }
  // console.log(currentBoardState);
  return boardState;
};

// signals end of round and winner if one
var endGame = (winner) => {
  endFlag = true;
  turnFlag = true;
  if (winner !== 'DRAW') {
    modal.style.display = "block";
    modalContent.innerHTML = (`~ ${winner} WINS ~` + '<br/><br/>' + `the score is ` + '<br/>' + ` X's: ${exCount} ` + '<br/>' + ` O's: ${ohCount}`);
    modalDisplay = true;
  } else {
    modal.style.display = "block";
    modalContent.innerHTML = (`~ ${winner} ~` + '<br/><br/>' + `the score remains ` + '<br/>' + ` X's: ${exCount} ` + '<br/>' + ` O's: ${ohCount}`);
    modelDisplay = true;
  }
};

// functionality for new game button, does not refresh browser
restartGame = () => {
  endFlag = false;
  turnFlag = true;
  currentBoardState = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
  currentXCount = 0;
  Array.from(document.getElementsByClassName('col')).forEach(cellText => {
    cellText.textContent = '';
  })
  for (var row of table.rows) {
    for (var cell of row.cells) {
      cell.classList.remove('X');
      cell.classList.remove('O');
    }
  }
};

var openCells = () => {
  var remains = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
  var checking = stateTracker();
  for (var key in checking) {
    remains = remains.filter(item => item !== checking[key].idx)
  }
  remains = randomize(remains);
  return remains;
};

var randomize = (arr) => {
  for (var i = arr.length - 1; i > 0; i--) {
    var random = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[random]] = [arr[random], arr[i]];
  }
  return arr;
};

// --- incomplete bot function. bot randomizes but doesnt block users moves yet ---
var botPicksSpot = () => {
  // assign var to first index of randomized board state
  // var freeSpots = openCells()[0];
  // // instantiate empty container
  // var results = [];
  // // instantiate shallow copy of possible winning combinations
  // var combos = winningCombos.slice();
  // // iterate through combos matrix
  // for (var k = 0; k < combos.length; k++) {
  //   // iterate through current level of matrix
  //   for (var y = 0; y < combos[k].length; y++) {
  //     // check if current iteration's value is string X
  //     if (currentBoardState[combos[k][y]] === 'X') {
  //       // push to container
  //       results.push(combos[k][y]);
  //     }
  //   }
  // }
  // // create unique array from container's values
  // results = Array.from(new Set(results));

  // // iterate through winning combination - keep track of index and it's value
  // for (var [index, combo] of combos.entries()) {
  //   // initialize array from filtering open spots from combos
  //   var spotFilter = combo.filter((moves) => !results.includes(Number(moves)));
  //   // check if total 'X's on board's current state is equal to two
  //   if (currentXCount === 2) {
  //       // check if last remaining value
  //       if (spotFilter.length === 1) {
  //         // if 'X' or 'O' does not exist before move
  //         if (spotFilter[0] !== 'X' && spotFilter[0] !== 'O') {
  //           // reassign var to return to the single value of array
  //           freeSpots = spotFilter[0];

  //          }

  //     }
  //   }
    // } else if (currentXCount > 2) {
    //   console.log('COMBO', combo)
    //   spotFilter = combo.filter((moves) => !currentBoardState.includes(Number(moves)))
    //   console.log('LINE198', spotFilter)
    //   if (spotFilter.length < 3) {
    //     if (spotFilter.length === 1) {
    //       if (spotFilter[0] !== 'X' && spotFilter[0] !== 'O') {
    //         freeSpots = spotFilter[0]
    //         if (spotFilter.length === 0) {
    //           if (openCells()[0] !== 'X' && openCells()[0] !== 'O') {
    //             freeSpots = openCells()[0]
    //           }
    //         }
    //       }
    //     }
    //   }

    // }
  // }
  // return value
  // return freeSpots;
  return openCells()[0];
};

spotTaken = () => {
  var toSlice = openCells();
  return toSlice.slice(0, 1);
};

var bot = () => {
  var botMove = botPicksSpot();
  if (botMove !== undefined) {
    spotTaken();
    var oh = document.createTextNode("O");
    document.getElementById(botMove).appendChild(oh);
    document.getElementById(botMove).classList.add('O');
    turnFlag = true;
  }
};

// creates X or O on click, checks if move ends game
var renderChoice = () => {
  for (var i = 0; i < rows.length; i++) {
    var rowsEvent = rows[i].addEventListener('click', (e) => {
      var table = e.target;
      var tempRes, check;
      if (table.classList.contains("X") || table.classList.contains("O")) {
        modalContent.innerHTML = "You cannot make this move";
        modal.style.display = "block";
        modalDisplay = true;
      } else if (turnFlag === true && endFlag === false) {
        var ex = document.createTextNode("X");
        table.appendChild(ex);
        table.classList.add('X');
        currentXCount++;
        turnFlag = false;
        setTimeout(() => {
          bot(); // comment out to disable
          tempRes = stateTracker();
          check = checkWin(tempRes);
        }, 400);

        // ---- code to play without bot ----
        //   } else if (turnFlag === false) {
        //   var oh = document.createTextNode("O");
        //   table.appendChild(oh);
        //   table.classList.add('O');
        //   turnFlag = true;
        //   tempRes = stateTracker();
        //   check = checkWin(tempRes);
      }
    });
  }
};

renderChoice();

