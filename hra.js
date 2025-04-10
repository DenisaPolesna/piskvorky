const CIRCLE = "circle";
const CROSS = "cross";

let currentPlayer = CIRCLE;
const currentPlayerSymbol = document.querySelector(".game__symbol");
currentPlayerSymbol.classList.add("game__symbol--circle");
const gameBoard = document.querySelector(".game__board");
const restarBtn = document.querySelector(".game__icon--restart");

const drawAndSwitchSymbol = (field, currentSymbol, nextSymbol) => {
  field.classList.add("game__board-field");
  field.classList.add(`game__board-field--${currentSymbol}`);
  currentPlayerSymbol.classList.toggle(`game__symbol--${currentSymbol}`);
  currentPlayerSymbol.classList.toggle(`game__symbol--${nextSymbol}`);
  currentPlayer = nextSymbol;
};

const onFieldClick = (event) => {
  const field = event.target;
  // Prevent symbol creation if the button is disabled or the clicked element is a <div>
  if (field.disabled || field instanceof HTMLDivElement) return;

  if (currentPlayer === CIRCLE) {
    drawAndSwitchSymbol(field, CIRCLE, CROSS);
  } else {
    drawAndSwitchSymbol(field, CROSS, CIRCLE);
  }
  field.disabled = true;
};

const onRestartBtnClick = (event) => {
  const okBtnPressed = confirm("Opravdu chceš začít znovu?");
  if (!okBtnPressed) event.preventDefault();
};

gameBoard.addEventListener("click", onFieldClick);
restarBtn.addEventListener("click", onRestartBtnClick);
