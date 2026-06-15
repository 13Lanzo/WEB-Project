import './Dettagli.css'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {MapPinHouse, Zap, SendHorizontal, Dot, ShieldCheck, TriangleRight, BedDouble, HouseWifi, CalendarArrowUp, Lock, Check } from 'lucide-react'

export default function Dettagli({isLoggedIn}) {
    const [showAllPhotos, setShowAllPhotos]=useState(false);
    const navigate= useNavigate();
    const SPECS_CONFIG = {
        size: { icon:<TriangleRight color='green'/>, label: "Size", suffix: " m²" },
        furniture: { icon: <BedDouble color='green'/>, label: "Furniture", suffix: "" },
        internet: { icon: <HouseWifi color='green'/>, label: "Internet", suffix: "" },
        available_date: { icon: <CalendarArrowUp color='green'></CalendarArrowUp>, label: "Available", suffix: "" }
    };
    const roomData={
        title: "Modern Single Room near Politecnico",
        location: "Zona Città Studi, Milano",
        price: 650,
        matchScore: 80,
        size: 18,
        furniture: "Full Set",
        internet: "Gigabit Fiber",
        available_date: "Sept 1, 2024",
        description: "Spacious and luminous single room located in a recently renovated apartment. Just 5 minutes walking distance from Politecnico di Milano (Leonardo). The room comes fully equipped with a double bed, large wardrobe, ergonomic desk, and designer lamp.",
        host: {
            name: "Marco",
            age: 24,
            bio: '"Looking for a quiet roommate who values clean common spaces and occasional shared dinners. Currently finishing my Master\'s at Polimi."',
            tags: ["Ingegneria", "Amante dei gatti", "Vegano", "Palestra"]
        }
    };
    const tutteLeFoto=[
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80"
    ];

    const ClickMessaggio=()=>{
        if (isLoggedIn){
            navigate('/chat');
        }else{
            navigate('/login');
        }
    };

    return(
        <div className='room-detail-page font-sans'>
            <section className='image-gallery-grid'>
                <div className='main-image'>
                    <img src={tutteLeFoto[0]} alt="Detail 2"/>
                </div>
                <div className='sub-images'>
                    <div className='sub-image'>
                        <img src={tutteLeFoto[1]} alt="Detail 1"/>
                    </div>
                    <div className='sub-image'>
                        <img src={tutteLeFoto[2]} alt="Detail 2"/>
                    </div>
                    <div className='sub-image relative-box'>
                        <img src={tutteLeFoto[3]} alt="Detail 3"/>
                        <button className='btn-all-photos' onClick={()=>setShowAllPhotos(true)}>Mostra tutto</button>
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
                            <h1>{roomData.title}</h1>
                            <p className='geo-location'><MapPinHouse/>{roomData.location}</p>
                            <div className='match-score-badge'>
                                <span className='checkmark'><Check/></span>{roomData.matchScore}% Affinità con il tuo modo di vivere
                            </div>
                        </div>
                        <div className='price-tag-box'>
                            <span className='price-label'>A PARTIRE DA</span>
                            <span className='price-value'>€{roomData.price}<small>/mese</small></span>
                        </div>
                    </div>
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
                        <h2>Descrizione</h2>
                        <p>{roomData.description}</p>
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
                        <h3>Chi vive qui</h3>
                        <h4>{roomData.host.name}, {roomData.host.age} years old</h4>
                        <span className='verified-badge'><Dot size={10}/> Verified Host</span>
                    </div>
                    <div className='profile-tags-flex'>
                        {roomData.host.tags.map((tag,idx)=>(
                            <span key={idx} className='profile-spec-tag'>{tag}</span>
                        ))}
                    </div>
                    <p className='profile-bio-text'>{roomData.host.bio}</p>
                    <button className='btn-send-message' onClick={ClickMessaggio}><SendHorizontal/>Invia messaggio</button>
                    <div className='host-trust-footer'>
                        <span><ShieldCheck/> Verified Host</span>
                        <span><Zap/> Responds quickly</span>
                    </div>
                    <div className='safety-guidelines-box'>
                        <span className='safety-icon'><Lock/></span>
                        <div>
                            <h5>Guidelinea Sicurezza</h5>
                            <p>Diffida da chi vuole parlarti all'esterno. Non pagare al di fuori di contratti certificati da questa piattaforma.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}