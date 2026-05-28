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
            //credenziali fittizie da eliminare  
        } else{
            if(email=== EMAIL && password===PW){
                onLoginSuccess();
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

                    <form onSubmit={handleSubmit} className="auth-actual-form">
                        {errorMessage && (
                            <div className="auth-error-alert">{errorMessage}</div>
                        )}
                        
                        {activeTab === 'registrati' && (
                            <div className="auth-form-row">
                                <div className="form-group">
                                    <label className="form-label">Nome</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nome" 
                                        className="form-input" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cognome</label>
                                    <input 
                                        type="text" 
                                        placeholder="Cognome" 
                                        className="form-input" 
                                        value={lastname} 
                                        onChange={(e) => setLastname(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email Universitaria</label>
                            <input 
                                type="email" 
                                placeholder="nome.cognome@universita.it" 
                                className="form-input" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <span className="form-input-subtext">Usa la tua mail .edu per ottenere il badge verificato</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="form-input" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        {activeTab === 'registrati' && (
                            <div className="form-group">
                                <label className="form-label">Conferma Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Conferma password" 
                                    className="form-input" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        )}

                        <button type="submit" className="auth-btn-submit">
                            {activeTab === 'registrati' ? 'Crea il tuo profilo' : 'Accedi al tuo profilo'}
                        </button>
                    </form>
                    
                    <div className="auth-divider-box">
                        <div className="auth-divider-line"></div>
                        <span className="auth-divider-text">OPPURE</span>
                        <div className="auth-divider-line"></div>
                    </div>

                    <div className="auth-social-row">
                        <button type="button" className="auth-btn-social" onClick={LoginGoogle}>
                            <svg className="social-svg-icon" viewBox="0 0 24 24" width="18" height="18">
                                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.091 14.974 0 12 0 7.354 0 3.373 2.667 1.432 6.545l3.834 3.22z"/>
                                <path fill="#4285F4" d="M16.04 15.345c-1.077.736-2.423 1.164-4.04 1.164a7.077 7.077 0 0 1-6.694-4.855l-3.834 3.22C3.373 21.333 7.354 24 12 24c3.127 0 6.082-1.127 8.273-3.218l-4.233-3.437z"/>
                                <path fill="#FBBC05" d="M5.306 11.655a6.974 6.974 0 0 1 0-2.31l-3.834-3.22A11.932 11.932 0 0 0 0 12c0 2.127.564 4.136 1.472 5.873l3.834-3.218z"/>
                                <path fill="#34A853" d="M23.491 9.818H12V14.4h6.618a5.66 5.66 0 0 1-2.455 3.709l4.233 3.437C22.873 19.345 24 15.909 24 12c0-.764-.073-1.49-.218-2.182z"/>
                            </svg>
                            <span className="social-txt">Google</span>
                        </button>
                        
                        <button type="button" className="auth-btn-social" onClick={LoginInsta}>
                            <svg className="social-svg-icon fb-color" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span className="social-txt">Instagram</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}