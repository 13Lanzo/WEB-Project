import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {CircleFadingPlus, GlobeCheck, CircleCheckBig } from 'lucide-react'

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
    const [faculty, setFaculty]=useState('');
    const [role, setRole]=useState('');
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
            navigate('/profilo');
            onLoginSuccess();
           
            //credenziali fittizie da eliminare  
        } else{
            if(email=== EMAIL && password===PW){
                navigate('/profilo');
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
                            <span className="check-circle-icon"><CircleCheckBig /></span> 
                            Verifica gratuita della mail universitaria</li>
                        <li>
                            <span className="check-circle-icon"><CircleCheckBig /></span> 
                            Contratti di affitto trasparenti e sicuri</li>
                        <li>
                            <span className="check-circle-icon"><CircleCheckBig /></span> 
                            Supporto dedicato h24</li>
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
                        <button type="button" onClick={() => handleTabChange('accedi')} className={`auth-tab-btn ${activeTab === 'accedi' ? 'active' : ''}`}>Accedi</button>
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
                        <button type='button' className='btn-social' onClick={LoginGoogle}><GlobeCheck color='blue'/><span className='social-label'>Google</span>
                        </button>
                        <button type='button' className='btn-social' onClick={LoginInsta}><CircleFadingPlus color='#e1306c'/><span className='social-label' style={{ fontWeight:600 }}>Instagram</span></button>
                </div>
                </div>

            </div>
        </div>
    );
}