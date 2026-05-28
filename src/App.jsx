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
import { useState } from 'react';
//rendering per lo stato loggato o meno

function App() {
  const [isLoggedIn, setIsLoggedIn]= useState(false);
  
  const handleLogout=()=>{
    setIsLoggedIn(false);
  };
  const handleLogin=()=>{
    setIsLoggedIn(true);
  };

  return (
    <div>
      
      <Router>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} onLogin={handleLogin}/>
        <Routes>
          <Route path='/' element={<Home />}/>

          <Route path='/ricerca' element={<Ricerca />}/>
          <Route path='/profilo' element={<Profilo />}/>
          <Route path='/dettagli' element={<Dettagli />}/>
          <Route path='/chat' element={<Chat />}/>
          <Route path='/login' element={<Login />}/>
        </Routes>
      </Router>
      <Footer />
    </div>  
  );
}

export default App;