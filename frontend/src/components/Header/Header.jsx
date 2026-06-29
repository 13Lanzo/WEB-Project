import {useState, useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import './Header.css'
import {HouseHeartIcon, BellRing, CircleFadingPlus, Globe, MoveRight} from 'lucide-react'
import { login, register } from '../../services/api';

//const socket=io.connect('http://localhost:5000');

function Modale({ isOpen, onClose, initialTab, onLoginSuccess=false}) {
    // Diamo un valore di fallback ('accedi') se initialTab è undefined al primo avvio
    const [activeTab, setActiveTab] = useState(initialTab || 'accedi');
    const navigate=useNavigate();
    // STATI IN ITALIANO ALLINEATI AL DATABASE MONGOOB
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [bio, setBio] = useState('');
    const [eta, setEta] = useState('');
    const [tags, setTags] = useState([]);
    const [facolta, setFacolta] = useState('');
    
    // Ruolo iniziale in minuscolo per evitare conflitti con i controller del server
    const [ruolo, setRuolo] = useState('inquilino');

    const LoginGoogle =()=>{
        window.open('https://www.google.com');
    };
    const LoginInsta =()=>{
        window.open('https://www.instagram.com');
    };

    const handleCheckboxChange = (e) => {
        const {value, checked} = e.target;
        if(checked){
            setTags([...tags, value]);
        } else {
            setTags(tags.filter((tag) => tag !== value));
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (activeTab === 'registrati') {
            if (confirmPassword !== password) {
                setErrorMessage('Le password non coincidono. Riprova.');
                return;
            }
            if (password.length < 6) {
                setErrorMessage('La password deve avere almeno 6 caratteri.');
                return;
            }  
            if (Number(eta) < 18) {
                setErrorMessage('Devi essere maggiorenne per registrarti.');
                return;
            }

            try {
                const payload = {
                    nome: nome, 
                    cognome: cognome,
                    ruolo: ruolo, 
                    facolta: ruolo === 'inquilino' ? facolta : undefined,
                    eta: Number(eta),
                    bio: bio,
                    tags: tags,
                    email: email,
                    password: password
                };

                const data = await register(payload);

                const utenteRegistrato = data.user || data.utente;
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(utenteRegistrato)); // UNIFICATO SU 'user'
                }

                alert('Profilo creato con successo!!');
                onLoginSuccess(utenteRegistrato);
                navigate('/profilo'); 
                onClose();
            } catch (err) {
                console.error('Errore registrazione:', err);
                setErrorMessage(err.message || 'Server irraggiungibile.');
            }
                
        } else {
            try {
                const data = await login(email, password);

                const utenteLoggato = data.utente || data.user;
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(utenteLoggato)); // UNIFICATO SU 'user'
                }

                onLoginSuccess(utenteLoggato);
                navigate('/profilo');
                onClose();
            } catch (err) {
                setErrorMessage(err.message || 'Server irraggiungibile.');
            }
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
                                <input type='text' placeholder='Inserisci il tuo nome' className='form-input' value={nome} onChange={(e)=>setNome(e.target.value)} required/>
                            </div>
                            <div className='form-group'>
                                <label className='form-label'>Cognome</label>
                                <input type='text' placeholder='Inserisci il tuo cognome' className='form-input' value={cognome} onChange={(e)=>setCognome(e.target.value)} required/>
                            </div>
                        </div>
                        <div className={ruolo=== 'inquilino' ? 'form-row-double': 'form-group'}>
                            <div className='form-group'>
                                <label className='form-label'>Ruolo Utente</label>
                                <select className='form-input' value={ruolo} onChange={(e) => {setRuolo(e.target.value); if(e.target.value==='proprietario'){setFacolta('');}}} required>
                                    <option value="inquilino">Inquilino</option>
                                    <option value="proprietario">Proprietario</option>
                                </select>
                            </div>
                            {ruolo==='inquilino' &&(
                            <div className='form-group'>
                                <label className='form-label'>Seleziona Facoltà</label>
                                <select className='form-input' value={facolta} onChange={(e)=> setFacolta(e.target.value)} required>
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
                            <label className='fomr-label'>Età</label>
                            <input type='number' min='0' placeholder='Inserisci la tua età' className='form-input' value={eta} onChange={(e)=> setEta(e.target.value)} required/>
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>Bio</label>
                            <input type='text' placeholder='Inserisci una breve descrizione di te' className='form-input' value={bio} onChange={(e)=> setBio(e.target.value)} required/>
                        </div>

                        <div className='form-group checkboxes-wrapper'>
                            {ruolo === 'inquilino' && (
                                    <div className='form-group checkboxes-wrapper'>
                                        <label className='form-label'>Tag e Preferenze</label>
                                        <div className='checkboxes-grid'>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value='Non Fumatore' checked={tags.includes('Non-Fumatori')} onChange={handleCheckboxChange}/><span>Non-Fumatori</span>
                                            </label>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value='Pet Friendly' checked={tags.includes('Pet Friendly')} onChange={handleCheckboxChange}/><span>Pet Friendly</span>
                                            </label>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value='Tranquillo' checked={tags.includes('Tranquillo')} onChange={handleCheckboxChange}/><span>Tranquillo</span>
                                            </label>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value='Eco-friendly' checked={tags.includes('Eco-friendly')} onChange={handleCheckboxChange}/><span>Eco-friendly</span>
                                            </label>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value='Luminoso' checked={tags.includes('Luminoso')} onChange={handleCheckboxChange}/><span>Luminoso</span>
                                            </label>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value='Terrazzo' checked={tags.includes('Terrazzo')} onChange={handleCheckboxChange}/><span>Terrazzo</span>
                                            </label>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value='Aria Condizionata' checked={tags.includes('Aria Condizionata')} onChange={handleCheckboxChange}/><span>Aria Condizionata</span>
                                            </label>
                                            <label className='checkbox-label'>
                                                <input type='checkbox' value='Lavastoviglie' checked={tags.includes('Lavastoviglie')} onChange={handleCheckboxChange}/><span>Lavastoviglie</span>
                                            </label>
                                        </div>
                                </div>)}
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
                    <button type='button' className='btn-social' onClick={LoginGoogle}><Globe color='blue'/><span className='social-label'>Google</span></button>
                    <button type='button' className='btn-social' onClick={LoginInsta}><CircleFadingPlus color='#e1306c'/><span className='social-label' style={{ fontWeight:600 }}>Instagram</span></button>
                </div>
            </div>
        </div>
    );
}

export default function Header({isLoggedIn, currentUser, onLogout, onLogin}){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialTab, setInitialTab] = useState('registrati');
    const [isNotifOpen, setIsNotifOpen]=useState(false);
    const openModal = (tab) =>{
        setInitialTab(tab);
        setIsModalOpen(true);
    };
    const location=useLocation();
    const navigate =useNavigate();

    // const [contacts, setContacts] = useState([]);

    // const updateLastMessage = (idMittente, nomeMittente, nuovoTesto, nuovoOrario) => {
    //     setContacts(prevContacts =>
    //         prevContacts.map(contact => {
    //             const exist= prevContacts.some(c=>c._id=== idMittente || c.id=== idMittente);
    //             if(exist){
    //                 const updated= prevContacts.map(c=>{
    //                     const currentCId=c._id|| c.id;
    //                     if(currentCId===idMittente){
    //                         return{...c,lastMsg: nuovoTesto, time:nuovoOrario};
    //                     }
    //                     return c;
    //                 });
    //                 const target=updated.find(c=>(c._id||c.id)===idMittente);
    //                 const filtered=updated.filter(c=>(c.id ||c._id)!== idMittente);
    //                 return[target,...filtered];
    //             }else{
    //                 return[{
    //                     _id:idMittente, name: nomeMittente, lastMsg: nuovoTesto, time: nuovoOrario}, ...prevContacts];
    //             }
    //         })
    //     );
    // };
     useEffect(()=>{
         if(currentUser){
             console.log('Utente loggato:', currentUser?.nome)
         }
     }, [currentUser]);

    // useEffect(() => {
    //     socket.on('ricevi_messaggio', (data) => {
    //         const orarioArrivo = data.createdAt
    //             ? new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    //             : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    //         updateLastMessage(data.testo, orarioArrivo);
    //     });

    //     return () => socket.off('ricevi_messaggio');
    // }, []);    
    
    return (
        <div>
        <header className='site-header font-sans'>
            <div className='header-logo' onClick={() => navigate('/')}><HouseHeartIcon/></div>
            
                {isLoggedIn ? (
                    <>
                        <nav className='header-navigation'>
                            <button className={`nav-item ${location.pathname === '/ricerca' ? 'active' :''}`} onClick={()=> navigate('/ricerca')}>Scopri</button>  
                            <button className={`nav-item ${location.pathname==='/chat' ? 'active':''}`} onClick={()=> navigate('/chat')}>Messaggi</button>
                            <button className={`nav-item ${location.pathname=== '/profilo' ? 'active': ''}`} onClick={()=> navigate('/profilo')}>Profilo</button>
                            <button className={`nav-item ${location.pathname=== '/area-riservata'? 'active':''}`} onClick={()=> navigate('/area-riservata')}>Area Riservata</button>
                        </nav>
                        
                        <div className='logged-in-actions'>
                            <button className="notification-btn" aria-label="Notifiche" onClick={()=> setIsNotifOpen(!isNotifOpen)}><BellRing size={20}/></button>
                            {isNotifOpen &&(
                                <div className='notif-dropdown'>
                                    <div className='notif-header'>
                                        <h4>Messaggi Recenti</h4>
                                    </div>
                                    
                                    {/* <div className='constacts-list'>
                                        {contacts.map(contact =>(
                                            <div key={contact.id} className={`contact-item ${contact.active ? 'active':''}`} onClick={()=>{ navigate('/chat'); setIsNotifOpen(false);}}>
                                                <div className='notif-avatar'><User size={40}/></div>
                                                <div className='notif-info'>
                                                    <div className='notif-top'>
                                                        <span className='notif-name'>{contact.name}</span>
                                                        <span className='notif-time'>{contact.time}</span>
                                                    </div>
                                                    <p className='notif-msg'>{contact.lastMsg}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div> */}
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
                onLoginSuccess={onLogin} />
        </div>
    );
}