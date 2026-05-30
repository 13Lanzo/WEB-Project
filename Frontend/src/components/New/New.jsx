import { useState } from "react";
import {useNavigate} from 'react-router-dom'
import './New.css'

export default function New() {
    const navigate=useNavigate();
    const defaultImages = [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
    ];

    const availableTags = [
        'Non fumatore', 'Pet friendly', 'Tranquillo', 'Eco-friendly', 
        'Luminoso', 'Terrazzo', 'Aria Condizionata', 'Lavastoviglie'
    ];

    const [formData, setFormData] = useState({
        citta: 'Pavia',
        zona: '',
        titolo: '',
        prezzo: '',
        superficie: '',
        arredamento: 'Completo',
        disponibilita: 'Immediata',
        immagineUrl: defaultImages[0]
    });
    const [selectedTags, setSelectedTags]=useState(['Non fumatore']);
    const handleChange=(e)=> {
        const {name, value}=e.target;
        setFormData(prev => ({...prev, [name]:value}));
    };
    const toggleTag =(tag)=>{setSelectedTags(prev=>
    prev.include(tag) ? prev.filter(t => t !==tag) : [...prev, tag]
        );
    };  
    const handlePublish =(e)=>{
        e.preventDefault();
        alert('Annuncio pubblicato con successo!');
        navigate('/annunci');
    }; 
    return(
        <div className="new-page font-sans">
            <div className="page-container">
                <div className="page-header">
                    <div className="header-text">
                        <span className="area-badge">✨ AREA PROPRIETARIO</span>
                        <h1>I Mie Annunci</h1>
                        <p>Visualizza, modifica, crea e gestisci in tempo reale le stanze del tuo appartamento.</p>
                    </div>
                </div>

                <div className="split-layout">
                    <div className="form-column">
                        <div className="form-section-title">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            <h2>Dettagli della Stanza</h2>
                        </div>
                        <form onSubmit={handlePublish} className="new-form">
                            <div className="input-row-2">
                                <div className="input-group">
                                    <label>Città</label>
                                    <select name="città" value={formData.citta} onClick={handleChange} className="input-field">
                                        <option value='Pavia'>Pavia</option>
                                        <option value="Milano">Milano</option>
                                        <option value="Torino">Torino</option>
                                        <option value="Bari">Bari</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Città / Indirizzo / Quartiere</label>
                                    <input type="text" name="zona" value={formData.zona} onChange={handleChange} placeholder="Via, Viale, Piazza..." className="input-field" required/>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Titolo dell'annuncio</label>
                                <input type="text" name="titolo" value={formData.titolo} onChange={handleChange} placeholder="Camera singola..." className="input-field" required/>
                            </div>
                            <div className="input-row-4">
                                <div className='input-group'>
                                    <label>Prezzo Mensile</label>
                                    <div className="input-with-prefix">
                                        <span>€</span>
                                        <input type="number" name="prezzo" value={formData.prezzo} onChange={handleChange} placeholder="prezzo" className="input-field" required/>
                                    </div>

                                    <div className="input-group">
                                        <label>Superficie</label>
                                        <div className="input-with-suffix">
                                            <input type="number" name="superficie" value={formData.superficie} onChange={handleChange} placeholder="metri quadri" className="input-field" required/>
                                            <span>mq</span>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Arredamento</label>
                                        <select name="arredamento" value={formData.arredamento} onChange={handleChange} className="input-field">
                                            <option value='Completo'>Completo</option>
                                            <option value='Parziale'>Parziale</option>
                                            <option value='Vuoto'>Vuoto</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Disponibilità</label>
                                        <input type="text" name="disponibilità" value={formData.disponibilita} onChange={handleChange} placeholder="libera tra..." className="input-field" required/>
                                    </div>
                                </div>
                            </div>    
                                <div className="image-selection-section">
                                    <label className="section-label">📸 Scegli l'immagine della camera</label>
                                    <div className="image-picker-grid">
                                        {defaultImages.map((img, idx)=>(
                                            <div key={idx} className={`image-picker-item ${formData.immagineUrl===img ? 'selected':''}`} onClick={()=> setFormData({...formData, immagineUrl:img})}>
                                                <img src={img} alt={`Opzione ${idx}`}/>
                                                {formData.immagineUrl === img && <div className="check-badge">✓</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div> 
                                <div className="tags-section">
                                    <label className="section-label">Caratteristiche & Servizi (Seleziona tag)</label>
                                    <div className="tags-flex">
                                        {availableTags.map(tag=> (
                                            <button type="button" key={tag} className={`tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`} onClick={()=> toggleTag(tag)}>{tag}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-pubblica" onClick={()=> navigate('/annunci')}>✨ Pubblica Annuncio</button>
                                    <button type="button" className="btn-annulla" onClick={()=> navigate('/annunci')}>Annulla</button>
                                </div>       
                        </form>
                    </div>

                    <div className="preview-column">
                        <div className="previw-header">
                            <span className="eye-icon">👁</span>
                            <span>ANTEPRIMA IN TEMPO REALE</span>
                        </div>
                        <div className="preview-card-container">
                            <div className="annuncio-card mock-preview">
                                <div className="card-image-wrapper">
                                    <span className="city-badge">📍 {formData.citta || 'Città'}</span>
                                    <img src={formData.immagineUrl} alt='Anteprima'/>
                                </div>
                                <div className="card-content">
                                    <p className="zone-text">{formData.zona || 'Inserisci indirizzo...'}</p>
                                    <h3 className="card-title">{formData.titolo || "Inserisci il titolo dell'annuncio..."}</h3>
                                    <div className="card-specs-row">
                                            <div className="spec-col">
                                                <span className="spac-label">PREZZO</span>
                                                <span className="spec-value">{formData.superficie || '0'} €/mese</span>
                                            </div>
                                            <div className="spec-col">
                                                <span className="spec-label">SPAZIO</span>
                                                <span className="spec-value">{formData.superficie || '0'} mq</span>
                                            </div>
                                            <div className="spec-col">
                                                <span className="spec-label">ENTRATA</span>
                                                <span className="spec-value">{formData.disponibilita || '...'}</span>
                                            </div>
                                        </div>
                                    </div>
                                <div className="card-footer preview-host">
                                    <div className="host-mini-info">
                                        <div className="host-avatar-small">SU</div>
                                        <div>
                                            <span className="host-name">Proprietario</span>
                                            <span className="host-faculty">{formData.citta}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}