import type { Board, Cell } from './ai'

export type GameResult = Cell | 'draw' | null
export type WinningLine = readonly [number, number, number]

const WIN_LINES: ReadonlyArray<WinningLine> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function getWinningLine(board: Board): WinningLine | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line
    }
  }
  return null
}

export function getResult(board: Board): GameResult {
  const line = getWinningLine(board)
  if (line) return board[line[0]]
  if (board.every((cell) => cell !== null)) return 'draw'
  return null
}
