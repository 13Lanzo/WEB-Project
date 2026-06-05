import './Annunci.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CirclePlus, MapPinHouse, Trash, Search } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function Annunci({ currentUser }) {
    const navigate = useNavigate();
    const [annunci, setAnnunci] = useState([]);
    const [miaStanza, setMiaStanza] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isProprietario = currentUser?.ruolo === 'proprietario';

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');

        if (isProprietario) {
            // Carica le stanze del proprietario
            fetch(`${API}/rooms/mine`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(data => {
                    if (data.success) setAnnunci(data.dati || []);
                    else setError('Errore nel caricamento degli annunci.');
                })
                .catch(() => setError('Errore di rete.'))
                .finally(() => setLoading(false));
        } else {
            // Carica la stanza assegnata all'inquilino
            fetch(`${API}/rooms/my-room`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(data => {
                    setMiaStanza(data.dati || null);
                })
                .catch(() => setError('Errore di rete.'))
                .finally(() => setLoading(false));
        }
    }, [currentUser, isProprietario]);

    const handleDelete = async (id) => {
        if (!window.confirm('Sei sicuro di voler eliminare questo annuncio?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API}/rooms/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setAnnunci(prev => prev.filter(a => a._id !== id));
            } else {
                alert('Errore durante l\'eliminazione.');
            }
        } catch {
            alert('Errore di rete.');
        }
    };

    // Utente non loggato
    if (!currentUser) {
        return (
            <div className='annunci-page font-sans' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Accesso richiesto</h2>
                    <p>Effettua il login per accedere alla tua Area Riservata.</p>
                    <button className='btn-nuovo-annuncio' onClick={() => navigate('/login')}>Vai al Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className='annunci-page font-sans'>
            <div className='annunci-container'>
                <div className='header-text-block'>
                    <span className='area-badge'>
                        <Sparkles /> AREA {isProprietario ? 'PROPRIETARIO' : 'INQUILINO'}
                    </span>
                    <h1>{isProprietario ? 'I Miei Annunci' : 'La Mia Stanza'}</h1>
                    <p>
                        {isProprietario
                            ? 'Visualizza, modifica, crea e gestisci in tempo reale le stanze del tuo appartamento.'
                            : 'Visualizza i dettagli della stanza che ti è stata assegnata.'}
                    </p>
                </div>
                {isProprietario && (
                    <button className='btn-nuovo-annuncio' onClick={() => navigate('/new')}>
                        <CirclePlus size={15} /> NUOVO ANNUNCIO
                    </button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Caricamento...</div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>{error}</div>
            ) : isProprietario ? (
                // ── VISTA PROPRIETARIO ──
                annunci.length === 0 ? (
                    <div className='annunci-empty-state'>
                        <Sparkles size={48} color='#9ca3af' />
                        <h3>Non hai ancora pubblicato annunci</h3>
                        <p>Crea il tuo primo annuncio e inizia ad accogliere inquilini!</p>
                        <button className='btn-nuovo-annuncio' onClick={() => navigate('/new')}>
                            <CirclePlus size={15} /> CREA IL TUO PRIMO ANNUNCIO
                        </button>
                    </div>
                ) : (
                    <div className='annunci-grid'>
                        {annunci.map((annuncio) => (
                            <div className='annuncio-card' key={annuncio._id}>
                                <div className='card-image-wrapper'>
                                    <span className='city-badge'><MapPinHouse /> {annuncio.citta}</span>
                                    <img
                                        src={annuncio.immagineUrl || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'}
                                        alt={annuncio.titolo}
                                    />
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
                                            <span className='spec-label'>SPAZIO</span>
                                            <span className='spec-value'>{annuncio.superficie || '—'} mq</span>
                                        </div>
                                        <div className='spec-col'>
                                            <span className='spec-label'>DISPONIBILITÀ</span>
                                            <span className='spec-value'>{annuncio.disponibilita || 'Immediata'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='card-footer'>
                                    <button className='btn-dettaglio' onClick={() => navigate(`/dettagli/${annuncio._id}`)}>
                                        Visualizza dettaglio
                                    </button>
                                    <button className="btn-delete" aria-label="Elimina annuncio" onClick={() => handleDelete(annuncio._id)}>
                                        <Trash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                // ── VISTA INQUILINO ──
                miaStanza ? (
                    <div className='annunci-grid'>
                        <div className='annuncio-card' key={miaStanza._id}>
                            <div className='card-image-wrapper'>
                                <span className='city-badge'><MapPinHouse /> {miaStanza.citta}</span>
                                <img
                                    src={miaStanza.immagineUrl || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'}
                                    alt={miaStanza.titolo}
                                />
                            </div>
                            <div className='card-content'>
                                <p className='zone-text'>{miaStanza.indirizzo}</p>
                                <h3 className='card-title'>{miaStanza.titolo}</h3>
                                <div className='card-specs-row'>
                                    <div className='spec-col'>
                                        <span className='spec-label'>PREZZO</span>
                                        <span className='spec-value'>{miaStanza.prezzo} €/mese</span>
                                    </div>
                                    <div className='spec-col'>
                                        <span className='spec-label'>SPAZIO</span>
                                        <span className='spec-value'>{miaStanza.superficie || '—'} mq</span>
                                    </div>
                                    <div className='spec-col'>
                                        <span className='spec-label'>DISPONIBILITÀ</span>
                                        <span className='spec-value'>{miaStanza.disponibilita || '—'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='card-footer'>
                                <button className='btn-dettaglio' onClick={() => navigate(`/dettagli/${miaStanza._id}`)}>
                                    Visualizza dettaglio
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='annunci-empty-state'>
                        <Search size={48} color='#9ca3af' />
                        <h3>Non hai ancora una stanza assegnata</h3>
                        <p>Esplora le stanze disponibili e contatta il proprietario che fa per te!</p>
                        <button className='btn-nuovo-annuncio' onClick={() => navigate('/ricerca')}>
                            <Search size={15} /> CERCA CAMERE
                        </button>
                    </div>
                )
            )}
        </div>
    );
}