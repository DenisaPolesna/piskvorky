const SYMBOLS_TO_WIN = 5;
const ROW_COUNT = 10;
const EMPTY_SYMBOL = "_";
const TILES_PER_ROW = 10;
const TILES_PER_COLUMN = 10;
const DIAGONAL_STEP = 11; // Number of tiles to move to reach the next tile in a right-down diagonal

function getRowRange(rowIndex) {
  const rowStart = rowIndex * TILES_PER_ROW;
  const rowEnd = rowStart + (TILES_PER_ROW - 1);
  return { rowStart, rowEnd };
}

function getColumnRange(tileIndex) {
  const columnIndex = tileIndex % TILES_PER_COLUMN;
  const tileColumn = [];
  for (let i = 0; i < TILES_PER_COLUMN; i++) {
    tileColumn.push(i * TILES_PER_COLUMN + columnIndex);
  }
  return tileColumn;
}

/* Rotates a game board 90 degrees clockwise. */
const rotateGameBoard = (gameBoard, tileIndex) => {
  const rotatedGameBoard = [];
  let rotatedTileIndex = null;
  let rowIndex = 0;
  let orderInRow = ROW_COUNT - 1;

  gameBoard.forEach((tile, index) => {
    if (rowIndex > ROW_COUNT - 1) {
      rowIndex = 0;
      orderInRow -= 1;
    }
    const strRotatedTileIndex = String(rowIndex) + String(orderInRow);
    rotatedGameBoard[Number(strRotatedTileIndex)] = tile;

    rowIndex++;
    if (tileIndex === index && tile != EMPTY_SYMBOL) {
      tileIndex = Number(strRotatedTileIndex);
    }
  });

  rotatedTileIndex = tileIndex;
  return { rotatedGameBoard, rotatedTileIndex };
};

const getDiagonalEnd = (diagonalStart, symbolIndex) => {
  const range = getColumnRange(symbolIndex);
  const diagonalEnd =
    (range.length - 1 - diagonalStart) * DIAGONAL_STEP + diagonalStart;
  return diagonalEnd;
};

const getRowIndex = (tileIndex) => {
  return Math.floor(tileIndex / TILES_PER_ROW);
};

const getDiagonalBounds = (tileIndex) => {
  let diagonalStart = tileIndex;
  let diagonalEnd = null;
  let rowIndex = getRowIndex(tileIndex);

  // Diagonal starting from rows 5 (index 6) to 10 (index 9) - only first column, going down to the right.
  if (tileIndex % TILES_PER_COLUMN === 0 && tileIndex != 0 && tileIndex > 50) {
    return null;
  } else if (tileIndex > TILES_PER_ROW - 1) {
    // Diagonal starting from row 2 (index 1), going down to the right. Right half of play board.
    diagonalStart = tileIndex - DIAGONAL_STEP * rowIndex;
    // Diagonal starting from rows 2 (index 1) to 5 (index 4), going down to the right. Left half of play board.
    if (diagonalStart < 0) {
      diagonalStart = tileIndex;
      while (diagonalStart % TILES_PER_COLUMN != 0) {
        diagonalStart -= DIAGONAL_STEP;
      }

      diagonalEnd = diagonalStart;
      while (diagonalEnd + DIAGONAL_STEP < TILES_PER_COLUMN * TILES_PER_ROW) {
        diagonalEnd += DIAGONAL_STEP;
      }
    } else {
      diagonalEnd = getDiagonalEnd(diagonalStart, tileIndex);
    }
  } else {
    // Diagonal starting from row 1 (index 0), going down to the right.
    diagonalEnd = getDiagonalEnd(diagonalStart, tileIndex);
  }
  // Diagonals starting from columns 5 to 9 in the top row (index 0), going down to the right.
  if (diagonalStart > 5 && diagonalStart <= 9) return null;
  if (diagonalStart > 50 && diagonalStart <= 90) return null;

  return { diagonalStart, diagonalEnd };
};

// Checks a diagonal for 5 identical symbols in a row. Returns the winner or null.
const checkSameSymbolDiagonal = (diagonalStart, diagonalEnd, gameBoard) => {
  let symbol = null;
  let sameSymbolCount = 0;
  let symbolIndexDiagonal = 0;
  let possibleWinner = null;
  let winner = null;

  for (let i = diagonalStart; i <= diagonalEnd; i += DIAGONAL_STEP) {
    symbol = gameBoard[i];

    if (symbol === EMPTY_SYMBOL) {
      possibleWinner = null;
      sameSymbolCount = 0;
      winner = possibleWinner;
    } else if (symbol === possibleWinner) {
      sameSymbolCount++;
      if (sameSymbolCount === SYMBOLS_TO_WIN) {
        winner = symbol;
        break;
      }
    } else {
      possibleWinner = symbol;
      sameSymbolCount = 1;
      winner = null;
    }
    /* Checks whether there are enough remaining cells on the diagonal to potentially achieve five identical symbols in a row. */
    if (symbol != EMPTY_SYMBOL) {
      let diagonalPosition = i;
      let remainingTiles = 0;
      while (diagonalPosition < diagonalEnd) {
        diagonalPosition += DIAGONAL_STEP;
        remainingTiles++;
      }

      if (sameSymbolCount + remainingTiles < SYMBOLS_TO_WIN) {
        winner = null;
        break;
      }
    }
    symbolIndexDiagonal++;
  }
  return winner;
};

