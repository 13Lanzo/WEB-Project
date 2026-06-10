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
import { useState } from 'react';

function App() {
  //utente inizialmente null (non loggato)
  const [currentUser, setCurrentUser]=useState(null)
  
  const isLoggedIn=!!currentUser;

  //funzione per gestire il logout: pulisce localStorage e aggiorna stato
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  //funzione che viene passata a Login.jsx per aggiornare lo stato di autenticazione dopo un login riuscito
  const handleLoginSuccess = (userObj) => {
    console.log("Ricevuto utente in App:", userObj);
    setCurrentUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
  };
  
  return (
    <div>
      
      <Router>
        <Header isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} onLogin={handleLoginSuccess}/>
        <Routes>
          <Route path='/' element={<Home isLoggedIn={isLoggedIn}/>}/>

          <Route path='/ricerca' element={<Ricerca />}/>
          <Route path='/profilo' element={isLoggedIn ? <Profilo currentUser={currentUser} onLogout={handleLogout} />: <Login onLoginSuccess={handleLoginSuccess}/>}/>
          <Route path='/dettagli/:id' element={<Dettagli isLoggedIn={isLoggedIn} currentUser={currentUser}/>}/>
          <Route path='/chat' element={isLoggedIn? <Chat currentUser={currentUser} />: <Login onLoginSuccess={handleLoginSuccess}/>}/>
          <Route path='/area-riservata' element={isLoggedIn ? <Annunci currentUser={currentUser}/>: <Login onLoginSuccess={handleLoginSuccess}/>}/>
          <Route path='/new' element={isLoggedIn ? <New currentUser={currentUser}/> : <Login onLoginSuccess={handleLoginSuccess}/>}/>
          <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess}/>}/>
        </Routes>
        <Footer />
      </Router>
    </div>  
  );
}

export default App;