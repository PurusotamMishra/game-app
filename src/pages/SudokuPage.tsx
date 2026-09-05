import type { Page } from '../App'
import './SudokuPage.css'

interface SudokuPageProps {
  onNavigate: (page: Page) => void
}

const GRID_SIZE = 9

function SudokuPage({ onNavigate }: SudokuPageProps) {
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE })

  return (
    <section className="page sudoku-page">
      <button type="button" className="back-link" onClick={() => onNavigate('home')}>
        ← Back to games
      </button>

      <h1>Sudoku Solver</h1>

      <div className="sudoku-grid">
        {cells.map((_, index) => {
          const row = Math.floor(index / GRID_SIZE)
          const col = index % GRID_SIZE
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
            />
          )
        })}
      </div>

      <div className="sudoku-controls">
        <button type="button" className="btn btn-accent">
          Solve
        </button>
        <button type="button" className="btn">
          Reset
        </button>
      </div>
    </section>
  )
}

export default SudokuPage
