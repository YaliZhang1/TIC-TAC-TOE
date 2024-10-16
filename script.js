const Gameboard = (function () {
  const gameboard = Array(9).fill("");

  function checkWin(mark) {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ].some((winningCombination) =>
      winningCombination.every((index) => gameboard[index] === mark)
    );
  }

  function checkTie() {
    return gameboard.every((cell) => cell !== "");
  }

  function setCell(index, mark) {
    if (gameboard[index] === "") {
      gameboard[index] = mark;
      return true;
    } else {
      return false;
    }
  }

  function resetCells() {
    gameboard.fill("");
  }

  function disableBoard() {
    for (let i = 0; i < gameboard.length; i++) {
      let cell = document.getElementById(`cell${i}`);
      if (cell.textContent === "") {
        cell.onclick = null;
      }
    }
  }

  function render() {
    for (let i = 0; i < gameboard.length; i++) {
      let cell = document.getElementById(`cell${i}`);
      cell.textContent = gameboard[i];

      if (cell.textContent === "") {
        cell.onclick = () => {
          GameController.playRound(i);
        };
      } else {
        if (cell.textContent === "X") {
          cell.classList.add("text-primary");
        } else if (cell.textContent === "O") {
          cell.classList.add("text-danger");
        }
      }
    }
  }

  return {
    checkWin,
    checkTie,
    setCell,
    resetCells,
    render,
    disableBoard,
  };
})();

const GameController = (function () {
  const players = Array(2);
  let currentPlayerIdx = 0;
  let gameOn = false;
  let txtDisplayDiv = document.querySelector("#text-display");
  function createPlayer(name, mark) {
    return { name, mark };
  }

  function setupGame() {
    const p1Name = document.getElementById("p1-name-input").value.trim();
    const p2Name = document.getElementById("p2-name-input").value.trim();

    if (!p1Name || !p2Name) {
      txtDisplayDiv.textContent = "Please enter player names!";
      return false;
    }

    if (p1Name === p2Name) {
      txtDisplayDiv.textContent = "Player names must be different!";
      return false;
    }
    players[0] = createPlayer(p1Name, "X");
    players[1] = createPlayer(p2Name, "O");

    Gameboard.resetCells();
    Gameboard.render();

    currentPlayerIdx = 0;
    gameOn = true;
    return true;
  }

  function playRound(index) {
    let isCellSet = Gameboard.setCell(index, players[currentPlayerIdx].mark);
    if (!isCellSet) {
      return;
    }

    Gameboard.render();

    if (Gameboard.checkWin(players[currentPlayerIdx].mark)) {
      txtDisplayDiv.textContent = `${players[currentPlayerIdx].name} wins!`;
      Gameboard.disableBoard();
      return;
    }

    if (Gameboard.checkTie()) {
      txtDisplayDiv.textContent = "It's a tie!";
      return;
    }
    switchPlayer();
    return;
  }

  function switchPlayer() {
    currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
    txtDisplayDiv.textContent = `It's ${players[currentPlayerIdx].name}'s turn'!`;
  }

  function playGame() {
    let gameSet = setupGame();

    if (!gameSet) {
      return;
    }
  }

  return {
    playGame,
    playRound,
  };
})();
