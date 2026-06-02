import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import './Header.css'
import {HouseHeartIcon, BellRing, CircleFadingPlus, GlobeCheck, User, MoveRight} from 'lucide-react'
import socket from '../../socket'

function Modale({ isOpen, onClose, initialTab, onLoginSuccess=false}) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const navigate=useNavigate();
    const [name, setName]=useState('');
    const [lastname, setLastname]=useState('');
    const [faculty, setFaculty]=useState('');
    const [role, setRole]=useState('Inquilino');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [confirmPassword, setConfirmPassword]=useState('');
    const [errorMessage, setErrorMessage]= useState('');
    const [eta, setEta]=useState(20);
    const LoginGoogle =()=>{
        window.open('https://www.google.com');
    };
    const LoginInsta =()=>{
        window.open('https://www.instagram.com');
    };

    //controllo password
    const handleSubmit = (e)=> {
        e.preventDefault();
        setErrorMessage('');

        if(activeTab === 'registrati') {
            if(confirmPassword !== password){
                setErrorMessage('Le password non coincidono. Riprova. ');
                return;
            }
            if(password.length<6){
                setErrorMessage('La password deve avere almeno 6 caratteri.');
                return;
            }  
            
            fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: name,
                    cognome: lastname,
                    email: email,
                    password: password,
                    eta: eta,
                    ruolo: role === 'Inquilino' ? 'studente' : 'proprietario',
                    bio: 'Nessuna biografia inserita. Personalizza il tuo profilo!'
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Profilo creato con successo! Ora puoi accedere.');
                    setActiveTab('accedi');
                } else {
                    setErrorMessage(data.messaggio || 'Errore durante la registrazione.');
                }
            })
            .catch(err => {
                setErrorMessage('Errore di rete durante la registrazione.');
            });
        } else {
            fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.utente));
                    onLoginSuccess();
                    onClose();
                    navigate('/profilo');
                } else {
                    setErrorMessage(data.messaggio || 'Credenziali non valide.');
                }
            })
            .catch(err => {
                setErrorMessage('Errore di rete durante il login.');
            });
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
    };
    
    if (!isOpen) return null;

    return(
        <div className="modal-backdrop font-sans">
            <div className='modal-bg-click' onClick={onClose}></div>
            <div className='modal-container'>
                <button onClick={onClose} className='modal-close-btn'> &times;</button>
                <div className='modal-tabs'>
                    <button type='button' onClick={()=> handleTabChange('accedi')} className={`tab-btn ${activeTab === 'accedi' ? 'active' : ''}`}>Accedi</button>
                    <button type='button' onClick={()=> handleTabChange('registrati')} className={`tab-btn ${activeTab === 'registrati' ? 'active' : ''}`}>Registrati</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div className='errore'>{errorMessage}</div>
                    )}
                    {activeTab === 'registrati' && (
                        <>
                        <div className='form-row-double'>
                            <div className='form-group'>
                                <label className='form-label'>Nome</label>
                                <input type='text' placeholder='Inserisci il tuo nome' className='form-input' value={name} onChange={(e)=>setName(e.target.value)} required/>
                            </div>
                            <div className='form-group'>
                                <label className='form-label'>Cognome</label>
                                <input type='text' placeholder='Inserisci il tuo cognome' className='form-input' value={lastname} onChange={(e)=>setLastname(e.target.value)} required/>
                            </div>
                        </div>
                        <div className={role=== 'Inquilino' ? 'form-row-double': 'form-group'}>
                            <div className='form-group'>
                                        <label className='form-label'>Ruolo Utente</label>
                                        <select className='form-input' value={role} onChange={(e) => {setRole(e.target.value); if(e.target.value==='Proprietario'){setFaculty('');}}} required>
                                            <option value="Inquilino">Inquilino</option>
                                            <option value="Proprietario">Proprietario</option>
                                        </select>
                                    </div>
                            {role==='Inquilino' &&(
                            <div className='form-group'>
                                <label className='form-label'>Seleziona Facoltà</label>
                                <select className='form-input' value={faculty} onChange={(e)=> setFaculty(e.target.value)} required>
                                    <option value='' disabled>Scegli</option>
                                    <option value='Ingegneria'>Ingegneria</option>
                                    <option value='Medicina'>Medicina</option>
                                    <option value='Lavoro'>Lavoro</option>
                                    <option value='Disoccupato'>Disoccupato</option>
                                </select>
                            </div>
                            )}
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Età</label>
                            <input type='number' min='18' max='100' placeholder='Inserisci la tua età' className='form-input' value={eta} onChange={(e)=>setEta(parseInt(e.target.value) || '')} required/>
                        </div>
                        </>
                    )}
                    <div className='form-group'>
                        <label className='form-label'>Email</label>
                        <input type="email" placeholder='inserisci emali' className='form-input' value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                        </div>
                    <div className='form-group'>
                        <label className='form-label'>Password</label>
                        <input type='password' placeholder='........' className='form-input' value={password} onChange={(e)=> setPassword(e.target.value)} required/>
                    </div>
                    {activeTab === 'registrati' && (
                        <>
                        <div className='form-group'>
                            <label className='form-label'>Conferma Password</label>
                            <input type='password' placeholder='Conferma password' className='form-input' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required/>
                        </div>
                        </>
                    )}
                    <button type='submit' className='btn-submit'>
                        {activeTab === 'registrati' ? 'Crea il tuo profilo' : 'Accedi al tuo profilo'}
                    </button>
                </form>
                
                <div className='divider-container'>
                    <div className='divider-line'></div>
                    <span className='divider-text'>OPPURE</span>
                    <div className='divider-line'></div>
                </div>
                <div className='social-grid'>
                    <button type='button' className='btn-social' onClick={LoginGoogle}><GlobeCheck color='blue'/><span className='social-label'>Google</span></button>
                    <button type='button' className='btn-social' onClick={LoginInsta}><CircleFadingPlus color='#e1306c'/><span className='social-label' style={{ fontWeight:600 }}>Instagram</span></button>
                </div>
            </div>
        </div>
    );
}

