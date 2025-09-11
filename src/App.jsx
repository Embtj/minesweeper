import './App.css'
import Grid from './Grid'

function App() {
  return (
    <div>
      <div className="bg-green-400 text-center">
        <h1 className="text-green-800 text-xl font-bold p-4">Minesweeper</h1>
      </div>
      <div className="bg-green-200 min-h-screen flex items-center justify-center">
        < Grid />
      </div>
    </div>

  )
}

export default App
