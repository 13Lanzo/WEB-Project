import './Ricerca.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinHouse, Zap, SlidersHorizontal } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function Ricerca() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ citta: '', prezzoMin: '', prezzoMax: '' });
    const [selectedPreferences, setSelectedPreferences] = useState([]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.citta) params.append('citta', filters.citta);
            if (filters.prezzoMin) params.append('prezzoMin', filters.prezzoMin);
            if (filters.prezzoMax) params.append('prezzoMax', filters.prezzoMax);

            const res = await fetch(`${API}/rooms?${params.toString()}`);
            const data = await res.json();
            if (data.success) setRooms(data.dati || []);
        } catch {
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const togglePreference = (pref) => {
        setSelectedPreferences(prev =>
            prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
        );
    };

    // Filtraggio tag lato client (i tag sono serviziTags)
    const roomsFiltrate = rooms.filter(room => {
        if (selectedPreferences.length === 0) return true;
        return selectedPreferences.every(pref =>
            room.serviziTags?.some(t => t.toLowerCase().includes(pref.toLowerCase())) ||
            room.serviziInclusi?.some(t => t.toLowerCase().includes(pref.toLowerCase()))
        );
    });

    return (
        <div className='search-page-container'>
            <aside className='filters-sidebar'>
                <h2>Filtri</h2>

                <div className='filter-group'>
                    <label>Città o Quartiere</label>
                    <div className='input-with-icon'>
                        <span className='input-icon'><MapPinHouse /></span>
                        <input type='text' placeholder='Bari...'
                            value={filters.citta}
                            onChange={e => setFilters(prev => ({ ...prev, citta: e.target.value }))} />
                    </div>
                </div>

                <div className='filter-group'>
                    <label>Range di prezzo (€/mese)</label>
                    <div className='price-range-inputs'>
                        <input type='number' placeholder='Min'
                            value={filters.prezzoMin}
                            onChange={e => setFilters(prev => ({ ...prev, prezzoMin: e.target.value }))} />
                        <span className='range-divider'>-</span>
                        <input type='number' placeholder='Max'
                            value={filters.prezzoMax}
                            onChange={e => setFilters(prev => ({ ...prev, prezzoMax: e.target.value }))} />
                    </div>
                </div>

                <div className='filter-group'>
                    <label>Preferenza Servizi</label>
                    <div className='preferences-tag'>
                        {['Non fumatore', 'Pet friendly', 'Tranquillo', 'Aria Condizionata', 'Terrazzo', 'Luminoso'].map(pref => (
                            <button key={pref}
                                className={`pref-tag ${selectedPreferences.includes(pref) ? 'active' : ''}`}
                                onClick={() => togglePreference(pref)}>
                                {pref}
                            </button>
                        ))}
                    </div>
                </div>

                <button className='btn-apply-filters' onClick={fetchRooms}>
                    <SlidersHorizontal size={15} /> Applica filtri
                </button>
            </aside>

            <main className='results-container'>
                <header className='results-header'>
                    <div className='header-left'>
                        <h1>Stanze disponibili</h1>
                        <p className='results-count'>
                            {loading ? 'Caricamento...' : `${roomsFiltrate.length} stanz${roomsFiltrate.length === 1 ? 'a trovata' : 'e trovate'}`}
                        </p>
                    </div>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Caricamento stanze...</div>
                ) : roomsFiltrate.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                        <h3>Nessuna stanza trovata</h3>
                        <p>Prova a cambiare i filtri di ricerca.</p>
                    </div>
                ) : (
                    <div className='rooms-grid'>
                        {roomsFiltrate.map((room) => (
                            <div key={room._id} className='room-card'>
                                <div className='room-image-wrapper'>
                                    <img
                                        src={room.immagineUrl || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500&q=80'}
                                        alt={room.titolo}
                                        className='room-img'
                                    />
                                    {room.postiLettoDisponibili > 0 && (
                                        <span className='match-badge'><Zap /> Disponibile</span>
                                    )}
                                </div>

                                <div className='room-card-content'>
                                    <div className='room-card-main-info'>
                                        <div className='title-and-geo'>
                                            <h3>{room.titolo}</h3>
                                            <p className='room-location'>
                                                <MapPinHouse /> {room.citta} — {room.indirizzo}
                                            </p>
                                        </div>
                                        <div className='room-price-box'>
                                            <span className='price-amount'>€{room.prezzo}</span>
                                            <span className='price-period'>/mese</span>
                                        </div>
                                    </div>

                                    <div className='room-tags-container'>
                                        {[...(room.serviziTags || []), ...(room.serviziInclusi || [])].slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className='room-spec-tag'>{tag}</span>
                                        ))}
                                    </div>

                                    <button
                                        className='btn-view-details'
                                        onClick={() => navigate(`/dettagli/${room._id}`)}>
                                        Maggiori dettagli
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}