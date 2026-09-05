export type Board = string[][]

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: string; conflicts: Array<[number, number]> }

export type SolveResult =
  | { solved: true; board: Board }
  | { solved: false; reason: 'invalid-input' | 'no-solution'; detail?: string }

const EMPTY = '.'

// ---------- Validation ----------

export function validateBoard(board: Board): ValidationResult {
  // Shape
  if (!Array.isArray(board) || board.length !== 9) {
    return { valid: false, reason: 'Board must have 9 rows', conflicts: [] }
  }
  for (let r = 0; r < 9; r++) {
    if (!Array.isArray(board[r]) || board[r].length !== 9) {
      return { valid: false, reason: `Row ${r} must have 9 columns`, conflicts: [] }
    }
  }

  // Cell contents: "." or "1"-"9"
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c]
      if (v !== EMPTY && !/^[1-9]$/.test(v)) {
        return {
          valid: false,
          reason: `Invalid value "${v}" at row ${r}, col ${c}`,
          conflicts: [[r, c]],
        }
      }
    }
  }

  // Duplicates in rows and columns (single pass)
  for (let i = 0; i < 9; i++) {
    const rowSeen = new Map<string, number>()
    const colSeen = new Map<string, number>()

    for (let j = 0; j < 9; j++) {
      const rowVal = board[i][j]
      if (rowVal !== EMPTY) {
        if (rowSeen.has(rowVal)) {
          return {
            valid: false,
            reason: `Duplicate ${rowVal} in row ${i}`,
            conflicts: [
              [i, rowSeen.get(rowVal)!],
              [i, j],
            ],
          }
        }
        rowSeen.set(rowVal, j)
      }

      const colVal = board[j][i]
      if (colVal !== EMPTY) {
        if (colSeen.has(colVal)) {
          return {
            valid: false,
            reason: `Duplicate ${colVal} in column ${i}`,
            conflicts: [
              [colSeen.get(colVal)!, i],
              [j, i],
            ],
          }
        }
        colSeen.set(colVal, j)
      }
    }
  }

  // Duplicates in 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Map<string, [number, number]>()

      for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
        for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
          const v = board[r][c]
          if (v === EMPTY) continue

          if (seen.has(v)) {
            return {
              valid: false,
              reason: `Duplicate ${v} in box (${boxRow}, ${boxCol})`,
              conflicts: [seen.get(v)!, [r, c]],
            }
          }
          seen.set(v, [r, c])
        }
      }
    }
  }

  return { valid: true }
}

// ---------- Solver (wrapper — safe for React) ----------

export function solve(board: Board): SolveResult {
  const validation = validateBoard(board)
  if (!validation.valid) {
    return { solved: false, reason: 'invalid-input', detail: validation.reason }
  }

  const working = board.map((row) => [...row]) // deep clone (rows are string[])

  if (solveInPlace(working)) {
    return { solved: true, board: working }
  }
  return { solved: false, reason: 'no-solution' }
}

// ---------- Solver (in-place, backtracking) ----------

function solveInPlace(board: Board): boolean {
  const cell = findBestCell(board)
  if (cell === null) return true // no empty cells → solved

  const { row, col, candidates } = cell
  if (candidates.length === 0) return false // dead end

  for (const value of candidates) {
    board[row][col] = value
    if (solveInPlace(board)) return true
    board[row][col] = EMPTY // backtrack
  }
  return false
}

function findBestCell(
  board: Board,
): { row: number; col: number; candidates: string[] } | null {
  let bestCell: { row: number; col: number; candidates: string[] } | null = null
  let minCandidates = 10

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== EMPTY) continue

      const candidates = getCandidates(board, row, col)

      if (candidates.length === 0) {
        return { row, col, candidates: [] } // signal dead end
      }

      if (candidates.length < minCandidates) {
        minCandidates = candidates.length
        bestCell = { row, col, candidates }
        if (minCandidates === 1) return bestCell
      }
    }
  }
  return bestCell
}

function getCandidates(board: Board, row: number, col: number): string[] {
  const used = new Set<string>()

  for (let c = 0; c < 9; c++) {
    if (board[row][c] !== EMPTY) used.add(board[row][c])
  }
  for (let r = 0; r < 9; r++) {
    if (board[r][col] !== EMPTY) used.add(board[r][col])
  }

  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] !== EMPTY) used.add(board[r][c])
    }
  }

  const candidates: string[] = []
  for (let num = 1; num <= 9; num++) {
    const v = String(num)
    if (!used.has(v)) candidates.push(v)
  }
  return candidates
}
