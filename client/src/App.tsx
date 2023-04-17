import React, { useContext } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/auth-context'
import Homepage from './pages/Homepage/Homepage';
import Login from './pages/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Game from './pages/Game/Game';
import CreateGame from './pages/CreateGame/CreateGame';
import About from './pages/About/About';
import Leaderboard from './pages/LeaderBoard/Leaderboard';
// @ts-ignore
import Profile from './pages/Profile/Profile';

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
          <Route path='/about' element={<About />}/>
          {/* //Looks like a really complex statement but the idea is, if you're not logged in, redirect to login, if you're logged in but not part of villanova, redirect to homepage */}
          {authCtx.isLoggedIn ? 
          (authCtx.userData.email.endsWith("@villanova.edu") ? <Route path='/leaderboard' element={<Leaderboard />}/> : <Route path='/leaderboard' element={<Navigate to="/" replace />} />) 
          : 
          <Route path='/leaderboard' element={<Navigate to="/login" replace />} />}
          {authCtx.isLoggedIn ? <Route path='/profile' element={<Profile />}/> : <Route path='/profile' element={<Navigate to="/login" replace />} />}
          {authCtx.isLoggedIn ? <Route path='/create-game' element={<CreateGame />} /> : <Route path='/create-game' element={<Navigate to="/login" replace />} />}
          {authCtx.isLoggedIn ? <Route path='/game' element={<Game />}/> : <Route path='/game' element={<Navigate to="/login" replace />} />}
      </Routes>
    </div>
  )
}

export default App
