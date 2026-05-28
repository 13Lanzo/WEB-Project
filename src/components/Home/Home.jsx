import './Home.css'
import image from './image.png'
import {useNavigate} from 'react-router-dom'

export default function Home() {

    const navigate=useNavigate();

    return (
        
        <div className='homePage'>

            <section className='heroSection'>
                <div className='homeContent'>
                    <h1 className='homeTitle'>
                        Trova la tua stanza, incontra i tuoi futuri coinquilini
                    </h1>
                    <p className='homedescription'>
                        Tinder è la piattaforma definitiva per aiutarti a trovare la tua stanza dei sogni. 
                        Semplifica la ricerca di alloggi e la selezione dei coinquilini ideali grazie alnostro algoritmo di compatibilità.
                    </p>

                    <div className='homeButtons'>
                        <button className='btnOne' onClick={()=> navigate('ricerca')}>
                            <span className='icon'>🔍</span>
                            Inizia la ricerca
                        </button>
                        <button className='btnTwo' onClick={()=> navigate('chat')}>
                            <span className='icon'>🏠</span>
                            Pubblica annuncio
                        </button>
                    </div>
                </div>
            </section>
            <section className='cardsSection'>
                <div className='pagecontanier'>
                    <div className='gridcontainer'>
                        {/*Prima card */}
                        <div className='card cardfindroom gridcolspan2'>
                            <div className='textside'>
                                <div className='iconwrapper findroomicon'>🏢</div>
                                <h3>Find Room</h3>
                                <p>Sfoglia migliaia di annunci certificati. Filtra per prezzo, servizi e distanza desiderata.</p>
                            </div>
                            <div className='mockupwrapper'>
                                <img src={image}  className="mockupimg" />
                            </div>
                        </div>

                        {/*Seconda card*/}
                        <div className='card'>
                            <div>
                                <div className='iconwrapper matchicon'>🧩</div>
                                <h3>Trova i tuoi coinquilini ideali</h3>
                                <p>Il nostro algoritmo ti suggerisce inquilini con abitudini di studio e interessi simili.</p>
                            </div>
                            <div className='avatargroup'>
                                <div className='avatar a'></div>
                                <div className='avatar b'></div>
                                <div className='avatar c'></div>
                                <div className='avatar avatarmore'>+12</div>
                            </div>
                        </div>
                    </div>

                    {/*Terza carda*/}
                    <div className='card cardchat'>
                        <div>
                            <div className='iconwrapper chaticon'>💬</div>
                            <h3>Messaggia e Trasferisciti</h3>
                            <p>Cominica in sicurezza attraverso la nostra chat integrata e organizza il tuo trasloco senza stress.</p>
                        </div>
                    </div>

                    {/*Quarta carta*/}
                    <div className='card cardcompatibility gridcolspan2'>
                        <div className='textside'>
                            <h3>Penteggio di compatibilità</h3>
                            <p>Solo su Tinder: vedi quanto sei compatibile con i tuoi potenziali inquilini prima di contattarli.</p>
                        </div>
                        <div className='scorecircle'>94%</div>
                    </div>
                </div>
        </section>
    </div>    
    )
}
