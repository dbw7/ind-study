import React, { useState } from 'react'
import { connect, sendMsg } from './api'
import './App.css'
import Board from './components/Board/Board'

const App = ()  => {
  return (
    <div className="App">
      <Board></Board>
    </div>
  )
}

export default App
