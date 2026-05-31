import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Header.css'
import {HouseHeartIcon, BellRing, CircleFadingPlus, GlobeCheck, User, MoveRight} from 'lucide-react'


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
    const LoginGoogle =()=>{
        window.open('https://www.google.com');
    };
    const LoginInsta =()=>{
        window.open('https://www.instagram.com');
    };

    //credenziali fittizie per visualizzare frontend da eliminare
    const EMAIL='cioccafra@gmail.com';
    const PW='password5';
    
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
            alert('Profilo creato con successo!!');
            onLoginSuccess();
            navigate('/profilo');
            onClose();
            //credenziali fittizie da eliminare  
        } else{
            if(email=== EMAIL && password===PW){
                onLoginSuccess();
                onClose();
            }else{
                setErrorMessage('Email o password errate. Riprova!');
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
    const contacts = [
        { id: 1, name: "Alex Chen", lastMsg: "Sounds good! Let's check the room to...", time: "10:43 AM", active: true },
        { id: 2, name: "Sarah Miller", lastMsg: "Are you okay with pets in the apartment?", time: "Yesterday" },
        { id: 3, name: "Jordan Smith", lastMsg: "I sent the lease agreement over to your...", time: "Tue" },
    ];
    return (
        <div>
        <header className='site-header font-sans'>
            <div className='header-logo'><HouseHeartIcon/></div>
            
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
                                    <div className='notif-list'>
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
