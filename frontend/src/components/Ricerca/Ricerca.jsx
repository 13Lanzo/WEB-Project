import './Ricerca.css'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import {MapPinHouse, Zap} from 'lucide-react'

const ROOMS_DATA = [
    {
        id: 1,
        title: "Bloomsbury Loft",
        location: "London, WC1",
        price: 850,
        match: 98,
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80",
        tags: [" Pets", " Quiet"]
    },
    {
        id: 2,
        title: "Modern Shared Flat",
        location: "Manchester City Center",
        price: 620,
        match: 85,
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=500&q=80",
        tags: [" No Smoking", " Mixed Faculty"]
    },
    {
        id: 3,
        title: "Oxford Central Studio",
        location: "Oxford, Summertown",
        price: 950,
        match: 92,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80",
        tags: [" Study-first", " Sustainable"]
    }
];

export default function Ricerca() {
    const [selectedPreferences, setSelectedPreferences]=useState(["Non fumatori"]);
    
    const[currentPage, setCurrentPage]=useState(1);

    const togglePreference=(prefName)=>{
        if (selectedPreferences.includes(prefName)){
            setSelectedPreferences(selectedPreferences.filter(p=>p !==prefName));
        } else {
            setSelectedPreferences([...selectedPreferences, prefName]);
        }
    };
    const handleApplyFilters=() =>{
        alert('Filtri applicati!');
    };
    const navigate=useNavigate();
    return(
        <div className='search-page-container'>

            <aside className='filters-sidebar'>
                <h2>Filtri</h2>

                <div className='filter-group'>
                    <label>Città o Quartiere</label>
                    <div className='input-with-icon'>
                        <span className='input-icon'><MapPinHouse/></span>
                        <input type='text' className='filters-sidebar' placeholder='Bari...'/>
                    </div>
                </div>

                <div className='filter-group'>
                    <label>Range di prezzo</label>
                    <div className='price-range-inputs'>
                        <input type='number' placeholder='Min'/>
                        <span className='range-divider'>-</span>
                        <input type='number' placeholder='Max'/>
                    </div>
                </div>

                <div className='filter-group'>
                    <label>Preferenza Coinquilini</label>
                    <div className='preferences-tags'>
                        <button className={`pref-tag ${selectedPreferences.includes('Non fumatori') ? 'active': ''}`} onClick={()=>togglePreference('Non fumatori')}>Non fumatori</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Pet-friendly') ? 'active': ''}`} onClick={()=>togglePreference('Pet-friendly')}>Pet-friendly</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Silenziosi') ? 'active': ''}`} onClick={()=>togglePreference('Silenziosi')}>Silenzioso</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Studenti') ? 'active':''} `} onClick={()=> togglePreference('Studenti')}>Studenti</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Lavoratori') ? 'active': ''}`} onClick={()=> togglePreference('Lavoratori')}>Lavoratori</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Non coppie') ? 'active': ''}`} onClick={()=> togglePreference('Non coppie')}>Non coppie</button>
                    </div>
                </div>
                
                <button className='btn-apply-filters' onClick={handleApplyFilters}>Applica filtri</button>
            </aside>

            <main className='results-container'>
                <header className='results-header'>
                    <div className='header-left'>
                        <h1>Stanza disponibile</h1>
                        <p className='results-count'>Trova match con il tuo profilo</p>
                    </div>
                    <div className='header-right'>
                        <span>Ordina per:</span>
                        <select className='sort-select'>
                            <option>Punteggio compatibile</option>
                            <option>Prezzo: Crescente</option>
                            <option>Prezzo: Descrescente</option>
                        </select>
                    </div>
                </header>

                <div className='rooms-grid'>
                    {ROOMS_DATA.map((room)=>(
                        <div key={room.id} className='room-card'>
                            <div className='room-image-wrapper'>
                                <img src={room.image} alt={room.title} className='room-img'/>
                                <span className='match-badge'><Zap/>{room.match}% Match</span>
                            </div>
                        
                            <div className='room-card-content'>
                                <div className='room-card-main-info'>
                                    <div className='title-and-geo'>
                                        <h3>{room.title}</h3>
                                        <p className='room-location'><MapPinHouse/>{room.location}</p>
                                    </div>
                                    <div className='room-price-box'>
                                        <span className='price-amount'> €{room.price}</span>
                                        <span className='price-period'>/mese</span>
                                    </div>
                                </div>

                                <div className='room-tags-container'>
                                    {room.tags.map((tag, idx)=>(
                                        <span key={idx} className='room-spec-tag'>{tag}</span>
                                    ))}
                                </div>
                                <button className='btn-view-details' onClick={()=>  navigate('/dettagli')}>Maggiori dettagli</button>
                            </div>
                        </div> 
                    ))}
                </div>

                <footer className="pagination-container">
                    <button className="pag-btn" onClick={()=> setCurrentPage(prev => Math.max(prev-1,1))}>‹</button>
                    <button className={`pag-btn ${currentPage=== 1 ? 'active':""}`} onClick={()=> setCurrentPage(1)}>1</button>
                    <button className={`pag-btn ${currentPage ===2 ? 'active': ''}`} onClick={()=> setCurrentPage(2)}>2</button>
                    <button className={`pag-btn ${currentPage === 3 ? 'active': ''}`} onClick={()=> setCurrentPage(3)}>3</button>
                    <button className='pag-btn' onClick={()=> setCurrentPage(prev=>Math.min(prev+1,3))}>›</button>
                </footer>
            </main>    
        </div>
    );
}