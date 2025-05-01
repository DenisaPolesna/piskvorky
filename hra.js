import { findWinner } from "./findWinner.js";

const CIRCLE_STR = "circle";
const CIRCLE_SYMBOL = "o";
const CROSS_STR = "cross";
const CROSS_SYMBOL = "x";
const EMPTY_SYMBOL = "_";

let currentPlayerSymbol = CIRCLE_STR;
const currentPlayerSymbolEl = document.querySelector(".game__symbol");
currentPlayerSymbolEl.classList.add(`game__symbol--${currentPlayerSymbol}`);
const gameBoardEl = document.querySelector(".game__board");
const restartBtnEl = document.querySelector(".game__icon--restart");
const tilesEl = document.querySelectorAll(".game__board-button");

// Collects all symbols from the game board into a single array
const createGameBoard = () => {
  const gameBoard = Array.from(tilesEl).map((tile) => {
    const tileClasses = Array.from(tile.classList);
    if (tileClasses.some((tileClass) => tileClass.includes(CROSS_STR))) {
      return CROSS_SYMBOL;
    } else if (
      tileClasses.some((tileClass) => tileClass.includes(CIRCLE_STR))
    ) {
      return CIRCLE_SYMBOL;
    } else {
      return EMPTY_SYMBOL;
    }
  });
  return gameBoard;
};

const disableAllTiles = () => {
  tilesEl.forEach((tile) => {
    tile.disabled = true;
  });
};

const playAgain = () => {
  const okBtnPressed = confirm("Chceš začít znovu?");
  if (okBtnPressed) location.reload();
};

const checkWinner = (tileEl) => {
  const gameBoard = createGameBoard();
  const winner = findWinner(gameBoard, tileEl, tilesEl);

  if (winner === CIRCLE_SYMBOL || winner === CROSS_SYMBOL) {
    disableAllTiles();
    setTimeout(() => {
      alert(`Vyhrál hráč se symbolem ${winner}.`);
      playAgain();
    }, 300);
    return;
  }
  if (winner === "tie") {
    setTimeout(() => {
      alert(`Hra skončila remízou.`);
      playAgain();
    }, 300);
  }
};

const drawAndSwitchSymbol = (tile, currentSymbol, nextSymbol) => {
  tile.classList.add("game__board-tile");
  tile.classList.add(`game__board-tile--${currentSymbol}`);
  currentPlayerSymbolEl.classList.toggle(`game__symbol--${currentSymbol}`);
  currentPlayerSymbolEl.classList.toggle(`game__symbol--${nextSymbol}`);
  currentPlayerSymbol = nextSymbol;
};

// Renders a symbol (x or o), disables the tile, and checks for a winner
const onTileClick = (event) => {
  const tileEl = event.target;
  // Prevent symbol creation if the button is disabled or the clicked element is a <div>
  if (tileEl.disabled || tileEl instanceof HTMLDivElement) return;

  if (currentPlayerSymbol === CIRCLE_STR) {
    drawAndSwitchSymbol(tileEl, CIRCLE_STR, CROSS_STR);
  } else {
    drawAndSwitchSymbol(tileEl, CROSS_STR, CIRCLE_STR);
  }
  tileEl.disabled = true;
  checkWinner(tileEl);
};

const onRestartBtnClick = (event) => {
  const okBtnPressed = confirm("Opravdu chceš začít znovu?");
  if (!okBtnPressed) event.preventDefault();
};

gameBoardEl.addEventListener("click", onTileClick);
restartBtnEl.addEventListener("click", onRestartBtnClick);
