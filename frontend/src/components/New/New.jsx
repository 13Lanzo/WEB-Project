import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import './New.css';
import { Home, ImageDown, Sparkle, MapPinHouse, Eye, UserRound, X, Search as SearchIcon } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function New({ currentUser }) {
    const navigate = useNavigate();

    // Protezione: solo proprietari
    useEffect(() => {
        if (!currentUser) { navigate('/login'); return; }
        if (currentUser.ruolo !== 'proprietario') { navigate('/annunci'); }
    }, [currentUser, navigate]);

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
        citta: 'Bari',
        indirizzo: '',
        titolo: '',
        descrizione: '',
        prezzo: '',
        superficie: '',
        arredamento: 'Completo',
        postiLettoTotali: 1,
        postiLettoDisponibili: 1,
        disponibilita: 'Immediata',
        immagineUrl: defaultImages[0]
    });

    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Sezione "Chi vive qui"
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [inquiliniAssegnati, setInquiliniAssegnati] = useState([]); // utenti registrati
    const [abitantiNonRegistrati, setAbitantiNonRegistrati] = useState([]); // nomi liberi
    const [nomeLibero, setNomeLibero] = useState('');
    const searchTimeout = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Ricerca utenti registrati
    const handleSearch = (val) => {
        setSearchQuery(val);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (val.trim().length < 2) { setSearchResults([]); return; }

        searchTimeout.current = setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API}/users/search?q=${encodeURIComponent(val)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setSearchResults(data.dati || []);
            } catch {
                setSearchResults([]);
            }
        }, 400);
    };

    const addInquilino = (utente) => {
        if (!inquiliniAssegnati.find(u => u._id === utente._id)) {
            setInquiliniAssegnati(prev => [...prev, utente]);
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeInquilino = (id) => {
        setInquiliniAssegnati(prev => prev.filter(u => u._id !== id));
    };

    const addAbitanteNonRegistrato = () => {
        if (nomeLibero.trim() && !abitantiNonRegistrati.includes(nomeLibero.trim())) {
            setAbitantiNonRegistrati(prev => [...prev, nomeLibero.trim()]);
            setNomeLibero('');
        }
    };

    const removeAbitanteNonRegistrato = (nome) => {
        setAbitantiNonRegistrati(prev => prev.filter(n => n !== nome));
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    titolo: formData.titolo,
                    descrizione: formData.descrizione || `Stanza a ${formData.citta}, ${formData.indirizzo}.`,
                    prezzo: parseFloat(formData.prezzo),
                    citta: formData.citta,
                    indirizzo: formData.indirizzo,
                    superficie: parseFloat(formData.superficie) || 0,
                    arredamento: formData.arredamento,
                    postiLettoTotali: parseInt(formData.postiLettoTotali),
                    postiLettoDisponibili: parseInt(formData.postiLettoDisponibili),
                    disponibilita: formData.disponibilita,
                    immagineUrl: formData.immagineUrl,
                    serviziTags: selectedTags,
                    inquiliniAssegnati: inquiliniAssegnati.map(u => u._id),
                    abitantiNonRegistrati
                })
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.errore || data.messaggio || 'Errore nella pubblicazione.');
                setLoading(false);
                return;
            }

            alert('✅ Annuncio pubblicato con successo!');
            navigate('/annunci');
        } catch {
            setError('Errore di rete. Il server è attivo?');
        }
        setLoading(false);
    };

    const userNome = currentUser ? `${currentUser.nome} ${currentUser.cognome}` : 'Proprietario';

    return (
        <div className="new-page font-sans">
            <div className="page-container">
                <div className="page-header">
                    <div className="header-text">
                        <span className="area-badge"><Sparkle /> AREA PROPRIETARIO</span>
                        <h1>Nuovo Annuncio</h1>
                        <p>Compila i dettagli della stanza e pubblicala sulla piattaforma.</p>
                    </div>
                </div>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 16px', color: '#dc2626', marginBottom: '1rem', maxWidth: '900px' }}>
                        {error}
                    </div>
                )}

                <div className="split-layout">
                    <div className="form-column">
                        <div className="form-section-title">
                            <Home />
                            <h2>Dettagli della Stanza</h2>
                        </div>
                        <form onSubmit={handlePublish} className="new-form">
                            {/* Città + Indirizzo */}
                            <div className="input-row-2">
                                <div className="input-group">
                                    <label>Città</label>
                                    <select name="citta" value={formData.citta} onChange={handleChange} className="input-field">
                                        <option value='Bari'>Bari</option>
                                        <option value="Milano">Milano</option>
                                        <option value="Torino">Torino</option>
                                        <option value="Pavia">Pavia</option>
                                        <option value="Roma">Roma</option>
                                        <option value="Napoli">Napoli</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Indirizzo</label>
                                    <input type="text" name="indirizzo" value={formData.indirizzo} onChange={handleChange} placeholder="Via, Viale, Piazza..." className="input-field" required />
                                </div>
                            </div>

                            {/* Titolo */}
                            <div className="input-group">
                                <label>Titolo dell&apos;annuncio</label>
                                <input type="text" name="titolo" value={formData.titolo} onChange={handleChange} placeholder="Camera singola..." className="input-field" required />
                            </div>

                            {/* Descrizione */}
                            <div className="input-group">
                                <label>Descrizione</label>
                                <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} placeholder="Descrivi la stanza..." className="input-field" rows={3} style={{ resize: 'vertical' }} />
                            </div>

                            {/* Prezzo + Superficie + Arredamento + Disponibilità */}
                            <div className="input-row-4">
                                <div className='input-group'>
                                    <label>Prezzo Mensile</label>
                                    <div className="input-with-prefix">
                                        <span>€</span>
                                        <input type="number" name="prezzo" value={formData.prezzo} onChange={handleChange} placeholder="350" className="input-field" required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Superficie</label>
                                    <div className="input-with-suffix">
                                        <input type="number" name="superficie" value={formData.superficie} onChange={handleChange} placeholder="18" className="input-field" />
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
                                    <input type="text" name="disponibilita" value={formData.disponibilita} onChange={handleChange} placeholder="Immediata" className="input-field" />
                                </div>
                            </div>

                            {/* Posti letto */}
                            <div className="input-row-2">
                                <div className="input-group">
                                    <label>Posti letto totali</label>
                                    <input type="number" name="postiLettoTotali" value={formData.postiLettoTotali} onChange={handleChange} min={1} className="input-field" />
                                </div>
                                <div className="input-group">
                                    <label>Posti letto disponibili</label>
                                    <input type="number" name="postiLettoDisponibili" value={formData.postiLettoDisponibili} onChange={handleChange} min={0} className="input-field" />
                                </div>
                            </div>

                            {/* Scegli immagine */}
                            <div className="image-selection-section">
                                <label className="section-label"><ImageDown /> Scegli l&apos;immagine della camera</label>
                                <div className="image-picker-grid">
                                    {defaultImages.map((img, idx) => (
                                        <div key={idx}
                                            className={`image-picker-item ${formData.immagineUrl === img ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, immagineUrl: img })}>
                                            <img src={img} alt={`Opzione ${idx + 1}`} />
                                            {formData.immagineUrl === img && <div className="check-badge">✓</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tag caratteristiche */}
                            <div className="tags-section">
                                <label className="section-label">Caratteristiche &amp; Servizi</label>
                                <div className="tags-flex">
                                    {availableTags.map(tag => (
                                        <button type="button" key={tag}
                                            className={`tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`}
                                            onClick={() => toggleTag(tag)}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chi vive nella casa */}
                            <div className="chi-vive-section">
                                <label className="section-label"><UserRound size={16} /> Chi vive nella casa</label>

                                {/* Ricerca utenti registrati */}
                                <div className="search-users-box">
                                    <p className="search-help-text">Cerca un utente registrato sul sito:</p>
                                    <div className="search-input-wrapper">
                                        <SearchIcon size={16} className="search-icon-inline" />
                                        <input
                                            type="text"
                                            placeholder="Cerca per nome o email..."
                                            value={searchQuery}
                                            onChange={e => handleSearch(e.target.value)}
                                            className="input-field"
                                        />
                                    </div>
                                    {searchResults.length > 0 && (
                                        <div className="search-dropdown">
                                            {searchResults.map(u => (
                                                <div key={u._id} className="search-result-item" onClick={() => addInquilino(u)}>
                                                    <span className="result-name">{u.nome} {u.cognome}</span>
                                                    <span className="result-email">{u.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Inquilini registrati aggiunti */}
                                {inquiliniAssegnati.length > 0 && (
                                    <div className="abitanti-list">
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '8px 0 4px' }}>Utenti registrati:</p>
                                        {inquiliniAssegnati.map(u => (
                                            <div key={u._id} className="abitante-chip registered">
                                                <span>{u.nome} {u.cognome} <small>({u.email})</small></span>
                                                <button type="button" onClick={() => removeInquilino(u._id)}><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Nomi liberi non registrati */}
                                <div className="free-name-box">
                                    <p className="search-help-text">Aggiungi nome (persona non registrata):</p>
                                    <div className="input-row-2">
                                        <input
                                            type="text"
                                            placeholder="Es. Mario Rossi"
                                            value={nomeLibero}
                                            onChange={e => setNomeLibero(e.target.value)}
                                            className="input-field"
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAbitanteNonRegistrato(); } }}
                                        />
                                        <button type="button" className="btn-add-name" onClick={addAbitanteNonRegistrato}>Aggiungi</button>
                                    </div>
                                </div>

                                {abitantiNonRegistrati.length > 0 && (
                                    <div className="abitanti-list">
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '8px 0 4px' }}>Persone non registrate:</p>
                                        {abitantiNonRegistrati.map((nome, i) => (
                                            <div key={i} className="abitante-chip non-registered">
                                                <span>{nome}</span>
                                                <button type="button" onClick={() => removeAbitanteNonRegistrato(nome)}><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-pubblica" disabled={loading}>
                                    <Sparkle /> {loading ? 'Pubblicazione...' : 'Pubblica Annuncio'}
                                </button>
                                <button type="button" className="btn-annulla" onClick={() => navigate('/annunci')}>Annulla</button>
                            </div>
                        </form>
                    </div>

                    {/* Anteprima */}
                    <div className="preview-column">
                        <div className="previw-header">
                            <span className="eye-icon"><Eye size={15} /></span>
                            <span>ANTEPRIMA IN TEMPO REALE</span>
                        </div>
                        <div className="preview-card-container">
                            <div className="annuncio-card mock-preview">
                                <div className="card-image-wrapper">
                                    <span className="city-badge"><MapPinHouse /> {formData.citta || 'Città'}</span>
                                    <img src={formData.immagineUrl} alt='Anteprima' />
                                </div>
                                <div className="card-content">
                                    <p className="zone-text">{formData.indirizzo || 'Inserisci indirizzo...'}</p>
                                    <h3 className="card-title">{formData.titolo || "Inserisci il titolo dell'annuncio..."}</h3>
                                    <div className="card-specs-row">
                                        <div className="spec-col">
                                            <span className="spec-label">PREZZO</span>
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
                                        <div className="host-avatar-small"><UserRound /></div>
                                        <div>
                                            <span className="host-name">{userNome}</span>
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