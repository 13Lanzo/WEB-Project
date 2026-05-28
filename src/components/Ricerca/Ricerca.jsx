import './Ricerca.css'
import { useState } from 'react';

const ROOMS_DATA=[];
export default function Ricerca() {
    const [selectedPreferences, setSelectedPreferences]=useState([""]);

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
    const handleViewDetails =(room)=>{
        alert('Apertura dettagli per ${roomTitle');
    };
    return(
        <div className='search-page-container'>

            <aside className='filters-sidebar'>
                <h2>Filtri</h2>

                <div className='filter-group'>
                    <label>Città o Quartiere</label>
                    <div className='input-with-icon'>
                        <span className='input-icon'>📍</span>
                        <input type='text' placeholder='Bari...'/>
                    </div>
                </div>

                <div className='filter-group'>
                    <label>Università</label>
                    <select defaultValue='all'>
                        <option value='all'>Tutte le facoltà</option>
                        <option value='ing'>Ingegneria</option>
                        <option value='med'>Medicine</option>
                        <option value='lav'>Lavoro</option>
                    </select>
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
                    <div className='preferences-tag'>
                        <button className={`pref-tag ${selectedPreferences.includes('Non fumatori') ? 'active': ''}`} onClick={()=>togglePreference('Non fumatori')}>Non fumatori</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Pet-friendly') ? 'active': ''}`} onClick={()=>togglePreference('Pet-frindly')}>Pet-friendly</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Sileziosi') ? 'active':''}`} onClick={()=>togglePreference('Silenziosi')}>Silenziosi</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Studenti') ? 'active':''} `} onClick={()=> togglePreference('Studenti')}>Studenti</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Lavoratori') ? 'active': ''}`} onClick={()=> togglePreference('Lavoratori')}>Lavoratori</button>
                        <button className={`pref-tag ${selectedPreferences.includes('Non coppie') ? 'active': ''}`} onClick={()=> togglePreference('Non coppie')}>Non coppie</button>
                    </div>
                </div>
                
                <button className='btn-apply-filters' onClick={handleApplyFilters}>Applica filtri</button>
            </aside>

            <main className='results-container'>
                <header className='results-container'>
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
                                <span className='match-badge'>⚡ {room.match}% Match</span>
                            </div>
                        
                            <div className='room-card-content'>
                                <div className='room-card-main-info'>
                                    <div className='title-and-geo'>
                                        <h3>{room.title}</h3>
                                        <p className='room-location'>📍 {room.location}</p>
                                    </div>
                                    <div className='room-price-box'>
                                        <span className='price-amount'> £{room.price}</span>
                                        <span claaName='price-period'>/ month/</span>
                                    </div>
                                </div>

                                <div className='room-tags-container'>
                                    {room.tags.map((tag, idx)=>(
                                        <span key={idx} className='room-spec-tag'>{tag}</span>
                                    ))}
                                </div>
                                <button className='btn-view-details' onClick={()=> handleViewDetails(room.title)}>Maggiori dettagli</button>
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