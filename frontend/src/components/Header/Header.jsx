import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Header.css'
import { HouseHeartIcon, BellRing, User, MoveRight } from 'lucide-react'

const API = 'http://localhost:5000/api';

// ─────────────────────────────────────────────
// MODALE AUTH (Accedi / Registrati)
// ─────────────────────────────────────────────
function Modale({ isOpen, onClose, initialTab, onLoginSuccess }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const navigate = useNavigate();

    // Campi comuni
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Campi solo registrazione
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [eta, setEta] = useState('');
    const [ruolo, setRuolo] = useState('inquilino');
    const [facolta, setFacolta] = useState('');
    const [bio, setBio] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const tagsDisponibili = ['ordinato', 'non-fumatore', 'tranquillo', 'sociale', 'sportivo', 'musica', 'cucina', 'animale-domestico'];

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        if (activeTab === 'registrati') {
            // Validazioni frontend
            if (confirmPassword !== password) {
                setErrorMessage('Le password non coincidono.');
                setLoading(false);
                return;
            }
            if (password.length < 6) {
                setErrorMessage('La password deve avere almeno 6 caratteri.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome, cognome, email, password,
                        eta: parseInt(eta),
                        ruolo,
                        facolta: ruolo === 'inquilino' ? facolta : '',
                        bio,
                        tagPreferenze: selectedTags
                    })
                });
                const data = await res.json();

                if (!res.ok) {
                    setErrorMessage(data.messaggio || 'Errore durante la registrazione.');
                    setLoading(false);
                    return;
                }

                // Salva token e utente
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.utente));
                onLoginSuccess(data.utente);
                onClose();
                navigate('/profilo');

            } catch {
                setErrorMessage('Errore di rete. Il server è attivo?');
            }

        } else {
            // LOGIN
            try {
                const res = await fetch(`${API}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (!res.ok) {
                    setErrorMessage(data.messaggio || 'Email o password errate.');
                    setLoading(false);
                    return;
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.utente));
                onLoginSuccess(data.utente);
                onClose();

            } catch {
                setErrorMessage('Errore di rete. Il server è attivo?');
            }
        }

        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop font-sans">
            <div className='modal-bg-click' onClick={onClose}></div>
            <div className='modal-container'>
                <button onClick={onClose} className='modal-close-btn'>&times;</button>
                <div className='modal-tabs'>
                    <button type='button' onClick={() => handleTabChange('accedi')} className={`tab-btn ${activeTab === 'accedi' ? 'active' : ''}`}>Accedi</button>
                    <button type='button' onClick={() => handleTabChange('registrati')} className={`tab-btn ${activeTab === 'registrati' ? 'active' : ''}`}>Registrati</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {errorMessage && <div className='errore'>{errorMessage}</div>}

                    {activeTab === 'registrati' && (
                        <>
                            <div className='form-row-double'>
                                <div className='form-group'>
                                    <label className='form-label'>Nome</label>
                                    <input type='text' placeholder='Nome' className='form-input' value={nome} onChange={e => setNome(e.target.value)} required />
                                </div>
                                <div className='form-group'>
                                    <label className='form-label'>Cognome</label>
                                    <input type='text' placeholder='Cognome' className='form-input' value={cognome} onChange={e => setCognome(e.target.value)} required />
                                </div>
                            </div>

                            <div className={ruolo === 'inquilino' ? 'form-row-double' : 'form-group'}>
                                <div className='form-group'>
                                    <label className='form-label'>Ruolo</label>
                                    <select className='form-input' value={ruolo} onChange={e => { setRuolo(e.target.value); setFacolta(''); }} required>
                                        <option value="inquilino">Inquilino</option>
                                        <option value="proprietario">Proprietario</option>
                                    </select>
                                </div>
                                {ruolo === 'inquilino' && (
                                    <div className='form-group'>
                                        <label className='form-label'>Facoltà / Impiego</label>
                                        <select className='form-input' value={facolta} onChange={e => setFacolta(e.target.value)} required>
                                            <option value='' disabled>Scegli</option>
                                            <option value='Ingegneria Informatica'>Ingegneria Informatica</option>
                                            <option value='Ingegneria Automazione'>Ingegneria Automazione</option>
                                            <option value='Ingegneria Edile'>Ingegneria Edile</option>
                                            <option value='Architettura'>Architettura</option>
                                            <option value='Medicina'>Medicina</option>
                                            <option value='Economia'>Economia</option>
                                            <option value='Giurisprudenza'>Giurisprudenza</option>
                                            <option value='Lettere e Filosofia'>Lettere e Filosofia</option>
                                            <option value='Matematica'>Matematica</option>
                                            <option value='Scienze Politiche'>Scienze Politiche</option>
                                            <option value='Lingue e Letterature'>Lingue e Letterature</option>
                                            <option value='Lavoro'>Lavoro</option>
                                            <option value='Altro'>Altro</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className='form-group'>
                                <label className='form-label'>Età</label>
                                <input type='number' placeholder='Età' className='form-input' value={eta} onChange={e => setEta(e.target.value)} min={18} max={100} required />
                            </div>
                        </>
                    )}

                    <div className='form-group'>
                        <label className='form-label'>Email</label>
                        <input type="email" placeholder='Inserisci email' className='form-input' value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className='form-group'>
                        <label className='form-label'>Password</label>
                        <input type='password' placeholder='........' className='form-input' value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    {activeTab === 'registrati' && (
                        <>
                            <div className='form-group'>
                                <label className='form-label'>Conferma Password</label>
                                <input type='password' placeholder='Conferma password' className='form-input' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            </div>
                            <div className='form-group'>
                                <label className='form-label'>Bio (opzionale)</label>
                                <textarea placeholder='Raccontati in breve...' className='form-input' rows={2} value={bio} onChange={e => setBio(e.target.value)} style={{ resize: 'none' }} />
                            </div>
                            {ruolo === 'inquilino' && (
                                <div className='form-group'>
                                    <label className='form-label'>Tag preferenze</label>
                                    <div className='tags-grid-modal'>
                                        {tagsDisponibili.map(tag => (
                                            <button type='button' key={tag}
                                                className={`tag-pill-modal ${selectedTags.includes(tag) ? 'active' : ''}`}
                                                onClick={() => toggleTag(tag)}>
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <button type='submit' className='btn-submit' disabled={loading}>
                        {loading ? 'Caricamento...' : (activeTab === 'registrati' ? 'Crea il tuo profilo' : 'Accedi al tuo profilo')}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// HEADER PRINCIPALE
// ─────────────────────────────────────────────
export default function Header({ isLoggedIn, currentUser, onLogout, onLogin }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialTab, setInitialTab] = useState('registrati');
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifiche, setNotifiche] = useState([]);
    const [activeLink, setActiveLink] = useState('Scopri');
    const navigate = useNavigate();
    const notifRef = useRef(null);

    const openModal = (tab) => {
        setInitialTab(tab);
        setIsModalOpen(true);
    };

    // Chiudi il dropdown notifiche cliccando fuori
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Recupera notifiche (messaggi non letti) quando l'utente è loggato
    useEffect(() => {
        if (!isLoggedIn) {
            setNotifiche([]);
            return;
        }
        const fetchNotifiche = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API}/messages/unread`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                setNotifiche(data.dati || []);
            } catch {
                // silenzioso
            }
        };
        fetchNotifiche();
        // Aggiorna ogni 30 secondi
        const interval = setInterval(fetchNotifiche, 30000);
        return () => clearInterval(interval);
    }, [isLoggedIn]);

    const totalNonLetti = notifiche.reduce((sum, n) => sum + (n.count || 1), 0);

    return (
        <div>
            <header className='site-header font-sans'>
                {/* Logo — clicca per tornare alla home */}
                <div className='header-logo' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <HouseHeartIcon />
                </div>

                {isLoggedIn ? (
                    <>
                        <nav className='header-navigation'>
                            <button className={`nav-item ${activeLink === 'Scopri' ? 'active' : ''}`}
                                onClick={() => { setActiveLink('Scopri'); navigate('/ricerca'); }}>
                                Scopri
                            </button>
                            <button className={`nav-item ${activeLink === 'Messaggi' ? 'active' : ''}`}
                                onClick={() => { setActiveLink('Messaggi'); navigate('/chat'); }}>
                                Messaggi
                            </button>
                            <button className={`nav-item ${activeLink === 'Profilo' ? 'active' : ''}`}
                                onClick={() => { setActiveLink('Profilo'); navigate('/profilo'); }}>
                                Profilo
                            </button>
                            <button className={`nav-item ${activeLink === 'Annunci' ? 'active' : ''}`}
                                onClick={() => { setActiveLink('Annunci'); navigate('/annunci'); }}>
                                Area Riservata
                            </button>
                        </nav>

                        <div className='logged-in-actions'>
                            {/* Campana notifiche */}
                            <div ref={notifRef} style={{ position: 'relative' }}>
                                <button className="notification-btn" aria-label="Notifiche"
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}>
                                    <BellRing size={20} />
                                    {totalNonLetti > 0 && (
                                        <span className='notif-badge'>{totalNonLetti}</span>
                                    )}
                                </button>

                                {isNotifOpen && (
                                    <div className='notif-dropdown'>
                                        <div className='notif-header'>
                                            <h4>Messaggi non letti</h4>
                                        </div>
                                        <div className='constacts-list'>
                                            {notifiche.length === 0 ? (
                                                <p style={{ padding: '12px', color: '#888', fontSize: '0.85rem' }}>
                                                    Nessun nuovo messaggio
                                                </p>
                                            ) : (
                                                notifiche.map((notif, idx) => (
                                                    <div key={idx} className='contact-item active'
                                                        onClick={() => { navigate('/chat'); setIsNotifOpen(false); }}>
                                                        <div className='notif-avatar'><User size={40} /></div>
                                                        <div className='notif-info'>
                                                            <div className='notif-top'>
                                                                <span className='notif-name'>
                                                                    {notif.mittente?.nome} {notif.mittente?.cognome}
                                                                </span>
                                                                <span className='notif-count'>{notif.count} msg</span>
                                                            </div>
                                                            <p className='notif-msg'>{notif.ultimoMessaggio}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className='notif-footer' onClick={() => { navigate('/chat'); setIsNotifOpen(false); }}>
                                            Vai alla Chat <MoveRight size={10} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className='btn-logout' onClick={() => { onLogout(); navigate('/'); }}>
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className='header-buttons'>
                        <button onClick={() => openModal('accedi')} className='btn-link'>Accedi</button>
                        <button onClick={() => openModal('registrati')} className='btn-primary'>Registrati</button>
                    </div>
                )}
            </header>

            <Modale
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialTab={initialTab}
                key={`${isModalOpen}-${initialTab}`}
                onLoginSuccess={onLogin}
            />
        </div>
    );
}
