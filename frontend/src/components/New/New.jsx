import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import './New.css'
import {Home, ImageDown, Sparkle, MapPinHouse, Eye, UserRound, Search, Plus, X } from 'lucide-react'

export default function New() {
    const navigate=useNavigate();
    
    // Recupero dati autenticazione da localStorage
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const ruolo = user?.ruolo;
    const nomeProprietario = user ? `${user.nome} ${user.cognome || ''}` : "Super Proprietario";

    // 1. PROTEZIONE DELLA PAGINA: se l'utente non è proprietario, redirect a /annunci
    useEffect(() => {
        if (ruolo !== 'proprietario'){
            navigate('/area-riservata');
        }
    }, [ruolo, navigate]);

    const defaultImages = [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
    ];

    // Stili del Form ampliati con i nuovi campi richiesti
    const [formData, setFormData] = useState({
        citta: '',
        indirizzo:'',
        descrizione: '',
        prezzo: '',
        superficie: '',
        arredamento: '',
        disponibilita: '',
        postiLettoTotali: '',
        postiLettoDisponibili: '',
        immagineUrl: defaultImages[0]
    });

    // Stati per la gestione della sezione "Chi vive nella casa"
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [inquiliniAssegnati, setInquiliniAssegnati] = useState([]); // per inquilini registrati sul sito
    const [nomeFittizioInput, setNomeFittizioInput] = useState(''); // per inquilini non registrati sul sito
    const [abitantiNonRegistrati, setAbitantiNonRegistrati] = useState([]); // per inquilini non registrati sul sito

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]:value}));
    };

    // Ricerca asincrona degli utenti registrati sul backend
    const handleSearchUsers = async() => {
        if (!searchQuery.trim()) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/search?q=${searchQuery}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();
            if (data.success) {
                setSearchResults(data.dati || [])
            }
        } catch (error) {
            console.error("Errore durante la ricerca utenti:", error);
        }
    };

    const addInquilinoReale = (user) => {
        if(!inquiliniAssegnati.some(u => u._id === user._id)) {
            setInquiliniAssegnati([...inquiliniAssegnati, user]);
        }
        setSearchQuery('');
        setSearchResults([]);
    }

    const addAbitanteFittizio = () => {
        if(nomeFittizioInput.trim() && ! abitantiNonRegistrati.includes(nomeFittizioInput.trim())) {
            setAbitantiNonRegistrati([...abitantiNonRegistrati, nomeFittizioInput.trim()]);
            setNomeFittizioInput('');
        }
    };

    const handlePublish = async (e)=>{
        if (e) e.preventDefault();

        const payload = {
            ...formData,
            inquiliniAssegnati: inquiliniAssegnati.map(u => u._id || u.id),
            abitantiNonRegistrati
        };

        try {
            const res = await fetch('http://localhost:5000/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok || data.success) {
                alert('Annuncio pubblicato con successo su Room4U');
                navigate('/area-riservata');
            } else {
                alert('Errore durante la pubblicazione: ' + (data.messaggio || data.errore || 'Errore generico'));
            }
            
        } catch (error) {
            console.error("Errore di rete durante la pubblicazione:", error);
            alert("Impossibile connettersi al server.");
        }
    };
    return(
        <div className="new-page font-sans">
            <div className="page-container">
                <div className="page-header">
                    <div className="header-text">
                        <span className="area-badge"><Sparkle/> AREA PROPRIETARIO</span>
                        <h1>Crea Nuovo Annuncio</h1>
                        <p>Visualizza, modifica, crea e gestisci in tempo reale le stanze del tuo appartamento.</p>
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
                                    <input type="text" name="citta" value={formData.citta} onChange={handleChange} placeholder="Bari, Milano..." className="input-field" required/>
                                </div>
                                <div className="input-group">
                                    <label>Indirizzo</label>
                                    <input type="text" name="indirizzo" value={formData.indirizzo} onChange={handleChange} placeholder="Via, Viale, Piazza..." className="input-field" required/>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Titolo dell'annuncio</label>
                                <input type="text" name="titolo" value={formData.titolo} onChange={handleChange} placeholder="Camera singola..." className="input-field" required/>
                            </div>
                            <div className="input-group">
                                <label>Descrizione dell'annuncio</label>
                                <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder="Inserisci una descrizione dettagliata della camera..." className="input-field" rows="4" required></textarea>
                            </div>
                            <div className="specs-form-grid">
                                <div className='input-group'>
                                    <label>Prezzo Mensile</label>
                                    <div className="input-with-prefix">
                                        <span>€</span>
                                        <input type="number" name="prezzo" value={formData.prezzo} onChange={handleChange} placeholder="Es: 300" className="input-field" required/>
                                    </div>
                                </div>
                                <div className="input-group">
                                        <label>Superficie</label>
                                        <div className="input-with-suffix">
                                            <input type="number" name="superficie" value={formData.superficie} onChange={handleChange} placeholder="Es: 16" className="input-field" required/>
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
                                        <input type="text" name="disponibilita" value={formData.disponibilita} onChange={handleChange} placeholder="Es: Immediata o da Settembre" className="input-field" required/>
                                    </div>
                                    
                                    <div className="input-group">
                                        <label>Posti Letto Totali nella Casa</label>
                                        <input type="number" 
                                            name="postiLettoTotali" 
                                            value={formData.postiLettoTotali} 
                                            onChange={handleChange} 
                                            placeholder="Es: 3" 
                                            className="input-field" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Posti Letto Disponibili</label>
                                        <input type="number" 
                                            name="postiLettoDisponibili" 
                                            value={formData.postiLettoDisponibili} 
                                            onChange={handleChange} 
                                            placeholder="Es: 1" 
                                            className="input-field" required />
                                    </div>
                                </div>

                                <div className="chi-vive-section">
                                    <label className="section-label">
                                        <UserRound size={16}/> Chi vive nella casa (Gestione Coinquilini)
                                    </label>

                                    <div className="search-user-block">
                                        <p className="sub-label-info">Cerca un inquilino registrato tramite Email o Nome per associarlo alla stanza:</p>
                                        <div className="search-input-wrapper">
                                            <input type="text" 
                                                value={searchQuery} 
                                                onChange={(e) => setSearchQuery(e.target.value)} 
                                                placeholder="Inserisci nome o email..." 
                                                className="input-field-search" />
                                            <button type="button" 
                                                onClick={handleSearchUsers} 
                                                className="btn-search-trigger">
                                                    <Search size={16}/>
                                            </button>
                                        </div>
                                        {searchResults.length > 0 && (
                                            <div className="search-results-dropdown">
                                                {searchResults.map(u => (
                                                    <div key={u._id} className="search-result-item" onClick={() => addInquilinoReale(u)}>
                                                        <span>{u.nome} {u.cognome} ({u.email})</span>
                                                        <Plus size={14}/>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Inserimento Nomi Fittizi */}
                                    <div className="fittizi-user-block">
                                        <p className="sub-label-info">Oppure scrivi il nome di un abitante non registrato sul sito:</p>
                                        <div className="search-input-wrapper">
                                            <input type="text" 
                                                value={nomeFittizioInput} 
                                                onChange={(e) => setNomeFittizioInput(e.target.value)} 
                                                placeholder="Es: Mario Rossi (fittizio)" 
                                                className="input-field-search" />
                                            <button type="button" 
                                                onClick={addAbitanteFittizio} 
                                                className="btn-search-trigger">
                                                    <Plus size={16}/>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Visualizzazione Badge dei Co-abitanti inseriti */}
                                    <div className="residenti-badges-container">
                                        {inquiliniAssegnati.map(u => (
                                            <span key={u._id} className="badge-residente reale">
                                                {u.nome} <X size={12} onClick={() => setInquiliniAssegnati(inquiliniAssegnati.filter(x => x._id !== u._id))}/>
                                            </span>
                                        ))}
                                        {abitantiNonRegistrati.map(name => (
                                            <span key={name} className="badge-residente fittizio">
                                                {name} <X size={12} onClick={() => setAbitantiNonRegistrati(abitantiNonRegistrati.filter(x => x !== name))}/>
                                            </span>
                                        ))}
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
                                <div className="form-actions">
                                    <button type="submit" className="btn-pubblica"><Sparkle/> Pubblica Annuncio</button>
                                    <button type="button" className="btn-annulla" onClick={()=> navigate('/area-riservata')}>Annulla</button>
                                </div>        
                        </form>
                    </div>

                    {/* ANTEPRIMA AGGIORNATA IN TEMPO REALE */}
                    <div className="preview-column">
                        <div className="preview-header">
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
                                    <p className="zone-text">{formData.indirizzo || 'Inserisci indirizzo...'}</p>
                                    <h3 className="card-title">{formData.titolo || "Inserisci il titolo dell'annuncio..."}</h3>
                                    <div className="card-specs-row">
                                            <div className="spec-col">
                                                <span className="spac-label">PREZZO</span>
                                                {/* CORRETTO: Cambiato da superficie a prezzo */}
                                                <span className="spec-value">{formData.prezzo || '0'} €/mese</span>
                                            </div>
                                            <div className="spec-col">
                                                <span className="spec-label">SPAZIO</span>
                                                <span className="spec-value">{formData.superficie || '0'} mq</span>
                                            </div>
                                            <div className="spec-col">
                                                <span className="spec-label">POSTI LETTO</span>
                                                <span className="spec-value">
                                                    {formData.postiLettoDisponibili || '0'}/{formData.postiLettoTotali || '0'} liberi
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                {/* <div className="card-footer preview-host">
                                    <div className="host-mini-info">
                                        <div className="host-avatar-small"><UserRound/></div>
                                        <div>
                                            <span className="host-name">{userProprietario.name}</span>
                                            <span className="host-faculty">{formData.citta}</span>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="card-footer preview-host">
                                    <div className="host-mini-info">
                                        <div className="host-avatar-small"><UserRound /></div>
                                        <div>
                                            <span className="host-name">{nomeProprietario}</span>
                                            <span className="host-faculty">Proprietario Room4U</span>
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