// src/App.jsx
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Profilo from './components/Profilo/Profilo';
import Chat from './components/Chat/Chat';
import Ricerca from './components/Ricerca/Ricerca';
import Login from './components/Login/Login';

function App() {
  return (
    <div>
      <Header />
      <Router>
        <Routes>
          <Route path='/' element={<Home />}/>

          <Route path='/ricerca' element={<Ricerca />}/>
          <Route path='/profilo' element={<Profilo />}/>
          <Route path='/chat' element={<Chat />}/>
          <Route path='/login' element={<Login />}/>
        </Routes>
      </Router>
      <Footer />
    </div>  
  );
}

export default App;