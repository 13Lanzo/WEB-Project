import './Dettagli.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPinHouse, Zap, SendHorizontal, Dot, ShieldCheck, BedDouble, HouseWifi, CalendarArrowUp, Lock, Check, User, TriangleRight } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function Dettagli({ isLoggedIn, currentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [stanza, setStanza] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    // Immagini di fallback
    const tutteLeFoto = [
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80"
    ];

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        fetch(`${API}/rooms/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.success) setStanza(data.dati);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    const clickMessaggioProprietario = () => {
        if (!isLoggedIn) { navigate('/login'); return; }
        navigate('/chat', {
            state: {
                chatWith: stanza?.creatoDa
            }
        });
    };

    const clickMessaggioInquilino = (inquilino) => {
        if (!isLoggedIn) { navigate('/login'); return; }
        navigate('/chat', {
            state: { chatWith: inquilino }
        });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#888' }}>
                Caricamento stanza...
            </div>
        );
    }

    // Fallback se non c'è un ID (link vecchi senza /:id)
    if (!stanza && !id) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Stanza non trovata</h2>
                <p>Naviga dalla pagina di ricerca per vedere i dettagli di una stanza.</p>
                <button onClick={() => navigate('/ricerca')} style={{ marginTop: '1rem', padding: '0.75rem 2rem', background: '#065f46', color: '#fff', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontWeight: 700 }}>
                    Vai alla ricerca
                </button>
            </div>
        );
    }

    if (!stanza) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Stanza non trovata</h2>
                <p>L&apos;annuncio potrebbe essere stato rimosso o l&apos;ID non è valido.</p>
                <button onClick={() => navigate('/ricerca')} style={{ marginTop: '1rem', padding: '0.75rem 2rem', background: '#065f46', color: '#fff', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontWeight: 700 }}>
                    Torna alla ricerca
                </button>
            </div>
        );
    }

    // Usa l'immagine del proprietario o le foto di default
    const fotoPrincipale = stanza.immagineUrl || tutteLeFoto[0];
    const fotoGalleria = [fotoPrincipale, ...tutteLeFoto.slice(1)];

    const SPECS_CONFIG = {
        superficie: { icon: <TriangleRight color='green' />, label: "Superficie", suffix: " m²" },
        arredamento: { icon: <BedDouble color='green' />, label: "Arredamento", suffix: "" },
        serviziInclusi: { icon: <HouseWifi color='green' />, label: "Servizi", suffix: "" },
        disponibilita: { icon: <CalendarArrowUp color='green' />, label: "Disponibile", suffix: "" }
    };

    return (
        <div className='room-detail-page font-sans'>
            {/* Galleria immagini */}
            <section className='image-gallery-grid'>
                <div className='main-image'>
                    <img src={fotoGalleria[0]} alt="Foto principale" />
                </div>
                <div className='sub-images'>
                    {fotoGalleria.slice(1, 3).map((foto, i) => (
                        <div key={i} className='sub-image'>
                            <img src={foto} alt={`Foto ${i + 2}`} />
                        </div>
                    ))}
                    <div className='sub-image relative-box'>
                        <img src={fotoGalleria[3] || fotoGalleria[0]} alt="Foto 4" />
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
                                {fotoGalleria.map((fotoUrl, index) => (
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
                {/* Informazioni principali */}
                <main className='room-main-info'>
                    <div className='title-header-box'>
                        <div>
                            <h1>{stanza.titolo}</h1>
                            <p className='geo-location'>
                                <MapPinHouse /> {stanza.citta} — {stanza.indirizzo}
                            </p>
                            {currentUser && (
                                <div className='match-score-badge'>
                                    <span className='checkmark'><Check /></span>
                                    Stanza verificata sulla piattaforma
                                </div>
                            )}
                        </div>
                        <div className='price-tag-box'>
                            <span className='price-label'>A PARTIRE DA</span>
                            <span className='price-value'>€{stanza.prezzo}<small>/mese</small></span>
                        </div>
                    </div>

                    {/* Caratteristiche */}
                    <div className='features-specs-grid'>
                        {stanza.superficie > 0 && (
                            <div className='spec-item-card'>
                                <span className='spec-icon'><TriangleRight color='green' /></span>
                                <span className='spec-label'>Superficie</span>
                                <span className='spec-value'>{stanza.superficie} m²</span>
                            </div>
                        )}
                        {stanza.arredamento && (
                            <div className='spec-item-card'>
                                <span className='spec-icon'><BedDouble color='green' /></span>
                                <span className='spec-label'>Arredamento</span>
                                <span className='spec-value'>{stanza.arredamento}</span>
                            </div>
                        )}
                        {stanza.postiLettoTotali && (
                            <div className='spec-item-card'>
                                <span className='spec-icon'><HouseWifi color='green' /></span>
                                <span className='spec-label'>Posti letto</span>
                                <span className='spec-value'>{stanza.postiLettoDisponibili}/{stanza.postiLettoTotali} disponibili</span>
                            </div>
                        )}
                        {stanza.disponibilita && (
                            <div className='spec-item-card'>
                                <span className='spec-icon'><CalendarArrowUp color='green' /></span>
                                <span className='spec-label'>Disponibile</span>
                                <span className='spec-value'>{stanza.disponibilita}</span>
                            </div>
                        )}
                    </div>

                    {/* Descrizione */}
                    <section className='description-section'>
                        <h2>Descrizione</h2>
                        <p>{stanza.descrizione}</p>
                    </section>

                    {/* Servizi inclusi */}
                    {(stanza.serviziInclusi?.length > 0 || stanza.serviziTags?.length > 0) && (
                        <section className='description-section'>
                            <h2>Servizi e caratteristiche</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0.75rem' }}>
                                {[...(stanza.serviziInclusi || []), ...(stanza.serviziTags || [])].map((s, i) => (
                                    <span key={i} style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: '20px', padding: '4px 12px', fontSize: '0.85rem', fontWeight: 600 }}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Mappa fittizia */}
                    <section className='location-section'>
                        <h2>Locazione</h2>
                        <div className='mock-map-wrapper'>
                            <div className='map-radar-circle'>
                                <div className='map-pin'><MapPinHouse /></div>
                            </div>
                            <div className='map-floating-overlay'>
                                La locazione esatta verrà rivelata solo dopo messaggio
                            </div>
                        </div>
                    </section>
                </main>

                {/* Sidebar Chi vive qui */}
                <aside className='room-sidebar-profile'>
                    {/* Card proprietario */}
                    <div className='profile-card-sticky'>
                        <h3>Il Proprietario</h3>
                        <h4>{stanza.creatoDa?.nome} {stanza.creatoDa?.cognome}</h4>
                        <span className='verified-badge'><Dot size={10} /> Proprietario Verificato</span>
                        {stanza.creatoDa?.bio && (
                            <p className='profile-bio-text' style={{ marginTop: '0.75rem' }}>{stanza.creatoDa.bio}</p>
                        )}
                    </div>

                    <button className='btn-send-message' onClick={clickMessaggioProprietario}>
                        <SendHorizontal /> Invia messaggio al proprietario
                    </button>

                    {/* Sezione Chi vive qui */}
                    {((stanza.inquiliniAssegnati && stanza.inquiliniAssegnati.length > 0) ||
                        (stanza.abitantiNonRegistrati && stanza.abitantiNonRegistrati.length > 0)) && (
                            <div className='chi-vive-aside'>
                                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Chi vive qui</h3>

                                {/* Utenti registrati */}
                                {stanza.inquiliniAssegnati?.map((inquilino) => (
                                    <div key={inquilino._id} className='inquilino-card'>
                                        <div className='inquilino-avatar'><User size={24} /></div>
                                        <div className='inquilino-info'>
                                            <span className='inquilino-name'>{inquilino.nome} {inquilino.cognome}</span>
                                            {inquilino.facolta && (
                                                <span className='inquilino-faculty'>{inquilino.facolta}</span>
                                            )}
                                            {inquilino.tagPreferenze?.length > 0 && (
                                                <div className='inquilino-tags'>
                                                    {inquilino.tagPreferenze.slice(0, 2).map((tag, i) => (
                                                        <span key={i} className='mini-tag'>{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button className='btn-msg-inquilino' onClick={() => clickMessaggioInquilino(inquilino)}>
                                            <SendHorizontal size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Persone non registrate */}
                                {stanza.abitantiNonRegistrati?.map((nome, i) => (
                                    <div key={i} className='inquilino-card non-registered-card'>
                                        <div className='inquilino-avatar non-registered-avatar'><User size={24} /></div>
                                        <div className='inquilino-info'>
                                            <span className='inquilino-name'>{nome}</span>
                                            <span className='inquilino-faculty' style={{ color: '#9ca3af' }}>Non registrato</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    <div className='host-trust-footer'>
                        <span><ShieldCheck /> Proprietario Verificato</span>
                        <span><Zap /> Risponde rapidamente</span>
                    </div>
                    <div className='safety-guidelines-box'>
                        <span className='safety-icon'><Lock /></span>
                        <div>
                            <h5>Linee Guida Sicurezza</h5>
                            <p>Diffida da chi vuole parlarti all&apos;esterno. Non pagare al di fuori di contratti certificati da questa piattaforma.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}