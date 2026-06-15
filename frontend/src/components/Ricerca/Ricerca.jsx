import './Ricerca.css'
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import {MapPinHouse, Zap} from 'lucide-react'
import { getRooms } from '../../services/api';

export default function Ricerca() {
    const [rooms, setRooms] = useState([]);
    const [citta, setCitta] = useState('');
    const [prezzoMin, setPrezzoMin] = useState(''); 
    const [prezzoMax, setPrezzoMax] = useState('');
    const [selectedPreferences, setSelectedPreferences]=useState(["Non fumatori"]);
    
    const[currentPage, setCurrentPage]=useState(1);

    const togglePreference=(prefName)=>{
        if (selectedPreferences.includes(prefName)){
            setSelectedPreferences(selectedPreferences.filter(p=>p !==prefName));
        } else {
            setSelectedPreferences([...selectedPreferences, prefName]);
        }
    };
    
    const navigate=useNavigate();
    

    useEffect(()=>{
        const fetchStanze= async()=>{
            try{
                const data = await getRooms({ citta, prezzoMin, prezzoMax });
                if(data.success){
                    setRooms(data.dati);
                }
            }catch (error){
                console.error('Errore nel recupero stanze:',error);
            }
        };
        fetchStanze();
    }, [citta, prezzoMin, prezzoMax]);


    return(
        <div className='search-page-container'>

            <aside className='filters-sidebar'>
                <h2>Filtri</h2>

                <div className='filter-group'>
                    <label>Città o Quartiere</label>
                    <div className='input-with-icon'>
                        <span className='input-icon'><MapPinHouse/></span>
                        <input type='text' className='filters-sidebar' placeholder='Bari...' value={citta} onChange={(e)=> setCitta(e.target.value)}/>
                    </div>
                </div>

                <div className='filter-group'>
                    <label>Range di prezzo</label>
                    <div className='price-range-inputs'>
                        <input type='number' placeholder='Min' min={0} value={prezzoMin} onChange={(e)=> setPrezzoMin(e.target.value)}/>
                        <span className='range-divider'>-</span>
                        <input type='number' placeholder='Max' min={0} value={prezzoMax} onChange={(e)=> setPrezzoMax(e.target.value)}/>
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
                
                <button className='btn-apply-filters'>Applica filtri</button>
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
                    {rooms.map((room)=>(
                        <div key={room._id} className='room-card'>
                            <div className='room-image-wrapper'>
                                <img src={room.immagineUrl || room.image || room.immagine || 
                                    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80" } 
                                    alt={room.titolo} 
                                    className='room-img'/>
                                <span className='match-badge'><Zap/>% Match</span>
                            </div>
                        
                            <div className='room-card-content'>
                                <div className='room-card-main-info'>
                                    <div className='title-and-geo'>
                                        <h3>{room.titolo}</h3>
                                        <p className='room-location'><MapPinHouse/>{room.indirizzo}</p>
                                    </div>
                                    <div className='room-price-box'>
                                        <span className='price-amount'> €{room.prezzo}</span>
                                        <span className='price-period'>/mese</span>
                                    </div>
                                </div>
                                <button className='btn-view-details' onClick={()=>  navigate(`/dettagli/${room._id}`)}>Maggiori dettagli</button>
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