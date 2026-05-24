// src/App.jsx
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';

function App() {
  return (
    <div>
      
      <Header />

      
      <main style={{ padding: '20px', minHeight: '60vh' }}>
        <h2>LA TUA NUOVA CASA</h2>
        <p>Tinder non per scopare è la tua prima piattaforma di co-living con focus sulla compatibilità. Cerca stanze, filtra per interessi e chatta in tempo reale.</p>
      </main>


      <Footer />
    </div>
  );
}

export default App;