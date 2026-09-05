import { useState } from 'react'
import type { Page } from '../App'
import './TicTacToePage.css'

interface TicTacToePageProps {
  onNavigate: (page: Page) => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

function TicTacToePage({ onNavigate }: TicTacToePageProps) {
  const cells = Array.from({ length: 9 })
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')

  return (
    <section className="page tictactoe-page">
      <button type="button" className="back-link" onClick={() => onNavigate('home')}>
        ← Back to games
      </button>

      <h1>Tic-Tac-Toe</h1>

      <div className="controls-row">
        <label className="difficulty-select">
          Difficulty
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as Difficulty)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <div className="scoreboard">
          <div className="score-box">
            <span className="score-label">You (X)</span>
            <span className="score-value">0</span>
          </div>
          <div className="score-box">
            <span className="score-label">Draws</span>
            <span className="score-value">0</span>
          </div>
          <div className="score-box">
            <span className="score-label">Bot (O)</span>
            <span className="score-value">0</span>
          </div>
        </div>
      </div>

      <p className="turn-indicator">Your turn (X)</p>

      <div className="tictactoe-grid">
        {cells.map((_, index) => (
          <button
            key={index}
            type="button"
            className="tictactoe-cell"
            aria-label={`Cell ${index + 1}`}
          />
        ))}
      </div>

      <div className="tictactoe-controls">
        <button type="button" className="btn">
          Reset
        </button>
      </div>
    </section>
  )
}

export default TicTacToePage
