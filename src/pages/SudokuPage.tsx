import { useState } from 'react'
import type { Page } from '../App'
import type { Board } from '../games/sudoku/solver'
import { solve, validateBoard } from '../games/sudoku/solver'
import './SudokuPage.css'

interface SudokuPageProps {
  onNavigate: (page: Page) => void
}

const GRID_SIZE = 9
const EMPTY_CELL = '.'

function createEmptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(EMPTY_CELL))
}

function SudokuPage({ onNavigate }: SudokuPageProps) {
  const [board, setBoard] = useState<Board>(createEmptyBoard)
  const [message, setMessage] = useState<string | null>(null)

  function handleCellChange(row: number, col: number, rawValue: string) {
    const value = rawValue.trim()
    if (value !== '' && !/^[1-9]$/.test(value)) return

    const nextBoard = board.map((boardRow) => [...boardRow])
    nextBoard[row][col] = value === '' ? EMPTY_CELL : value
    setBoard(nextBoard)
    setMessage(null)
  }

  function handleSolve() {
    const validation = validateBoard(board)
    if (!validation.valid) {
      setMessage(validation.reason)
      return
    }

    const result = solve(board)
    if (result.solved) {
      setBoard(result.board)
      setMessage(null)
    } else if (result.reason === 'no-solution') {
      setMessage('This puzzle has no solution.')
    } else {
      setMessage(result.detail ?? 'This puzzle is invalid.')
    }
  }

  function handleReset() {
    setBoard(createEmptyBoard())
    setMessage(null)
  }

  return (
    <section className="page sudoku-page">
      <button type="button" className="back-link" onClick={() => onNavigate('home')}>
        ← Back to games
      </button>

      <h1>Sudoku Solver</h1>

      <div className="sudoku-grid">
        {board.map((boardRow, row) =>
          boardRow.map((cell, col) => {
            const index = row * GRID_SIZE + col
            const classes = ['sudoku-cell']
            if (col % 3 === 0) classes.push('border-left')
            if (row % 3 === 0) classes.push('border-top')
            if (col === GRID_SIZE - 1) classes.push('border-right')
            if (row === GRID_SIZE - 1) classes.push('border-bottom')
            return (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={classes.join(' ')}
                aria-label={`Row ${row + 1}, column ${col + 1}`}
                value={cell === EMPTY_CELL ? '' : cell}
                onChange={(event) => handleCellChange(row, col, event.target.value)}
              />
            )
          }),
        )}
      </div>

      {message && <p className="sudoku-message">{message}</p>}

      <div className="sudoku-controls">
        <button type="button" className="btn btn-accent" onClick={handleSolve}>
          Solve
        </button>
        <button type="button" className="btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </section>
  )
}

export default SudokuPage
