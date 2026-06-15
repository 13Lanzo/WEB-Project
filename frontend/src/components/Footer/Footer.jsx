// src/components/Footer.jsx
import './Footer.css'

const Footer= () => {
  const currentYear =new Date().getFullYear();

  return (
    <footer className='siteFooter'>
      <div className='footerContainer'>
        <div className='footerBrand'>
          <h2 className='Title'>Room4U</h2>
          <p className='brandText'>
            L'innovativa piattaforma per trovare la tua stanza ideale in base ai tuoi interessi!
          </p>
        </div>

        <div className='footerLinksGroup'>
          <div className='footerColumn'>
            <h3>Platform</h3>
            <ul>
              <li><a href='#about'>Su di noi</a></li>
              <li><a href='#sicurezza'>Linee Guida</a></li>
            </ul>
          </div>
          <div className='footerColumn'>
            <h3>Legal</h3>
            <ul>
              <li><a href='#privacy'>Privacy Policy</a></li>
              <li><a href='#terms'>Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className='footerCopyright'>
          <p>&copy; {currentYear} Piattaform Room4U. Migliora la ricerca della stanza perfetta.</p>
        </div>
      </div>
    </footer>
    
  )}

export default Footer;