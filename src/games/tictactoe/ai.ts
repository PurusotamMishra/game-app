export type Cell = 'X' | 'O' | null
export type Board = Cell[]

const LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // cols
  [0, 4, 8], [2, 4, 6],              // diagonals
];

type Outcome = 'X' | 'O' | 'draw' | null;

// ---------- Easy: unchanged ----------

export function nextStepEasy(_board: Board, emptyIndices: number[]): number {
  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}

// ---------- Medium: alternates minimax → random → minimax ... ----------

export function nextStepMedium(board: Board, emptyIndices: number[]): number {
  // Count of O's already on board = number of AI moves already made.
  // 0 → this is AI's 1st move → minimax
  // 1 → 2nd move → random
  // 2 → 3rd move → minimax
  const aiMovesMade = board.reduce((n, c) => (c === 'O' ? n + 1 : n), 0);

  if (aiMovesMade % 2 === 0) {
    return bestMove(board, emptyIndices);
  }
  return nextStepEasy(board, emptyIndices);
}

// ---------- Hard: minimax always ----------

export function nextStepHard(board: Board, emptyIndices: number[]): number {
  return bestMove(board, emptyIndices);
}

// ---------- Internals ----------

function bestMove(board: Board, emptyIndices: number[]): number {
  const working: Board = [...board];       // don't mutate caller's board
  let bestScore = -Infinity;
  let bestIndex = emptyIndices[0];

  for (const i of emptyIndices) {
    working[i] = 'O';
    const score = minimax(working, false, 1);
    working[i] = null;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return bestIndex;
}

/**
 * Minimax. AI (O) maximizes, human (X) minimizes.
 * Depth-adjusted scores make AI prefer faster wins / slower losses.
 * Mutates `board` during recursion but always restores it — caller-safe as
 * long as the entry point (bestMove) passes a clone.
 */
function minimax(board: Board, isMaximizing: boolean, depth: number): number {
  const outcome = getOutcome(board);
  if (outcome === 'O') return 10 - depth;
  if (outcome === 'X') return depth - 10;
  if (outcome === 'draw') return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      board[i] = 'O';
      best = Math.max(best, minimax(board, false, depth + 1));
      board[i] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      board[i] = 'X';
      best = Math.min(best, minimax(board, true, depth + 1));
      board[i] = null;
    }
    return best;
  }
}

function getOutcome(board: Board): Outcome {
  for (const [a, b, c] of LINES) {
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every((cell) => cell !== null)) return 'draw';
  return null;
}