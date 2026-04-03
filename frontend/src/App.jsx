import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userId, setUserId] = useState(localStorage.getItem('userId'))
  const [userName, setUserName] = useState(localStorage.getItem('userName'))

  const handleLogin = (token, userId, userName) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('userName', userName)
    setToken(token)
    setUserId(userId)
    setUserName(userName)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    setToken(null)
    setUserId(null)
    setUserName(null)
  }

  return (
    <BrowserRouter>
      <Navbar token={token} onLogout={handleLogout} userName={userName} />
      <Routes>
        <Route path="/" element={<Home token={token} />} />
        <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
