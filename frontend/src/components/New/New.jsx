import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './New.css';
import { Home, ImageDown, Sparkle, MapPinHouse, Eye, UserRound } from 'lucide-react';

export default function New() {
    const navigate = useNavigate();
    
    // Recupera l'utente loggato
    const currentUserStr = localStorage.getItem('user');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    
    useEffect(() => {
        if (!currentUser || currentUser.ruolo !== 'proprietario') {
            alert("Accesso negato: Solo i proprietari possono caricare annunci.");
            navigate('/');
        }
    }, [currentUser?.id, navigate]);

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
    
    const [selectedTags, setSelectedTags] = useState(['Non fumatore']);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };  

    const handlePublish = (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const token = localStorage.getItem('token');
        const descCompilata = `Stanza di ${formData.superficie}mq con arredamento ${formData.arredamento}. Disponibilità: ${formData.disponibilita}.`;

        fetch(`http://localhost:5000/api/rooms/${currentUser.id}/rooms`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                titolo: formData.titolo,
                descrizione: descCompilata,
                prezzo: parseFloat(formData.prezzo),
                citta: formData.citta,
                indirizzo: formData.zona,
                serviziInclusi: selectedTags,
                immagine: formData.immagineUrl
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Annuncio pubblicato con successo!');
                navigate('/annunci');
            } else {
                alert(data.errore || data.messaggio || 'Errore durante la pubblicazione dell\'annuncio.');
            }
        })
        .catch(err => {
            console.error("Errore di rete:", err);
            alert("Errore di rete durante la pubblicazione dell'annuncio.");
        });
    }; 

    return (
        <div className="new-page font-sans">
            <div className="page-container">
                <div className="page-header">
                    <div className="header-text">
                        <span className="area-badge"><Sparkle/> AREA PROPRIETARIO</span>
                        <h1>I Miei Annunci</h1>
                        <p>Crea e pubblica in tempo reale le stanze del tuo appartamento.</p>
                    </div>
                </div>

                <div className="split-layout">
                    <div className="form-column">
                        <div className="form-section-title">
                            <Home/>
                            <h2>Dettagli della Stanza</h2>
                        </div>
                        <form onSubmit={handlePublish} className="new-form">
                            <div className="input-row-2">
                                <div className="input-group">
                                    <label>Città</label>
                                    <select name="citta" value={formData.citta} onChange={handleChange} className="input-field">
                                        <option value='Pavia'>Pavia</option>
                                        <option value="Milano">Milano</option>
                                        <option value="Torino">Torino</option>
                                        <option value="Bari">Bari</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Indirizzo</label>
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
                                    <input type="text" name="disponibilita" value={formData.disponibilita} onChange={handleChange} placeholder="libera da..." className="input-field" required/>
                                </div>
                            </div>    
                            <div className="image-selection-section">
                                <label className="section-label"><ImageDown/> Scegli l'immagine della camera</label>
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
                                <button type="submit" className="btn-pubblica"><Sparkle/> Pubblica Annuncio</button>
                                <button type="button" className="btn-annulla" onClick={()=> navigate('/annunci')}>Annulla</button>
                            </div>       
                        </form>
                    </div>

                    <div className="preview-column">
                        <div className="previw-header">
                            <span className="eye-icon"><Eye size={15}/></span>
                            <span>ANTEPRIMA IN TEMPO REALE</span>
                        </div>
                        <div className="preview-card-container">
                            <div className="annuncio-card mock-preview">
                                <div className="card-image-wrapper">
                                    <span className="city-badge"><MapPinHouse/> {formData.citta || 'Città'}</span>
                                    <img src={formData.immagineUrl} alt='Anteprima'/>
                                </div>
                                <div className="card-content">
                                    <p className="zone-text">{formData.zona || 'Inserisci indirizzo...'}</p>
                                    <h3 className="card-title">{formData.titolo || "Inserisci il titolo dell'annuncio..."}</h3>
                                    <div className="card-specs-row">
                                        <div className="spec-col">
                                            <span className="spac-label">PREZZO</span>
                                            <span className="spec-value">{formData.prezzo || '0'} €/mese</span>
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
                                        <div className="host-avatar-small"><UserRound/></div>
                                        <div>
                                            <span className="host-name">{currentUser ? `${currentUser.nome}` : "Host"}</span>
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