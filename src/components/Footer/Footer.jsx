// src/components/Footer.jsx

function Footer() {
  return (
    <footer style={{ padding: '10px', background: '#f1f1f1', textAlign: 'center', marginTop: '20px' }}>
      <p>&copy; {new Date().getFullYear()} Tutti i diritti riservati Lanzolla è gay.</p>
      <nav>
        <a href="#home" style={{ color: 'black', marginRight: '15px' }}>Home</a>
        <a href="#about" style={{ color: 'black', marginRight: '15px' }}>Chi Siamo</a>
        <a href="#contact" style={{ color: 'black' }}>Contatti</a>
      </nav>
    </footer>
  );
}

export default Footer;