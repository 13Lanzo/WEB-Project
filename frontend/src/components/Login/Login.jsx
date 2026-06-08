import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CircleFadingPlus, Globe, CircleCheckBig } from 'lucide-react'

export default function Login({ onLoginSuccess }) {
    const [activeTab, setActiveTab] = useState('accedi');
    const navigate = useNavigate();
    
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
    
    // Inizializzato in minuscolo per evitare conflitti di validazione sul server
    const [ruolo, setRuolo] = useState('inquilino');

    const LoginGoogle = () => { window.open('https://www.google.com'); };
    const LoginInsta = () => { window.open('https://www.instagram.com'); };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
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

                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Errore durante la registrazione.');
                }

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                alert('Profilo creato con successo!!');
                onLoginSuccess(data.user);
                navigate('/profilo'); 
            } catch (err) {
                console.error('Errore registrazione:', err);
                setErrorMessage(err.message || 'Server irraggiungibile.');
            }
                
        } else {
            try {
                const payload = { email: email, password: password };

                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Email o password errate. Riprova!');
                }

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                onLoginSuccess(data.user);
                navigate('/area-riservata');
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
    
    return (
        <div className="auth-page-wrapper font-sans">
            <div className="auth-split-card">
                <div className="auth-left-promo">
                    <h2>Pronto per iniziare il tuo percorso?</h2>
                    <p className="promo-subtitle">Unisciti a oltre 50.000 studenti che hanno già trovato la loro casa ideale.</p>
                    
                    <ul className="promo-features-list">
                        <li><span className="check-circle-icon"><CircleCheckBig /></span> Verifica gratuita della mail universitaria</li>
                        <li><span className="check-circle-icon"><CircleCheckBig /></span> Contratti di affitto trasparenti e sicuri</li>
                        <li><span className="check-circle-icon"><CircleCheckBig /></span> Supporto dedicato h24</li>
                    </ul>
                </div>
                <div className="auth-right-form-box">
                    <div className="auth-tabs-container">
                        <button type="button" onClick={() => handleTabChange('registrati')} className={`auth-tab-btn ${activeTab === 'registrati' ? 'active' : ''}`}>Registrati</button>
                        <button type="button" onClick={() => handleTabChange('accedi')} className={`auth-tab-btn ${activeTab === 'accedi' ? 'active' : ''}`}>Accedi</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {errorMessage && <div className='errore'>{errorMessage}</div>}
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
                                <div className={ruolo === 'inquilino' ? 'form-row-double': 'form-group'}>
                                    <div className='form-group'>
                                        <label className='form-label'>Ruolo Utente</label>
                                        <select className='form-input' value={ruolo} onChange={(e) => {setRuolo(e.target.value); if(e.target.value==='proprietario'){setFacolta('');}}} required>
                                            <option value="inquilino">Inquilino</option>
                                            <option value="proprietario">Proprietario</option>
                                        </select>
                                    </div>
                                    {ruolo === 'inquilino' && (
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
                                </div>
                            </>
                        )}
                        
                        <div className='form-group'>
                            <label className='form-label'>Email Universitaria</label>
                            <input type="email" placeholder='inserisci email' className='form-input' value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>Password</label>
                            <input type='password' placeholder='........' className='form-input' value={password} onChange={(e)=> setPassword(e.target.value)} required/>
                        </div>
                        {activeTab === 'registrati' && (
                            <div className='form-group'>
                                <label className='form-label'>Conferma Password</label>
                                <input type='password' placeholder='Conferma password' className='form-input' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required/>
                            </div>
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
        </div>
    );
}