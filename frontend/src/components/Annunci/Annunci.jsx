import './Annunci.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Sparkles, CirclePlus, MapPinHouse, Trash } from 'lucide-react';

export default function Annunci () {
    const navigate = useNavigate();
    
    // Recupera l'utente loggato
    const currentUserStr = localStorage.getItem('user');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    const isProprietario = currentUser && currentUser.ruolo === 'proprietario';

    const [annunci, setAnnunci] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyAnnouncements = () => {
        if (!currentUser) return;
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Chiamata all'API per recuperare gli annunci dell'host
        fetch(`http://10.31.99.48:5000/api/rooms/rooms?creatoDa=${currentUser.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.success) {
                setAnnunci(resData.dati);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Errore nel recupero degli annunci:", err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchMyAnnouncements();
    }, [currentUser?.id]);

    const handleDelete = (stanzaId) => {
        if (!window.confirm("Sei sicuro di voler eliminare questo annuncio?")) return;
        const token = localStorage.getItem('token');
        
        fetch(`http://10.31.99.48:5000/api/rooms/${currentUser.id}/rooms/${stanzaId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Annuncio eliminato con successo.");
                fetchMyAnnouncements();
            } else {
                alert(data.errore || "Impossibile eliminare l'annuncio.");
            }
        })
        .catch(err => console.error("Errore di rete durante la cancellazione:", err));
    };

    if (!currentUser) {
        return (
            <div className='annunci-page font-sans' style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Effettua l'accesso per visualizzare questa sezione.</h2>
                <button className='btn-dettaglio' onClick={() => navigate('/')} style={{ marginTop: '20px' }}>Torna alla Home</button>
            </div>
        );
    }

    if (!isProprietario) {
        return (
            <div className='annunci-page font-sans' style={{ textAlign: 'center', padding: '50px' }}>
                <span className='area-badge'><Sparkles /> AREA INQUILINO</span>
                <h1 style={{ color: '#1e3a8a', marginTop: '20px' }}>La Mia Stanza</h1>
                <p style={{ marginTop: '10px', color: '#6b7280' }}>Questa sezione è riservata ai proprietari. Gli studenti possono cercare alloggi nella sezione Ricerca.</p>
                <button className='btn-nuovo-annuncio' onClick={() => navigate('/ricerca')} style={{ marginTop: '20px' }}>Cerca Camere</button>
            </div>
        );
    }

    return (
        <div className='annunci-page font-sans'>
            <div className='annunci-container'>
                <div className='header-text-block'>
                    <span className='area-badge'><Sparkles /> AREA PROPRIETARIO</span>
                    <h1 style={{ color: '#1e3a8a' }}>I Miei Annunci</h1>
                    <p>Visualizza, crea e gestisci in tempo reale le stanze del tuo appartamento.</p>
                </div>
                <button className='btn-nuovo-annuncio' onClick={() => navigate('/new')}><CirclePlus size={15}/> NUOVO ANNUNCIO</button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Caricamento annunci in corso...</div>
            ) : annunci.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', marginTop: '30px' }}>
                    <h3 style={{ color: '#1e3a8a', marginBottom: '10px' }}>Non hai ancora pubblicato nessun annuncio</h3>
                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>Inizia ora per far incontrare le tue stanze con studenti o lavoratori ideali.</p>
                    <button className='btn-nuovo-annuncio' onClick={() => navigate('/new')} style={{ margin: '0 auto' }}><CirclePlus size={15}/> CREA IL TUO PRIMO ANNUNCIO</button>
                </div>
            ) : (
                <div className='annunci-grid'>
                    {annunci.map((annuncio) => (
                        <div className='annuncio-card' key={annuncio._id}>
                            <div className='card-image-wrapper'>
                                <span className='city-badge'> <MapPinHouse/> {annuncio.citta}</span>
                                <img src={annuncio.immagine || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"} alt={annuncio.titolo}/>
                            </div>

                            <div className='card-content'>
                                <p className='zone-text'>{annuncio.indirizzo}</p>
                                <h3 className='card-title'>{annuncio.titolo}</h3>
                                <div className='card-specs-row'>
                                    <div className='spec-col'>
                                        <span className='spec-label'>PREZZO</span>
                                        <span className='spec-value'>{annuncio.prezzo} €/mese</span>
                                    </div>
                                    <div className='spec-col'>
                                        <span className='spec-label'>STATO</span>
                                        <span className='spec-value'>{annuncio.disponibile ? 'Disponibile' : 'Occupata'}</span>
                                    </div>
                                    <div className='spec-col'>
                                        <span className='spec-label'>SERVIZI</span>
                                        <span className='spec-value' style={{ fontSize: '11px' }}>{annuncio.serviziInclusi && annuncio.serviziInclusi.length > 0 ? annuncio.serviziInclusi.slice(0, 2).join(', ') : 'Nessuno'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='card-footer'>
                                <button className='btn-dettaglio' onClick={() => navigate('/dettagli', { state: { stanzaId: annuncio._id } })}>Visualizza dettaglio</button>
                                <button className="btn-delete" onClick={() => handleDelete(annuncio._id)} aria-label="Elimina annuncio"><Trash/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}