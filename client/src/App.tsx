import React, { useState } from 'react'
import { connect, sendMsg } from './api'
import './App.css'

import CBoard from './components/CBoard/CBoard'

const App = ()  => {
  return (
    <div className="App">
      <CBoard></CBoard>
    </div>
  )
}

export default App
