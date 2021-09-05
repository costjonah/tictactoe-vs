var turnFlag = true;
var endFlag = false;

var tableData = document.getElementById('table');
var rows = document.getElementsByClassName('row');

var exCount = 0;
var ohCount = 0;

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
    }
  }
  if (Object.keys(boardObj).length === 9) {
     endGame();
     restartGame();
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
  return boardState;
};

// signals end of round and winner if one
var endGame = (winner) => {
  if (winner) {
    alert(`~ ${winner} WINS ~` + '\n' + `the score is ` + '\n' + ` X's: ${exCount} ` + '\n' + ` O's: ${ohCount}`);
  } else {
    alert('Draw');
  }
};

// functionality for new game button, does not refresh browser
restartGame = () => {
  Array.from(document.getElementsByClassName('col')).forEach(cellText => {
    cellText.textContent = '';
  })
  for (var row of table.rows) {
    for (var cell of row.cells) {
      cell.classList.remove('X');
      cell.classList.remove('O');
    }
  }
  turnFlag = !turnFlag;
};

// creates X or O on click, checks if move ends game
var renderChoice = () => {
  for (var i = 0; i < rows.length; i++) {
    var rowsEvent = rows[i].addEventListener('click', (e) => {
      var table = e.target;
      var tempRes, check;
      var ex = document.createTextNode("X");
      var oh = document.createTextNode("O");
      if (table.classList.contains("X") || table.classList.contains("O")) {
        alert('You cannot make this move');
      } else if (turnFlag) {
        table.appendChild(ex);
        table.classList.add('X');
        tempRes = stateTracker();
        check = checkWin(tempRes);
        turnFlag = !turnFlag;
      } else {
        table.appendChild(oh);
        table.classList.add('O');
        tempRes = stateTracker();
        check = checkWin(tempRes);
        turnFlag = !turnFlag;
      }
    });
  }
};

renderChoice();

