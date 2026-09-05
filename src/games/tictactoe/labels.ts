import type { GameResult } from './rules'

export type Mode = 'bot' | 'two-player'
export type Player = 'X' | 'O'

export function getStatusText(
  mode: Mode,
  result: GameResult,
  currentPlayer: Player,
): string {
  if (result === 'draw') return "It's a draw!"

  if (mode === 'bot') {
    if (result === 'X') return 'You win!'
    if (result === 'O') return 'Bot wins!'
    return 'Your turn (X)'
  }

  if (result === 'X') return 'Player 1 wins!'
  if (result === 'O') return 'Player 2 wins!'
  return currentPlayer === 'X' ? "Player 1's turn (X)" : "Player 2's turn (O)"
}

export function getScoreLabels(mode: Mode): { x: string; o: string } {
  return mode === 'bot'
    ? { x: 'You (X)', o: 'Bot (O)' }
    : { x: 'Player 1 (X)', o: 'Player 2 (O)' }
}
