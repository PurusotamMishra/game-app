import { useState } from 'react'
import type { Page } from '../App'
import { SudokuIcon, TicTacToeIcon } from '../components/icons'
import './Home.css'

type GameKey = 'sudoku' | 'tictactoe'

const RULES: Record<GameKey, { title: string; text: string[] }> = {
  sudoku: {
    title: 'Sudoku',
    text: [
      'A Sudoku grid has 9 rows, 9 columns, and nine 3x3 boxes. Each row, column, and box must contain the digits 1 through 9 exactly once, with no repeats.',
      'For this solver, you enter the digits you already know into the grid. It checks your entries against the rules above, then works out and fills in the rest to complete the puzzle.',
    ],
  },
  tictactoe: {
    title: 'Tic-Tac-Toe',
    text: [
      'Two players take turns marking empty cells on a 3x3 grid, one with X and the other with O. X always moves first.',
      'The first to line up three of their own marks wins — there are eight ways to do it: three rows, three columns, or two diagonals. If all nine cells fill up with no line, the game ends in a draw.',
    ],
  },
}

interface HomeProps {
  onNavigate: (page: Page) => void
}

function Home({ onNavigate }: HomeProps) {
  const [activeTab, setActiveTab] = useState<GameKey>('sudoku')
  const rules = RULES[activeTab]

  return (
    <section className="page home">
      <header className="home-intro">
        <h1>Games</h1>
        <p>Pick a game to play.</p>
      </header>

      <div className="game-cards">
        <button type="button" className="game-card" onClick={() => onNavigate('sudoku')}>
          <SudokuIcon />
          <span>Sudoku Solver</span>
        </button>
        <button type="button" className="game-card" onClick={() => onNavigate('tictactoe')}>
          <TicTacToeIcon />
          <span>Tic-Tac-Toe</span>
        </button>
      </div>

      <div className="rules">
        <div className="rules-tabs" role="tablist" aria-label="Game rules">
          {(Object.keys(RULES) as GameKey[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              className={activeTab === key ? 'rules-tab active' : 'rules-tab'}
              onClick={() => setActiveTab(key)}
            >
              {RULES[key].title}
            </button>
          ))}
        </div>
        <div className="rules-panel" role="tabpanel">
          <h2>{rules.title} rules</h2>
          {rules.text.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Home
