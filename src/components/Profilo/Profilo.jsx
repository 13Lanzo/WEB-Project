import './Profilo.css';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

export default function Profilo({onLogout}) {
    const navigate=useNavigate();
    const [isProprietario, setIsProprietario]=useState(false);
    // Dati fittizi per lo Studente
    const userStudente = {
        name: 'Giuseppe',
        initials: 'GI',
        email: 'prova@nome.it',
        roleLabel: 'CO-INQUILINO / STUDENTE',
        roleType: 'studente',
        bio: 'Sono uno studente, non fumatore, a cui piace la tranquillità',
        faculty: 'Informatica',
        status: 'COINQUILINO ATTIVO',
        verified: true
    };

    // Dati fittizi per il Proprietario
    const userProprietario = {
        name: 'Super Proprietario',
        initials: 'SU',
        email: 'prop@host.it',
        roleLabel: 'PROPRIETARIO',
        roleType: 'proprietario',
        bio: 'Nessuna biografia inserita. Personalizza il tuo profilo per trovare coinquilini compatibili!',
        status: 'PROPRIETARIO ATTIVO',
        verified: true
    };
    //toggle per vedere le due visualizzazioni DA ELIMINARE
    const currentUser=isProprietario ? userProprietario: userStudente;

    const handleLogout=()=>{
        if(onLogout) onLogout;
        navigate('/');
    };

    return(
        <div className='profilo-page font-sans'>
            {/*DA ELIMINARE*/}
            <div className='test-controls'>
                <button onClick={()=> setIsProprietario(!isProprietario)}>Cambia {isProprietario ? 'Proprietario' : 'Studente'}</button>
            </div>
            <div className='profile-card-container'>
                <div className='profilo-header'>
                    <div className='profile-avatar'>
                    {/*metti un icona*/}
                    </div>
                    <div className='profilo-info'>
                        <div className='profilo-name-row'>
                            <h2>{currentUser.name}</h2>
                            {currentUser.verified &&(
                                <span className='badge-verified'>
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                        VERIFICATO</span>
                            )}
                            <span className='badge-role'>{currentUser.roleLabel}</span>
                        </div>
                        <p className='profilo-email'>✉ {currentUser.email}</p>
                        <p className='profilo-bio'>{currentUser.bio}</p>
                    </div>
                </div>
                <div className='profile-details-grid'>
                    {currentUser.roleType !== 'proprietario' && (
                        <div className='detail-box'>
                            <div className='detail-icon blue-icon'>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                            </div>
                            <div className='detail-text'>
                                <span className='detail-label'>IMPIEGO</span>
                                <span className='detail-value'>{currentUser.faculty}</span>
                            </div>
                        </div>
                    )}
                    <div className='detail-box'>
                        <div className="detail-icon green-icon">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div className="detail-text">
                            <span className="detail-label">STATO ACCOUNT</span>
                            <span className="detail-value">{currentUser.status}</span>
                        </div>
                    </div>
                </div>
                <div className='profilo-cta-box'>
                    <div className='cta-texts'>
                        <h3>Pronto all'azione</h3>
                        <p>Spostati nella sezione corrispondente per operare sul network.</p>
                    </div>
                    {currentUser.roleType === 'studente'?(
                        <button className="btn-action btn-primary" onClick={() => navigate('/ricerca')}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        CERCA UNA STANZA</button>
                    ):(
                        <button className="btn-action btn-secondary" onClick={() => navigate('/annunci')}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                            GESTISCI I MIEI ANNUNCI</button>
                    )}
                </div>
                <div className="profilo-footer-actions">
                    <button className="btn-modifica">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    MODIFICA DETTAGLI</button>
                    <button className="btn-disconnetti" onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    DISCONNETTI ACCOUNT</button>
                </div>
            </div>    
        </div>            
    );
}