const checkWinnerDiagonalLeft = (gameBoard, tileEl, tileEls) => {
  let tileIndex = Array.from(tileEls).indexOf(tileEl);
  let rotatedGameBoard = [];
  let rotatedTileIndex = null;

  ({ rotatedGameBoard: rotatedGameBoard, rotatedTileIndex: rotatedTileIndex } =
    rotateGameBoard(gameBoard, tileIndex));

  const diagonals = getDiagonalBounds(rotatedTileIndex);
  if (diagonals === null) return null;

  const { diagonalStart, diagonalEnd } = diagonals;

  const winner = checkSameSymbolDiagonal(
    diagonalStart,
    diagonalEnd,
    rotatedGameBoard,
    rotatedTileIndex,
  );

  return winner;
};

const checkWinnerDiagonalRight = (gameBoard, tileEl, tileEls) => {
  let tileIndex = Array.from(tileEls).indexOf(tileEl);

  const diagonals = getDiagonalBounds(tileIndex);
  if (diagonals === null) return null;

  const { diagonalStart, diagonalEnd } = diagonals;

  const winner = checkSameSymbolDiagonal(
    diagonalStart,
    diagonalEnd,
    gameBoard,
    tileIndex,
  );

  return winner;
};

const checkWinnerColumn = (gameBoard, tileEl, tileEls) => {
  let tileIndex = Array.from(tileEls).indexOf(tileEl);
  const columnRange = getColumnRange(tileIndex);

  let symbol;
  let symbolIndex = 0;
  let sameSymbolCount = 0;
  let possibleWinner = null;
  let winner = null;

  for (let i = 0; i < TILES_PER_COLUMN; i++) {
    symbol = gameBoard[columnRange[i]];

    if (symbol === EMPTY_SYMBOL) {
      possibleWinner = null;
      sameSymbolCount = 0;
      winner = possibleWinner;
    } else if (symbol === possibleWinner) {
      sameSymbolCount++;
      if (sameSymbolCount === SYMBOLS_TO_WIN) {
        winner = symbol;
        break;
      }
    } else {
      possibleWinner = symbol;
      sameSymbolCount = 1;
      winner = null;
    }

    if (symbolIndex > SYMBOLS_TO_WIN && symbol != EMPTY_SYMBOL) {
      if (
        sameSymbolCount + (TILES_PER_COLUMN - symbolIndex - 1) <
        SYMBOLS_TO_WIN
      ) {
        winner = null;
        break;
      }
    }
    symbolIndex++;
  }
  return winner;
};

const checkWinnerRow = (gameBoard, tileEl, tileEls) => {
  let tileIndex = Array.from(tileEls).indexOf(tileEl);
  let rowIndex = getRowIndex(tileIndex);
  const rowStart = getRowRange(rowIndex).rowStart;
  const rowEnd = getRowRange(rowIndex).rowEnd;

  let symbol;
  let symbolIndex = 0;
  let sameSymbolCount = 0;
  let possibleWinner = null;
  let winner = null;

  for (let i = rowStart; i <= rowEnd; i++) {
    symbol = gameBoard[i];

    if (symbol === EMPTY_SYMBOL) {
      possibleWinner = null;
      sameSymbolCount = 0;
      winner = possibleWinner;
    } else if (symbol === possibleWinner) {
      sameSymbolCount++;
      if (sameSymbolCount === SYMBOLS_TO_WIN) {
        winner = symbol;
        break;
      }
    } else {
      possibleWinner = symbol;
      sameSymbolCount = 1;
      winner = null;
    }

    if (symbolIndex > SYMBOLS_TO_WIN && symbol != EMPTY_SYMBOL) {
      if (
        sameSymbolCount + (TILES_PER_ROW - symbolIndex - 1) <
        SYMBOLS_TO_WIN
      ) {
        winner = null;
        break;
      }
    }
    symbolIndex++;
  }
  return winner;
};

export const findWinner = (gameBoard, tileEl, tileEls) => {
  let winner = checkWinnerRow(gameBoard, tileEl, tileEls);

  if (winner === null) {
    winner = checkWinnerColumn(gameBoard, tileEl, tileEls);
  }

  if (winner === null) {
    winner = checkWinnerDiagonalRight(gameBoard, tileEl, tileEls);
  }

  if (winner === null) {
    winner = checkWinnerDiagonalLeft(gameBoard, tileEl, tileEls);
  }

  if (!gameBoard.includes(EMPTY_SYMBOL)) {
    winner = "tie";
  }

  return winner;
};
