/* MODIFICHE:
Logica differenziata in base al ruolo:
    Se proprietario:
    Titolo: "Area Riservata — I Miei Annunci"
Fetch GET /api/rooms/mine → mostrare solo le proprie stanze
Bottone "NUOVO ANNUNCIO" → /new
Se non ha annunci → mostrare messaggio vuoto con bottone "Crea il tuo primo annuncio"
Pulsante elimina → DELETE /api/rooms/:id
Se inquilino:
    Titolo: "Area Riservata — La Mia Stanza"
Fetch GET /api/rooms + filtrare se l'utente è in inquiliniAssegnati
Se ha una stanza assegnata → mostrare i dettagli della stanza
Se non ha stanza → messaggio "Non hai ancora una stanza assegnata" + bottone "Cerca Camere" → /ricerca
Rimuovere:
    Switch fittizio setIsProprietario(!isProprietario)
Dati mock mockAnnunci
*/

import './Annunci.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sparkles, CirclePlus, MapPinHouse, Trash, Home } from 'lucide-react';

export default function Annunci() {
    const navigate = useNavigate();
    const [annunci, setAnnunci] = useState([]);
    const [loading, setLoading] = useState(true);

    // recuperiamo i dati dall'utente loggato dal LocalStorage
    let user = null;
    // gestione dell'errore nel recupero dell'utente, per evitare di passare un oggetto undefined nel parsing dell'utente
    try {
        const savedUser = localStorage.getItem('user');
        user = savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
    } catch (e) {
        console.error("Errore nel parsing dell'utente:", e);
    }
    const ruolo = user?.ruolo; // proprietario o inquilino
    const userId = user?.id || user?._id;
    const token = localStorage.getItem('token');

    // divisione logica tra proprietario e inquilino
    // PROPRIETARIO:
    const isProprietario = ruolo === 'proprietario';

    useEffect(() => {
        const fetchAnnunci = async () => {
            try {
                setLoading(true);
                const headers = {
                    'Authorization': `Bearer ${token}`, // nel caso prevedere anche refresh token
                    'Content_type': 'application/json'
                };

                if (isProprietario) {
                    // Chiamata per recuperare solo le stanze dal proprietario loggato
                    const res = await fetch('/api/rooms/mine', { headers });
                    const data = await res.json();
                    if (data.success || Array.isArray(data)) {
                        setAnnunci(data.dati || data);
                    }
                } else {
                    // Chiamata per tutte le stanze filtrando poi lato client quelle assegnate al conquilino
                    const res = await fetch('/api/rooms', { headers });
                    const data = await res.json();
                    const tutteLeStanze = data.dati || data;

                    if (Array.isArray(tutteLeStanze)) {
                        // Filtriamo se l'ID dell'utente corrente è incluso nell'array inquiliniAssegnati
                        const stanzaAssegnata = tutteLeStanze.filter(stanza =>
                            stanza.inquiliniAssegnati?.includes(userId)
                        );
                        setAnnunci(stanzaAssegnata);
                    }
                }
            } catch (error) {
                console.error("Errore nel caricamento dell'area riservata:", error);
            } finally {
                setLoading(false);
            }
        };

        // logica della gestione della scandenza del token
        if (token) {
            fetchAnnunci();
        } else {
            setLoading(false);
            navigate('/login'); // se manca il token, reindirizza al login per sicurezza
        }
    }, [isProprietario, token, userId, navigate]);

    // Gestione eliminazione annuncio (solo per il PROPRIETARIO)
    const handleDelete = async (id) => {
        if (!window.confirm("Sei sicuro di voler eliminare permanentemente questo annuncio?")) return;

        try {
            const res = await fetch(`/api/rooms/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                // Aggiorna lo stato locale rimuovendo l'annuncio elimato
                setAnnunci(annunci.filter(annuncio => (annuncio._id || annuncio.id) !== id))
            } else {
                alert("Impossibile eliminare l'annuncio: " + data.messaggio);
            }
        } catch (error) {
            console.error("Errore durante l'eliminazione:", error);
        }
    };

    if (loading) {
        return <div className="loading-container"><p>Caricamento Area riservata...</p></div>;
    }


    return (
        <div className='annunci-page font-sans'>
            <div className='annunci-container'>
                <div className='header-text-block'>
                    <span className='area-badge'>
                        <Sparkles /> AREA {isProprietario ? 'PROPRIETARIO' : 'INQUILINO'}
                    </span>
                    <h1>{isProprietario ? 'Area Riservata - I miei Annunci' : 'Area Riservata - La mia Stanza'}</h1>
                    <p>
                        {isProprietario
                            ? 'Visualizza, crea e gestisci in tempo reale le stanze dei tuoi appartamenti.'
                            : 'Visualizza i dettagli della stanza che hai affittato o prenotato.'}
                    </p>
                </div>
                {isProprietario && annunci.length > 0 && (
                    <button className='btn-nuovo-annuncio' onClick={() => navigate('/new')}>
                        <CirclePlus size={15} /> NUOVO ANNUNCIO
                    </button>
                )}
            </div>

            {/* SCHERMATA VUOTA - CASO PROPRIETARIO (Nessun annuncio creato) */}
            {isProprietario && annunci.length === 0 && (
                <div className="empty-state-box">
                    <Home size={48} className="empty-icon" />
                    <h2>Non hai ancora pubblicato nessun annuncio</h2>
                    <p>Crea ora il tuo primo annuncio per permettere a nuovi inquilini di trovare casa!</p>
                    <button className="btn-nuovo-annuncio-empty" onClick={() => navigate('/new')}>
                        <CirclePlus size={15} /> Crea il tuo primo annuncio
                    </button>
                </div>
            )}

            {/* SCHERMATA VUOTA - CASO INQUILINO (Nessuna stanza assegnata)*/}
            {!isProprietario && annunci.length === 0 && (
                <div className="empty-state-box">
                    <Home size={48} className="empty-icon" />
                    <h2>Non hai ancora una stanza assegnata</h2>
                    <p>Esplora la bacheca di Room4U per trovare l'alloggio perfetto per le tue esigenze!</p>
                    <button className="btn-cerca-camere" onClick={() => navigate('/ricerca')}>
                        Cerca Camere
                    </button>
                </div>
            )}


            {/* GRIGLIA DEGLI ANNUNCI (se presenti) */}
            {annunci.length > 0 && (
                <div className='annunci-grid'>
                    {annunci.map((annuncio) => {
                        const currentId = annuncio._id || annuncio.id // Supporto sia per id MongoDB che per fallback
                        return (
                            <div className='annuncio-card' key={annuncio.id}>
                                <div className='card-image-wrapper'>
                                    <span className='city-badge'>
                                        <MapPinHouse /> {annuncio.city || annuncio.citta}
                                    </span>
                                    <img src={annuncio.image || annuncio.immagine} alt={annuncio.title || annuncio.titolo} />
                                </div>

                                <div className='card-content'>
                                    <p className='zone-text'>{annuncio.zone || annuncio.indirizzo}</p>
                                    <h3 className='card-title'>{annuncio.title || annuncio.titolo}</h3>
                                    <div className='card-specs-row'>
                                        <div className='spec-col'>
                                            <span className='spec-label'>PREZZO</span>
                                            <span className='spec-value'>{annuncio.price || annuncio.prezzo} €/mese</span>
                                        </div>
                                        <div className='spec-col'>
                                            <span className='spec-label'>SPAZIO</span>
                                            <span className='spec-value'>{annuncio.space || annuncio.superficie} mq</span>
                                        </div>
                                        <div className='spec-col'>
                                            <span className='spec-label'>DISPONIBILITA'</span>
                                            <span
                                                className='spec-value'>{annuncio.availability || annuncio.disponibilita}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='card-footer'>
                                    <button className='btn-dettaglio'
                                        onClick={() => navigate('/dettagli/' + currentId)}>
                                        Visualizza dettaglio
                                    </button>
                                    {isProprietario && (
                                        <button
                                            className="btn-delete"
                                            aria-label="Elimina annuncio"
                                            onClick={() => handleDelete(currentId)}
                                        >
                                            <Trash />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}