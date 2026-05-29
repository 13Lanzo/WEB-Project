import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login({onLoginSuccess}) {
    const [activeTab, setActiveTab] = useState();
    const navigate = useNavigate();
    const [name, setName]=useState('');
    const [lastname, setLastname]=useState('');
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
            //credenziali fittizie da eliminare  
        } else{
            if(email=== EMAIL && password===PW){
                onLoginSuccess();
                navigate('/profilo');
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
    

    return(
        <div className="auth-page-wrapper font-sans">
            <div className="auth-split-card">
                <div className="auth-left-promo">
                    <h2>Pronto per iniziare il tuo percorso?</h2>
                    <p className="promo-subtitle">
                        Unisciti a oltre 50.000 studenti che hanno già trovato la loro casa ideale.
                    </p>
                    
                    <ul className="promo-features-list">
                        <li>
                            <span className="check-circle-icon">✓</span> 
                            Verifica gratuita della mail universitaria
                        </li>
                        <li>
                            <span className="check-circle-icon">✓</span> 
                            Contratti di affitto trasparenti e sicuri
                        </li>
                        <li>
                            <span className="check-circle-icon">✓</span> 
                            Supporto dedicato h24
                        </li>
                    </ul>
                </div>
                <div className="auth-right-form-box">
                    <div className="auth-tabs-container">
                        <button 
                            type="button" 
                            onClick={() => handleTabChange('registrati')} 
                            className={`auth-tab-btn ${activeTab === 'registrati' ? 'active' : ''}`}
                        >
                            Registrati
                        </button>
                        <button 
                            type="button" 
                            onClick={() => handleTabChange('accedi')} 
                            className={`auth-tab-btn ${activeTab === 'accedi' ? 'active' : ''}`}
                        >
                            Accedi
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div className='errore'>{errorMessage}</div>
                    )}
                    {activeTab === 'registrati' && (
                        <>
                        <div className='form-group'>
                            <label className='form-label'>Nome</label>
                            <input type='text' placeholder='Inserisci il tuo nome' className='form-input' value={name} onChange={(e)=>setName(e.target.value)} required/>
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Cognome</label>
                            <input type='text' placeholder='Inserisci il tuo cognome' className='form-input' value={lastname} onChange={(e)=>setLastname(e.target.value)} required/>
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
        </div>
    );
}