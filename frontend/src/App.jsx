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

  //stato per tenere traccia dell'utente loggato, inizialmente null (non loggato)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved && saved !== 'undefined') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Errore nel parsing dell'utente da localStorage:", e);
        return null;
      }
    }
    return null;
  });

  //determina se l'utente è loggato o no in base alla presenza di currentUser
  const isLoggedIn = !!currentUser;

  //funzione per gestire il logout: pulisce localStorage e aggiorna stato
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  //funzione che viene passata a Login.jsx per aggiornare lo stato di autenticazione dopo un login riuscito
  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
  };

  return (
    <div>

      <Router>
        <Header isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} onLogin={handleLoginSuccess} />
        <Routes>
          <Route path='/' element={<Home isLoggedIn={isLoggedIn} />} />

          <Route path='/ricerca' element={<Ricerca />} />
          <Route path='/profilo' element={<Profilo currentUser={currentUser} onLogout={handleLogout} />} />
          <Route path='/dettagli/:id' element={<Dettagli isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
          <Route path='/chat' element={<Chat currentUser={currentUser} />} />
          <Route path='/area-riservata' element={<Annunci currentUser={currentUser} />} />
          <Route path='/new' element={<New currentUser={currentUser} />} />
          <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;