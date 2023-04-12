import React, { useContext } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/auth-context'
import Homepage from './pages/Homepage/Homepage';
import Login from './pages/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Game from './pages/Game/Game';
import CreateGame from './pages/CreateGame/CreateGame';

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
          {authCtx.isLoggedIn ? <Route path='/create-game' element={<CreateGame />}/> : <Route path='/create-game' element={<Navigate to="/login" replace />} />}
          {authCtx.isLoggedIn ? <Route path='/game' element={<Game />}/> : <Route path='/game' element={<Navigate to="/login" replace />} />}
      </Routes>
    </div>
  )
}

export default App
