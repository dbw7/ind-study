import React, { useContext, useState } from 'react'
import { connect, sendMsg } from './api'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';

import CBoard from './components/CBoard/CBoard'
import AuthContext from './context/auth-context'
import Homepage from './pages/Homepage/Homepage';

const App: React.FC = ()  => {
  
  const authCtx = useContext(AuthContext);
  
  return (
    <div className="App">
      <Routes>
          <Route path='/' element={<Homepage />} />
      </Routes>
    </div>
  )
}

export default App
