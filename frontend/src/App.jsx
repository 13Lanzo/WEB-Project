// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { useState } from 'react';

function App() {
  // Stato globale utente — inizializzato dal localStorage per sopravvivere al refresh
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isLoggedIn = !!currentUser;

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <div>
      <Router>
        <Header
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLogin={handleLogin}
        />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/ricerca' element={<Ricerca />} />
          <Route path='/profilo' element={<Profilo currentUser={currentUser} onLogout={handleLogout} />} />
          {/* /dettagli/:id per navigare a una stanza specifica */}
          <Route path='/dettagli/:id' element={<Dettagli isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
          {/* Compatibilità con link vecchi senza id */}
          <Route path='/dettagli' element={<Dettagli isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
          <Route path='/chat' element={<Chat currentUser={currentUser} />} />
          <Route path='/annunci' element={<Annunci currentUser={currentUser} onLogin={handleLogin} />} />
          <Route path='/new' element={<New currentUser={currentUser} />} />
          <Route path='/login' element={<Login onLoginSuccess={handleLogin} />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;