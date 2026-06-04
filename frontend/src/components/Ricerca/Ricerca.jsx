import './Ricerca.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { MapPinHouse, Zap } from 'lucide-react'

export default function Ricerca() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtri
    const [cittaFiltro, setCittaFiltro] = useState('');
    const [prezzoMin, setPrezzoMin] = useState('');
    const [prezzoMax, setPrezzoMax] = useState('');
    const [selectedPreferences, setSelectedPreferences] = useState(["Non fumatori"]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const togglePreference = (prefName) => {
        if (selectedPreferences.includes(prefName)) {
            setSelectedPreferences(selectedPreferences.filter(p => p !== prefName));
        } else {
            setSelectedPreferences([...selectedPreferences, prefName]);
        }
    };

    const fetchRooms = () => {
        setLoading(true);
        let url = 'http://10.31.99.48:5000/api/rooms/rooms';
        const params = [];
        if (cittaFiltro) params.push(`citta=${cittaFiltro.trim()}`);
        if (prezzoMin) params.push(`prezzoMin=${prezzoMin}`);
        if (prezzoMax) params.push(`prezzoMax=${prezzoMax}`);
        params.push(`page=${currentPage}`);
        params.push(`limit=6`);
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        fetch(url)
        .then(res => res.json())
        .then(resData => {
            if (resData.success) {
                setRooms(resData.dati);
                setTotalPages(resData.totalPages || 1);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Errore nel caricamento delle stanze:", err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchRooms();
    }, [currentPage]);

    const handleApplyFilters = (e) => {
        e.preventDefault();
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchRooms();
        }
    };

    return (
        <div className='search-page-container font-sans'>
            <aside className='filters-sidebar'>
                <h2>Filtri</h2>

                <div className='filter-group'>
                    <label>Città</label>
                    <div className='input-with-icon'>
                        <span className='input-icon'><MapPinHouse /></span>
                        <input 
                            type='text' 
                            placeholder='Cerca per città (es: Pavia, Milano)...' 
                            value={cittaFiltro}
                            onChange={(e) => setCittaFiltro(e.target.value)}
                        />
                    </div>
                </div>

                <div className='filter-group'>
                    <label>Range di prezzo</label>
                    <div className='price-range-inputs'>
                        <input 
                            type='number' 
                            placeholder='Min' 
                            value={prezzoMin}
                            onChange={(e) => setPrezzoMin(e.target.value)}
                        />
                        <span className='range-divider'>-</span>
                        <input 
                            type='number' 
                            placeholder='Max' 
                            value={prezzoMax}
                            onChange={(e) => setPrezzoMax(e.target.value)}
                        />
                    </div>
                </div>

                <div className='filter-group'>
                    <label>Preferenza Coinquilini</label>
                    <div className='preferences-tag'>
                        <button className={`pref-tag ${selectedPreferences.includes('Non fumatori') ? 'active' : ''}`} onClick={() => togglePreference('Non fumatori')}>Non fumatori</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Pet-friendly') ? 'active' : ''}`} onClick={() => togglePreference('Pet-friendly')}>Pet-friendly</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Silenziosi') ? 'active' : ''}`} onClick={() => togglePreference('Silenziosi')}>Silenziosi</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Studenti') ? 'active' : ''}`} onClick={() => togglePreference('Studenti')}>Studenti</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Lavoratori') ? 'active' : ''}`} onClick={() => togglePreference('Lavoratori')}>Lavoratori</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Non coppie') ? 'active' : ''}`} onClick={() => togglePreference('Non coppie')}>Non coppie</button>
                    </div>
                </div>
                
                <button className='btn-apply-filters' onClick={handleApplyFilters}>Applica filtri</button>
            </aside>

            <main className='results-container'>
                <header className='results-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div className='header-left'>
                        <h1>Stanze disponibili</h1>
                        <p className='results-count'>{rooms.length} alloggi trovati a database</p>
                    </div>
                    <div className='header-right'>
                        <span>Ordina per:</span>
                        <select className='sort-select'>
                            <option>Punteggio compatibile</option>
                            <option>Prezzo: Crescente</option>
                            <option>Prezzo: Decrescente</option>
                        </select>
                    </div>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Caricamento stanze...</div>
                ) : rooms.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: '#1e3a8a', marginBottom: '10px' }}>Nessuna stanza trovata</h3>
                        <p style={{ color: '#6b7280' }}>Prova a modificare i filtri di ricerca o la città inserita.</p>
                    </div>
                ) : (
                    <div className='rooms-grid'>
                        {rooms.map((room) => (
                            <div key={room._id} className='room-card'>
                                <div className='room-image-wrapper'>
                                    <img 
                                        src={room.immagine || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"} 
                                        alt={room.titolo} 
                                        className='room-img'
                                    />
                                    <span className='match-badge'><Zap/>95% Match</span>
                                </div>
                            
                                <div className='room-card-content'>
                                    <div className='room-card-main-info'>
                                        <div className='title-and-geo'>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e3a8a' }}>{room.titolo}</h3>
                                            <p className='room-location'><MapPinHouse/>{room.citta}, {room.indirizzo}</p>
                                        </div>
                                        <div className='room-price-box'>
                                            <span className='price-amount'> €{room.prezzo}</span>
                                            <span className='price-period'>/mese</span>
                                        </div>
                                    </div>

                                    <div className='room-tags-container'>
                                        {room.serviziInclusi && room.serviziInclusi.map((tag, idx) => (
                                            <span key={idx} className='room-spec-tag'>{tag}</span>
                                        ))}
                                    </div>
                                    <button 
                                        className='btn-view-details' 
                                        onClick={() => navigate('/dettagli', { state: { stanzaId: room._id } })}
                                    >
                                        Maggiori dettagli
                                    </button>
                                </div>
                            </div> 
                        ))}
                    </div>
                )}

                <footer className="pagination-container" style={{ marginTop: '30px' }}>
                    <button className="pag-btn" onClick={() => setCurrentPage(prev => Math.max(prev-1,1))} disabled={currentPage === 1}>‹</button>
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(p => (
                        <button 
                            key={p} 
                            className={`pag-btn ${currentPage === p ? 'active' : ''}`} 
                            onClick={() => setCurrentPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                    <button className='pag-btn' onClick={() => setCurrentPage(prev => Math.min(prev+1,totalPages))} disabled={currentPage === totalPages}>›</button>
                </footer>
            </main>    
        </div>
    );
}