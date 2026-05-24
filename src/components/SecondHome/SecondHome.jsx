import './SecondHome.css'

const Second = () => {
    return(
            <section className='section'>
                <div className='title'>
                    <h2 className='subtitle'>Come funziona Tinder</h2>
                    <p className='subbtitle'>La tua nuova vita inizia con tre semplici passaggi.</p>
                </div>

                <div className='grid'>
                    <div className='cardLarge'>
                        <div className='cardText'>
                            <div className='iconGreen'>🏢</div>
                            <h3>Trova stanze</h3>
                            <p>Sfoglia migliaia di annunci certificati nella zona che preferisci. Filtre per prezzo, servizi e distanza.</p>
                    </div>
                        <div className='cardImageContainer'>
                            <img src='../image.png' alt='Anteprima stanze su tablet' className='tabletImage' />
                        </div>
                </div>

                    <div className='cardStandard'>
                        <div className='iconBlue'>🤝</div>
                            <h3>Scegli i tuoi coinquilini</h3>
                            <p>Il nostro algoritmo ti suggerisce coinquilini con abitudini e interessi simili a tuoi!</p>
                            <div className='avatarGroup'>
                                <div className='avatar' style={{backgroundColor: '#dbeafe'}}></div>
                                <div className='avatar' style={{backgroundColor: '#bbf7d0'}}></div>
                                <div className='avatar' style={{backgroundColor: '#e0e7ff'}}></div>
                                <div className='avatarCount'>+12</div>
                            </div>

                        <div className='cardDark'>
                            <div className='iconDarkBg'>💬</div>
                                <h3 className='whiteText'>Chatta e Trasferisciti</h3>
                                <p className='lightText'>Comunica in sicurezza attraverso la nostra chat integrata e organizza il tuo trasloco senza stress.</p>
                        </div>  

                        <div className='cardDotted'>
                            <div className='cardDottedText'>
                                <h3>Punteggi compatibili</h3>
                                <p>Solo su Tinder: vedi quanto sei compatibile con i tuoi potenziali coinquilini prima di contattarli.</p>
                            </div>
                            <div className='scoreCircle'>
                                <span>94%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
);};
export default Second