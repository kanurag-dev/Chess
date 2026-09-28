import { useState } from 'react'
import Board from './Board'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>Chess</h1>
    <div className='home-board'>
    <Board/>
    </div>
    </>
  )
}

export default App
