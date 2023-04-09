import React, { useContext, useState } from 'react'
import { connect, sendMsg } from './api'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';

import CBoard from './components/CBoard/CBoard'
import AuthContext from './context/auth-context'
import Homepage from './pages/Homepage/Homepage';
import Login from './pages/Login/Login';
import Navbar from './components/Navbar/Navbar';

const App: React.FC = ()  => {
  
  const authCtx = useContext(AuthContext);
  
  return (
    <div className="App">
      <header>
        <Navbar />
      </header>
      <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/login' element={<Login />}/>
      </Routes>
    </div>
  )
}

export default App
