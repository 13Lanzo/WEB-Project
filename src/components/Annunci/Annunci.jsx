import './Annunci.css'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom';

export default function Annunci () {
    const navigate=useNavigate();
    //SOLO PROVA DA ELIMINARE
    const [isProprietario, setIsProprietario]=useState(true);
    const mockAnnunci = [
        {
            id: 1,
            city: 'Pavia',
            zone: 'Centro storico, 12',
            title: 'Luminosa stanza nel centro di Pavia',
            price: 420,
            space: 18,
            availability: 'Immediata',
            image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 2,
            city: 'Milano',
            zone: 'Zona Bicocca',
            title: 'Stanza per studenti Milano Bicocca',
            price: 700,
            space: 60,
            availability: 'Settembre',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'
        }
    ];
    const displayedAnnunci =isProprietario ? mockAnnunci : [mockAnnunci[0]];

    return(
        <div className='annunci-page font-sans'>
            <div className='test-cotrols'>
                <button onClick={()=> setIsProprietario(!isProprietario)}>Cambia {isProprietario ? 'Proprietario' : 'Inquilino'}</button>
            </div>
            <div className='annunci-container'>
                <div className='header-text-block'>
                    <span className='area-badge'>✨ AREA {isProprietario ? 'PROPRIETARIO' : 'INQUILINO'}</span>
                    <h1>{isProprietario ? 'I Mie Annunci' : 'La Mia Stanza'}</h1>
                    <p>{isProprietario ? 'Visualizza, modifica, crea e gestisci in tempo reale le stanze del tuo appartamento.' : 'Visualizza i dettagli della stanza che hai affittato o prenotato.'}</p>
                </div>
                {isProprietario && (
                    <button className='btn-nuovo-annuncio' onClick={()=>navigate('/new')}>+ NUOVO ANNUNCIO</button>
                )}
            </div>

            <div className='annunci-grid'>
                {displayedAnnunci.map((annuncio)=>(
                    <div className='annuncio-card' kay={annuncio.id}>
                        <div className='card-image-wrapper'>
                            <span className='city-badge'>📍 {annuncio.city}</span>
                            <img src={annuncio.image} alt={annuncio.title}/>
                        </div>

                        <div className='card-content'>
                            <p className='zone-text'>{annuncio.zone}</p>
                            <h3 className='card-title'>{annuncio.title}</h3>
                            <div className='card-specs-row'>
                                <div className='spec-col'>
                                    <span className='spec-label'>PREZZO</span>
                                    <span className='spec-value'>{annuncio.price} €/mese</span>
                                </div>
                                <div className='spec-col'>
                                    <span className='spec-label'>SPAZIO</span>
                                    <span className='spec-value'>{annuncio.space} mq</span>
                                </div>
                                <div className='spec-col'>
                                    <span className='spec-label'>DISPONIBILITA'</span>
                                    <span className='spec-value'>{annuncio.availability}</span>
                                </div>
                            </div>
                        </div>
                        <div className='card-footer'>
                            <button className='btn-dettaglio' onClick={()=> navigate('/dettagli')}>Visualizza dettaglio</button>
                            {isProprietario && (
                                <button className="btn-delete" aria-label="Elimina annuncio">
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}