import './Dettagli.css'
import { use, useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {MapPinHouse, Zap, SendHorizontal, Dot, ShieldCheck, TriangleRight, BedDouble, HouseWifi, CalendarArrowUp, Lock, Check, UserRound } from 'lucide-react'

export default function Dettagli({isLoggedIn}) {
    const {id} = useParams(); // Recupera l'ID della stanza dall'URL (/dettagli/:id)
    const navigate = useNavigate();
    
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    
    const token = localStorage.getItem('token')

    // Configurazione icone ed etichette dalle specifiche fisiche
    const SPECS_CONFIG = {
        superficie: { icon:<TriangleRight color='green'/>, label: "Superficie", suffix: " m²" },
        arredamento: { icon: <BedDouble color='green'/>, label: "Arredamento", suffix: "" },
        postiLettoDisponibili: { icon: <HouseWifi color='green'/>, label: "Posti totali", suffix: "letti" },
        disponibilita: { icon: <CalendarArrowUp color='green'></CalendarArrowUp>, label: "Disponibilità", suffix: "" }
    };

    // FITTIZIO:
    // const roomData={
    //     title: "Modern Single Room near Politecnico",
    //     location: "Zona Città Studi, Milano",
    //     price: 650,
    //     matchScore: 80,
    //     size: 18,
    //     furniture: "Full Set",
    //     internet: "Gigabit Fiber",
    //     available_date: "Sept 1, 2024",
    //     description: "Spacious and luminous single room located in a recently renovated apartment. Just 5 minutes walking distance from Politecnico di Milano (Leonardo). The room comes fully equipped with a double bed, large wardrobe, ergonomic desk, and designer lamp.",
    //     host: {
    //         name: "Marco",
    //         age: 24,
    //         bio: '"Looking for a quiet roommate who values clean common spaces and occasional shared dinners. Currently finishing my Master\'s at Polimi."',
    //         tags: ["Ingegneria", "Amante dei gatti", "Vegano", "Palestra"]
    //     }
    // };

    // Chiamata GET reale verso il backend per caricare il singolo annuncio
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/rooms/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();

                if (data.success || data._id) {
                    setRoomData(data.dati || data);
                } else {
                    console.error("Annuncio non trovato");
                }
            } catch (error) {
                console.error("Errore nel recupero dei dettagli della stanza:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoomDetails();
        }
    }, [id, token]);

    // Navigazione verso la chat passando l'ID dell'interlocutore nello stato di navigazione
    const handleStartChat = (recipientID) => {
        if (isLoggedIn) {
            navigate(`/chat`, { state: {openChatWith: recipientID }});
        } else {
            navigate('/login')
        }
    };

    if (loading) {
        return <div className='loading-container'><p>Caricamento dettagli stanza in corso...</p></div>
    }

    if(!roomData){
        return <div className='error-container'><p>Stanza non trovata o annuncio rimosso.</p></div>
    }

    // Gestione array immagini: usiamo quella del DB come principale e delle immagini stock come galleria secondaria
    const mainImage = roomData.immagineUrl || roomData.immagine || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80";
    const tutteLeFoto=[ 
        mainImage,
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80"
    ];

    // const ClickMessaggio=()=>{
    //     if (isLoggedIn){
    //         navigate('/chat');
    //     }else{
    //         navigate('/login');
    //     }
    // };

    return(
        <div className='room-detail-page font-sans'>
            {/* Galleria immagini */}
            <section className='image-gallery-grid'>
                <div className='main-image'>
                    <img src={tutteLeFoto[0]} alt={roomData.titolo || roomData.title} />
                </div>
                <div className='sub-images'>
                    <div className='sub-img'>
                        <img src={tutteLeFoto[1]} alt="Dettaglio interno 1"/>
                    </div>
                    <div className='sub-img'>
                        <img src={tutteLeFoto[2]} alt="Dettaglio interno 2"/>
                    </div>
                    <div className='sub-img relative-box'>
                        <img src={tutteLeFoto[3]} alt="Dettaglio interno 3"/>
                        <button className='btn-all-photos' onClick={()=>setShowAllPhotos(true)}>Mostra tutto</button>
                    </div>
                </div>
            </section>

            {/* Modale Overlay foto a tutto schermo */}
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
                                        <img src={fotoUrl} alt={`Foto appartamento ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='room-layout-container'>
                {/* Colonna Princiaple Informazioni */}
                <main className='room-main-info'>
                    <div className='title-header-box'>
                        <div>
                            <h1 className='room-main-info'>{roomData.titolo || roomData.title}</h1>
                            <p className='geo-location'>
                                <MapPinHouse/>{roomData.indirizzo || roomData.zona}, {roomData.citta || roomData.city}
                                </p>
                            <div className='match-score-badge'>
                                <span className='checkmark'>
                                    <Check/></span>
                                    {roomData.matchScore || 85}% Affinità con il tuo modo di vivere
                            </div>
                        </div>
                        <div className='price-tag-box'>
                            <span className='price-label'>PREZZO MENSILE</span>
                            <span className='price-value'>€{ roomData.prezzo || roomData.price}<small>/mese</small></span>
                        </div>
                    </div>

                    {/* Griglia Caratteristiche Fisiche della Stanza */}
                    <div className='features-specs-grid'>
                        {Object.keys(SPECS_CONFIG).map((key)=> {
                            const config=SPECS_CONFIG[key];
                            const dbValue=roomData[key];
                            if(!dbValue) return null;
                            return(
                                <div key={key} className='spec-item-card'>
                                    <span className='spec-icon'>{config.icon}</span>
                                    <span className='spec-label'>{config.label}</span>
                                    <span className='spec-value'>{dbValue}{config.suffix}</span>
                                </div>
                            );
                        })}
                    </div>
                    <section className='description-section'>
                        <h2>Descrizione Annuncio</h2>
                        <p>{roomData.descrizione || roomData.description || "Nessuna descrizione dettagliata inserita dal proprietario."}</p>
                    </section>

                    {/* Mappa Geografica */}
                    <section className='location-section'>
                        <h2>Posizione</h2>
                        <div className='mock-map-wrapper'>
                            <div className='map-radar-circle'>
                                <div className='map-pin'><MapPinHouse/></div>
                            </div>
                            <div className='map-floating-overlay'>
                                La locazione esatta verrà rivelata solo dopo aver preso contatto con l'Host
                            </div>
                        </div>
                    </section>

                    {/* Tag dei Servizi Inclusi reali recuperati dal database */}
                    {(roomData.serviziTags || roomData.serviziInclusi) && (
                        <section className='tags-display-section'>
                            <h2>Servizi e caratteristiche inclusi</h2>
                            <div className='profile-tags-flex'>
                                {(roomData.serviziTags || roomData.serviziInclusi).map((tag, idx) => (
                                    <span key={idx} className='profile-spec-tag'>{tag}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Sidebar Laterale Gestione Coinquilini e Chat */}
                <aside className='room-sidebar-profile'>
                    <div className='profile-card-sticky'>
                        <h3>Chi vive qui</h3>

                        {/* Elenco Utenti Reali Registrati assegnati */}
                        {roomData.inquiliniAssegnati && roomData.inquiliniAssegnati.length > 0 && (
                            <div className="inquilini-reali-list">
                                {roomData.inquiliniAssegnati.map((inquilino) => (
                                    <div key={inquilino._id || inquilino.id} className="tenant-chat-row">
                                        <div className="tenant-meta">
                                            <div className="host-avatar-small"><UserRound size={16}/></div>
                                            <span>{inquilino.nome} {inquilino.cognome || ''}</span>
                                        </div>
                                        <button 
                                            className="btn-send-message-tenant" 
                                            onClick={() => handleStartChat(inquilino._id || inquilino.id)}
                                            title={`Contatta ${inquilino.nome}`}
                                        >
                                            <SendHorizontal size={14}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Elenco Abitanti Non Registrati (Fittizi) - Solo testo */}
                        {roomData.abitantiNonRegistrati && roomData.abitantiNonRegistrati.length > 0 && (
                            <div className="inquilini-fittizi-list">
                                <p className="fittizi-title-label">Altri abitanti nella casa:</p>
                                {roomData.abitantiNonRegistrati.map((nome, idx) => (
                                    <div key={idx} className="tenant-fittizio-row">
                                        <span>👤 {nome}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <hr className="sidebar-divider" />

                        {/* Informazioni del Proprietario/Host dell'annuncio */}
                        <div className="host-main-profile-block">
                            <h4>Proprietario: {roomData.creatoDa?.nome || "Host Room4U"}</h4>
                            <span className='verified-badge'><Dot size={10} /> Verified Host</span>
                            {roomData.creatoDa?.bio && (
                                <p className='profile-bio-text'>"{roomData.creatoDa.bio}"</p>
                            )}
                            
                            {/* Bottone principale per contattare l'Host */}
                            <button 
                                className='btn-send-message' 
                                onClick={() => handleStartChat(roomData.creatoDa?._id || roomData.creatoDa?.id)}
                            >
                                <SendHorizontal /> Contatta il proprietario
                            </button>
                        </div>
                        
                        {/* <h4>{roomData.host.name}, {roomData.host.age} years old</h4>
                        <span className='verified-badge'><Dot size={10}/> Verified Host</span> */}

                    </div>
                    
                    
                    {/* <div className='profile-tags-flex'>
                        {roomData.host.tags.map((tag,idx)=>(
                            <span key={idx} className='profile-spec-tag'>{tag}</span>
                        ))}
                    </div>
                    <p className='profile-bio-text'>{roomData.host.bio}</p>
                    <button className='btn-send-message' onClick={ClickMessaggio}><SendHorizontal/>Invia messaggio</button>
                    */}

                    <div className='host-trust-footer'>
                        <span><ShieldCheck /> Proprietario Verificato</span>
                        <span><Zap /> Risponde velocemente</span>
                    </div>

                    <div className='safety-guidelines-box'>
                        <span className='safety-icon'><Lock /></span>
                        <div>
                            <h5>Linee guida sicurezza</h5>
                            <p>Diffida da chi vuole parlarti all'esterno. Non pagare al di fuori di contratti certificati da questa piattaforma..</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}