import { useState } from 'react'
import type { Page } from '../App'
import type { Board } from '../games/tictactoe/ai'
import { nextStepEasy, nextStepMedium, nextStepHard } from '../games/tictactoe/ai'
import type { GameResult, WinningLine } from '../games/tictactoe/rules'
import { getResult, getWinningLine } from '../games/tictactoe/rules'
import type { Mode, Player } from '../games/tictactoe/labels'
import { getScoreLabels, getStatusText } from '../games/tictactoe/labels'
import './TicTacToePage.css'

interface TicTacToePageProps {
  onNavigate: (page: Page) => void
}

type Difficulty = 'easy' | 'medium' | 'hard'

const EMPTY_BOARD: Board = Array(9).fill(null)
const EMPTY_SCORES = { x: 0, draws: 0, o: 0 }

const NEXT_STEP: Record<Difficulty, typeof nextStepEasy> = {
  easy: nextStepEasy,
  medium: nextStepMedium,
  hard: nextStepHard,
}

// Strike-line geometry, in the same units as the rendered grid: three cells
// plus the two gaps between them. The overlay scales with the grid, so these
// numbers stay correct at every breakpoint.
const CELL = 90
const GAP = 4
const GRID_SPAN = CELL * 3 + GAP * 2
const OVERHANG = 0.12

function cellCenter(index: number) {
  return {
    x: (index % 3) * (CELL + GAP) + CELL / 2,
    y: Math.floor(index / 3) * (CELL + GAP) + CELL / 2,
  }
}

function strikeCoords(line: WinningLine) {
  const start = cellCenter(line[0])
  const end = cellCenter(line[2])
  const dx = end.x - start.x
  const dy = end.y - start.y

  return {
    x1: start.x - dx * OVERHANG,
    y1: start.y - dy * OVERHANG,
    x2: end.x + dx * OVERHANG,
    y2: end.y + dy * OVERHANG,
  }
}

function TicTacToePage({ onNavigate }: TicTacToePageProps) {
  const [mode, setMode] = useState<Mode>('bot')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [board, setBoard] = useState<Board>(EMPTY_BOARD)
  const [result, setResult] = useState<GameResult>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [scores, setScores] = useState(EMPTY_SCORES)

  function applyResult(outcome: NonNullable<GameResult>) {
    setResult(outcome)
    setScores((prev) => {
      if (outcome === 'draw') return { ...prev, draws: prev.draws + 1 }
      if (outcome === 'X') return { ...prev, x: prev.x + 1 }
      return { ...prev, o: prev.o + 1 }
    })
  }

  function handleCellClick(index: number) {
    if (result || board[index]) return

    const afterMove = [...board]
    afterMove[index] = currentPlayer

    const moveResult = getResult(afterMove)
    if (moveResult) {
      setBoard(afterMove)
      applyResult(moveResult)
      return
    }

    // Two humans share the board, so the turn simply passes to the other mark.
    if (mode === 'two-player') {
      setBoard(afterMove)
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
      return
    }

    const emptyIndices = afterMove.reduce<number[]>((acc, cell, cellIndex) => {
      if (cell === null) acc.push(cellIndex)
      return acc
    }, [])

    const botIndex = NEXT_STEP[difficulty](afterMove, emptyIndices)
    const afterBot = [...afterMove]
    afterBot[botIndex] = 'O'

    setBoard(afterBot)

    const botResult = getResult(afterBot)
    if (botResult) applyResult(botResult)
  }

  function handleReset() {
    setBoard(EMPTY_BOARD)
    setResult(null)
    setCurrentPlayer('X')
  }

  // A half-played game can't carry across modes, and vs-bot wins shouldn't be
  // tallied together with vs-human ones, so switching starts from scratch.
  function handleModeChange(nextMode: Mode) {
    if (nextMode === mode) return
    setMode(nextMode)
    setBoard(EMPTY_BOARD)
    setResult(null)
    setCurrentPlayer('X')
    setScores(EMPTY_SCORES)
  }

  const winningLine = getWinningLine(board)
  const statusText = getStatusText(mode, result, currentPlayer)
  const scoreLabels = getScoreLabels(mode)

  return (
    <section className="page tictactoe-page">
      <button type="button" className="back-link" onClick={() => onNavigate('home')}>
        ← Back to games
      </button>

      <h1>Tic-Tac-Toe</h1>

      <div className="controls-row">
        <div className="mode-toggle" role="group" aria-label="Game mode">
          <button
            type="button"
            className={mode === 'bot' ? 'mode-option active' : 'mode-option'}
            aria-pressed={mode === 'bot'}
            onClick={() => handleModeChange('bot')}
          >
            1 Player
          </button>
          <button
            type="button"
            className={mode === 'two-player' ? 'mode-option active' : 'mode-option'}
            aria-pressed={mode === 'two-player'}
            onClick={() => handleModeChange('two-player')}
          >
            2 Players
          </button>
        </div>

        {mode === 'bot' && (
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
        )}

        <div className="scoreboard">
          <div className="score-box">
            <span className="score-label">{scoreLabels.x}</span>
            <span className="score-value">{scores.x}</span>
          </div>
          <div className="score-box">
            <span className="score-label">Draws</span>
            <span className="score-value">{scores.draws}</span>
          </div>
          <div className="score-box">
            <span className="score-label">{scoreLabels.o}</span>
            <span className="score-value">{scores.o}</span>
          </div>
        </div>
      </div>

      <p className="turn-indicator">{statusText}</p>

      <div className="tictactoe-grid">
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            className="tictactoe-cell"
            aria-label={`Cell ${index + 1}`}
            disabled={Boolean(cell) || Boolean(result)}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </button>
        ))}

        {winningLine && (
          <svg
            className="win-line"
            viewBox={`0 0 ${GRID_SPAN} ${GRID_SPAN}`}
            aria-hidden="true"
          >
            <line {...strikeCoords(winningLine)} pathLength={1} />
          </svg>
        )}
      </div>

      <div className="tictactoe-controls">
        <button type="button" className="btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </section>
  )
}

export default TicTacToePage
