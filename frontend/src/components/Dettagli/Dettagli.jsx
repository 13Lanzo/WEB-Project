import './Dettagli.css'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MapPinHouse, Zap, SendHorizontal, Dot, ShieldCheck, BedDouble, HouseWifi, CalendarArrowUp, Lock, Check } from 'lucide-react'

export default function Dettagli() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Recupera l'utente loggato
    const currentUserStr = localStorage.getItem('user');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    const myId = currentUser ? currentUser.id : "default";

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    const stanzaId = location.state?.stanzaId;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Effettua il login per visualizzare i dettagli dell'annuncio.");
            navigate('/login');
            return;
        }

        const fetchDetails = (id) => {
            fetch(`http://10.31.99.48:5000/api/rooms/${myId}/rooms/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setRoom(resData.dati);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Errore nel caricamento dei dettagli:", err);
                setLoading(false);
            });
        };

        if (stanzaId) {
            fetchDetails(stanzaId);
        } else {
            // Fallback: carica la prima stanza disponibile nel sistema
            fetch('http://10.31.99.48:5000/api/rooms/rooms')
            .then(res => res.json())
            .then(resData => {
                if (resData.success && resData.dati.length > 0) {
                    fetchDetails(resData.dati[0]._id);
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [stanzaId, myId, navigate]);

    const clickMessaggio = () => {
        if (!room || !room.creatoDa) return;
        
        // Vai alla chat e passa l'ID e il nome dell'host come stato
        navigate('/chat', {
            state: {
                contactId: room.creatoDa._id,
                contactName: `${room.creatoDa.nome}`
            }
        });
    };

    if (loading) {
        return (
            <div className='room-detail-page font-sans' style={{ textAlign: 'center', padding: '100px 20px', color: '#6b7280' }}>
                <h2>Caricamento dettagli stanza...</h2>
            </div>
        );
    }

    if (!room) {
        return (
            <div className='room-detail-page font-sans' style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Annuncio non trovato o non disponibile.</h2>
                <button className='btn-dettaglio' onClick={() => navigate('/ricerca')} style={{ marginTop: '20px' }}>Torna alla Ricerca</button>
            </div>
        );
    }

    const fotoPrincipale = room.immagine || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80";
    const tutteLeFoto = [
        fotoPrincipale,
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80"
    ];

    return (
        <div className='room-detail-page font-sans'>
            <section className='image-gallery-grid'>
                <div className='main-image'>
                    <img src={tutteLeFoto[0]} alt="Camera principale"/>
                </div>
                <div className='sub-images'>
                    <div className='sub-image'>
                        <img src={tutteLeFoto[1]} alt="Particolare camera 1"/>
                    </div>
                    <div className='sub-image'>
                        <img src={tutteLeFoto[2]} alt="Particolare camera 2"/>
                    </div>
                    <div className='sub-image relative-box'>
                        <img src={tutteLeFoto[3]} alt="Particolare camera 3"/>
                        <button className='btn-all-photos' onClick={() => setShowAllPhotos(true)}>Mostra tutto</button>
                    </div>
                </div>
            </section>

            {showAllPhotos && (
                <div className="gallery-overlay">
                    <div className="gallery-backdrop" onClick={() => setShowAllPhotos(false)}>
                        <div className="gallery-modal-container">
                            <header className="gallery-modal-header">
                                <h3>Tutte le foto della stanza</h3>
                                <button className="gallery-close-btn" onClick={() => setShowAllPhotos(false)}>
                                    &times; Chiudi
                                </button>
                            </header>
                            
                            <div className="gallery-pictures-grid">
                                {tutteLeFoto.map((fotoUrl, index) => (
                                    <div key={index} className="gallery-picture-item">
                                        <img src={fotoUrl} alt={`Stanza foto ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className='room-layout-container'>
                <main className='room-main-info'>
                    <div className='title-header-box'>
                        <div>
                            <h1 style={{ color: '#1e3a8a', fontWeight: '700' }}>{room.titolo}</h1>
                            <p className='geo-location'><MapPinHouse/>{room.citta}, {room.indirizzo}</p>
                            <div className='match-score-badge'>
                                <span className='checkmark'><Check/></span>98% Affinità con il tuo modo di vivere
                            </div>
                        </div>
                        <div className='price-tag-box'>
                            <span className='price-label'>A PARTIRE DA</span>
                            <span className='price-value'>€{room.prezzo}<small>/mese</small></span>
                        </div>
                    </div>

                    <div className='features-specs-grid'>
                        <div className='spec-item-card'>
                            <span className='spec-icon'><CalendarArrowUp color='green'/></span>
                            <span className='spec-label'>Stato</span>
                            <span className='spec-value'>{room.disponibile ? 'Libera subito' : 'Occupata'}</span>
                        </div>
                        <div className='spec-item-card'>
                            <span className='spec-icon'><BedDouble color='green'/></span>
                            <span className='spec-label'>Arredamento</span>
                            <span className='spec-value'>Completo</span>
                        </div>
                        <div className='spec-item-card'>
                            <span className='spec-icon'><HouseWifi color='green'/></span>
                            <span className='spec-label'>Internet</span>
                            <span className='spec-value'>Fibra Wi-Fi</span>
                        </div>
                    </div>

                    <section className='description-section'>
                        <h2>Descrizione Stanza</h2>
                        <p>{room.descrizione}</p>
                    </section>

                    <section className='location-section'>
                        <h2>Locazione</h2>
                        <div className='mock-map-wrapper'>
                            <div className='map-radar-circle'>
                                <div className='map-pin'><MapPinHouse/></div>
                            </div>
                            <div className='map-floating-overlay'>
                                La locazione esatta verrà rivelata solo dopo messaggio
                            </div>
                        </div>
                    </section>
                </main>

                <aside className='room-sidebar-profile'>
                    <div className='profile-card-sticky'>
                        <h3>Proprietario / Host</h3>
                        <h4>{room.creatoDa ? `${room.creatoDa.nome}` : "Host verificato"}</h4>
                        <span className='verified-badge'><Dot size={10}/> Verified Host</span>
                    </div>
                    {room.creatoDa && room.creatoDa.email && (
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '5px 0' }}>✉ {room.creatoDa.email}</p>
                    )}
                    <div className='profile-tags-flex'>
                        {room.serviziInclusi && room.serviziInclusi.map((tag, idx) => (
                            <span key={idx} className='profile-spec-tag'>{tag}</span>
                        ))}
                    </div>
                    {room.creatoDa && room.creatoDa.bio && (
                        <p className='profile-bio-text'>"{room.creatoDa.bio}"</p>
                    )}
                    <button className='btn-send-message' onClick={clickMessaggio}><SendHorizontal/>Invia messaggio</button>
                    <div className='host-trust-footer'>
                        <span><ShieldCheck/> Verified Host</span>
                        <span><Zap/> Risponde rapidamente</span>
                    </div>
                </aside>
            </div>
        </div>
    );
}