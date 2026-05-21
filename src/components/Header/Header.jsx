import { useState} from 'react';
import '/src/components/Header/Header.css';


function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const apriLogin= () => setIsLoginOpen(true);
    const chiudiLogin=()=> setIsLoginOpen(false);

    const [isRegisterOpen, setIsRegisterOpen] =useState(false);
    const apriRegister= () => setIsRegisterOpen(true);
    const chiudiRegister= () => setIsRegisterOpen(false);

    return(
        <>
            <header className="main-header">
                <div className='logo'>
                    <h1>Tinder</h1>
                </div>
                <div className="auth-buttons">
                    {/*per cambiare stato al click */}
                    <button onClick={apriLogin} className='login-btn'>Accedi</button>
                    <button onClick={apriRegister} className='register-btn'>Registrati</button>
                </div>
            </header>

            {/*se è true apri il modale*/}
            {isLoginOpen && (
                    <div className='modal-overlay'>
                        <div className='modal-content'>
                            <h2 color='#64c'> Accedi al tuo account</h2>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder='Email' required />
                                <input type="password" placeholder='Password' required hidden='' />
                                <button type="submit" className="submit-btn">Accedi</button>
                            </form>
                            <button onClick={chiudiLogin} className='close-btn'>Chiudi</button>
                        </div>
                    </div>
                
            )}

            {isRegisterOpen && (
                    <div className='modal-overlay'>
                        <div className='modal-content'>
                            <h2 color='viola' >Registrati</h2>
                            <form onSubmit={(e)=> e.preventDefault()}>
                                <input type='name' placeholder='Name'/>
                                <input type='cognome' placeholder='Cognome'/>
                                <input type='email' placeholder='Email'/>
                                <input type='password' placeholder='Password' hidden='' />
                                <input type='password' placeholder='Conferma password' hidden='' />
                                <button type='submit' className='submit-btn'>Iscrivimi</button>
                            </form>
                            <button onClick={chiudiRegister} className='close-btn'>Esci</button>
                        </div>
                    </div>
            )}
        </>
    )
}

export default Header