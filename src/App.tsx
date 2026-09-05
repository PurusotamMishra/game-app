import { useState } from 'react'
import Home from './pages/Home'
import SudokuPage from './pages/SudokuPage'
import TicTacToePage from './pages/TicTacToePage'
import './App.css'

export type Page = 'home' | 'sudoku' | 'tictactoe'

function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'sudoku') {
    return <SudokuPage onNavigate={setPage} />
  }
  if (page === 'tictactoe') {
    return <TicTacToePage onNavigate={setPage} />
  }
  return <Home onNavigate={setPage} />
}

export default App
