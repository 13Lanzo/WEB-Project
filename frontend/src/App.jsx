// src/App.jsx
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Profilo from './components/Profilo/Profilo';
import Chat from './components/Chat/Chat';
import Ricerca from './components/Ricerca/Ricerca';
import Login from './components/Login/Login';
import Dettagli from './components/Dettagli/Dettagli';
import Annunci from './components/Annunci/Annunci';
import New from './components/New/New';
import { useState, useEffect } from 'react';
import socket from './socket';
//rendering per lo stato loggato o meno
//ICONE: LUCIDE
function App() {
  const [isLoggedIn, setIsLoggedIn]= useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      socket.auth = { token };
      socket.connect();
    }
  }, []);
  
  const handleLogout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    socket.disconnect();
  };
  const handleLogin=()=>{
    setIsLoggedIn(true);
    const token = localStorage.getItem('token');
    if (token) {
      socket.auth = { token };
      socket.connect();
    }
  };

  return (
    <div>
      
      <Router>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} onLogin={handleLogin}/>
        <Routes>
          <Route path='/' element={<Home />}/>

          <Route path='/ricerca' element={<Ricerca />}/>
          <Route path='/profilo' element={<Profilo onLogout={handleLogout} />}/>
          <Route path='/dettagli' element={<Dettagli onLoginSuccess={handleLogin} />}/>
          <Route path='/chat' element={<Chat />}/>
          <Route path='/annunci' element={<Annunci onLoginSuccess={handleLogin}/>}/>
          <Route path='/new' element={<New onLoginSuccess={handleLogin}/>}/>
          <Route path='/login' element={<Login onLoginSuccess={handleLogin}/>}/>
        </Routes>
      </Router>
      <Footer />
    </div>  
  );
}

export default App;