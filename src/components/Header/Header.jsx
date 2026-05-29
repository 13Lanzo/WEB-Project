import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Header.css'

function Modale({ isOpen, onClose, initialTab, onLoginSuccess=false}) {
    const [activeTab, setActiveTab] = useState(initialTab);
    
    const [name, setName]=useState('');
    const [lastname, setLastname]=useState('');
    const [faculty, setFaculty]=useState('');
    const [role, setRole]=useState('');
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
        <div className="modal-backdrop font-sas">
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
                        <label className='form-label'>Email Universitaria</label>
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
                    <button type='button' className='btn-social' onClick={LoginGoogle}>
                        <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18">
                            <path
                                fill="#EA4335"
                                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.091 14.974 0 12 0 7.354 0 3.373 2.667 1.432 6.545l3.834 3.22z"/>
                            <path
                                fill="#4285F4"
                                d="M16.04 15.345c-1.077.736-2.423 1.164-4.04 1.164a7.077 7.077 0 0 1-6.694-4.855l-3.834 3.22C3.373 21.333 7.354 24 12 24c3.127 0 6.082-1.127 8.273-3.218l-4.233-3.437z"/>
                            <path
                                fill="#FBBC05"
                                d="M5.306 11.655a6.974 6.974 0 0 1 0-2.31l-3.834-3.22A11.932 11.932 0 0 0 0 12c0 2.127.564 4.136 1.472 5.873l3.834-3.218z"/>
                            <path
                                fill="#34A853"
                                d="M23.491 9.818H12V14.4h6.618a5.66 5.66 0 0 1-2.455 3.709l4.233 3.437C22.873 19.345 24 15.909 24 12c0-.764-.073-1.49-.218-2.182z"/>
                        </svg>
                        <span className='social-label'>Google</span>
                    </button>
                    <button type='button' className='btn-social' onClick={LoginInsta}>
                        <svg className="social-icon insta-color" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                        <span className='social-label' style={{ fontWeight:600 }}>Instagram</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Header({isLoggedIn, onLogout, onLogin}){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialTab, setInitialTab] = useState('registrati');

    const openModal = (tab) =>{
        setInitialTab(tab);
        setIsModalOpen(true);
    };
    const [activeLink, setActiveLink]=useState('Scopri');
    const navigate =useNavigate();
    
    return (
        <div>
        <header className='site-header font-sans'>
            <div className='header-logo'>LOGO</div>
            
                {/*rendering condizionale per vedere lo stato attivo del log*/}
                {isLoggedIn ? (
                    <>
                        <nav className='header-navigation'>
                            <button className={`nav-item ${activeLink=== 'Scopri' ? 'active' :''}`} onClick={()=> {setActiveLink('Scopri'); navigate('/ricerca');}}>Scopri</button>  
                            <button className={`nav-item ${activeLink=== 'Messaggi'? 'active':''}`} onClick={()=> {setActiveLink('Messaggi'); navigate('/chat');}}>Messaggi</button>
                            <button className={`nav-item ${activeLink=== 'Profilo' ? 'active': ''}`} onClick={()=> {setActiveLink('Profilo'); navigate('/profilo');}}>Profilo</button>
                        </nav>
                        
                        <div className='logged-in-actions'>
                            <button className="notification-btn" aria-label="Notifiche">
                                {/*da sostituire con icona*/}
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </button>
                            <button className='btn-logout' onClick={()=>{onLogout(), navigate('/')}}>Logout</button>
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