export default function Header({isLoggedIn, onLogout, onLogin}){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialTab, setInitialTab] = useState('registrati');
    const [isNotifOpen, setIsNotifOpen]=useState(false);
    const openModal = (tab) =>{
        setInitialTab(tab);
        setIsModalOpen(true);
    };
    const [activeLink, setActiveLink]=useState('Scopri');
    const navigate =useNavigate();

    const [contacts, setContacts] = useState([]);

    // 1. Carica le conversazioni reali dal backend all'avvio o al cambiamento del login
    useEffect(() => {
        if (!isLoggedIn) {
            setContacts([]);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        fetch('http://localhost:5000/api/messages/conversations', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setContacts(data);
            }
        })
        .catch(err => console.error("Errore caricamento conversazioni:", err));
    }, [isLoggedIn]);

    // 2. Mettiti in ascolto dei nuovi messaggi in arrivo
    useEffect(() => {
        const handleReceiveMessage = (msg) => {
            const sender = msg.mittente;
            const receiver = msg.destinatario;
            const senderId = typeof sender === 'object' ? sender._id : sender;
            const receiverId = typeof receiver === 'object' ? receiver._id : receiver;

            const currentUserStr = localStorage.getItem('user');
            const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
            if (!currentUser) return;
            const myId = currentUser.id;

            const isMittenteMe = senderId === myId;
            const interlocutore = isMittenteMe ? receiver : sender;
            const interlocutoreId = isMittenteMe ? receiverId : senderId;

            setContacts(prevContacts => {
                const index = prevContacts.findIndex(c => c.id === interlocutoreId);
                const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                let updatedContact;
                if (index !== -1) {
                    updatedContact = {
                        ...prevContacts[index],
                        lastMsg: msg.testo,
                        time: timeStr,
                        letto: msg.letto
                    };
                    const nextContacts = [...prevContacts];
                    nextContacts.splice(index, 1);
                    return [updatedContact, ...nextContacts];
                } else {
                    const name = typeof interlocutore === 'object' 
                        ? `${interlocutore.nome} ${interlocutore.cognome}` 
                        : "Utente";
                    updatedContact = {
                        id: interlocutoreId,
                        name: name,
                        lastMsg: msg.testo,
                        time: timeStr,
                        letto: msg.letto
                    };
                    return [updatedContact, ...prevContacts];
                }
            });
        };

        socket.on('ricevi_messaggio', handleReceiveMessage);
        return () => socket.off('ricevi_messaggio', handleReceiveMessage);
    }, []);    
    
    return (
        <div>
        <header className='site-header font-sans'>
            <div className='header-logo' onClick={() => { setActiveLink('Scopri'); navigate('/'); }} style={{ cursor: 'pointer' }}><HouseHeartIcon/></div>
            
                {/*rendering condizionale per vedere lo stato attivo del log*/}
                {isLoggedIn ? (
                    <>
                        <nav className='header-navigation'>
                            <button className={`nav-item ${activeLink=== 'Scopri' ? 'active' :''}`} onClick={()=> {setActiveLink('Scopri'); navigate('/ricerca');}}>Scopri</button>  
                            <button className={`nav-item ${activeLink=== 'Messaggi'? 'active':''}`} onClick={()=> {setActiveLink('Messaggi'); navigate('/chat');}}>Messaggi</button>
                            <button className={`nav-item ${activeLink=== 'Profilo' ? 'active': ''}`} onClick={()=> {setActiveLink('Profilo'); navigate('/profilo');}}>Profilo</button>
                            <button className={`nav-item ${activeLink=== 'New'? 'active':''}`} onClick={()=>{setActiveLink('Annuncio'); navigate('/annunci');}}>Annunci</button>
                        </nav>
                        
                        <div className='logged-in-actions'>
                            <button className="notification-btn" aria-label="Notifiche" onClick={()=> setIsNotifOpen(!isNotifOpen)}><BellRing size={20}/></button>
                            {isNotifOpen &&(
                                <div className='notif-dropdown'>
                                    <div className='notif-header'>
                                        <h4>Messaggi Recenti</h4>
                                    </div>
                                    
                                    <div className='constacts-list'>
                                        {contacts.length === 0 ? (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                                                Nessun messaggio recente
                                            </div>
                                        ) : (
                                            contacts.map(contact =>(
                                                <div key={contact.id} className="contact-item" onClick={()=>{ navigate('/chat', { state: { contactId: contact.id, contactName: contact.name } }); setIsNotifOpen(false);}}>
                                                    <div className='notif-avatar'><User size={40}/></div>
                                                    <div className='notif-info'>
                                                        <div className='notif-top'>
                                                            <span className='notif-name'>{contact.name}</span>
                                                            <span className='notif-time'>{contact.time}</span>
                                                        </div>
                                                        <p className='notif-msg'>{contact.lastMsg}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className='notif-footer' onClick={()=>{navigate('/chat'); setIsNotifOpen(false);}}>Vai alla Chat <MoveRight size={10}/></div>
                                </div>
                            )}
                            <button className='btn-logout' onClick={()=>{onLogout(); navigate('/')}}>Logout</button>
                        </div>
                    </>
                ):(
                    <div className='header-buttons'>
                        <button onClick={()=> openModal('accedi')} className='btn-link'>Accedi</button>
                        <button onClick={()=> openModal('registrati')} className='btn-primary'>Registrati</button>   
                    </div>
                )}          
        </header>
        <Modale isOpen={isModalOpen}
                onClose={()=> setIsModalOpen(false)} 
                initialTab={initialTab} 
                key={`${isModalOpen}-${initialTab}`} 
                onLoginSuccess={onLogin}/>
        </div>
    );
}
