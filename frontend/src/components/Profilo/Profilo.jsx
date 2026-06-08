import './Profilo.css';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {User, BadgeCheck, Mail, BriefcaseBusiness, Search, PencilLine, LogOut, Grip } from 'lucide-react'

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

    return(
        <div className='profilo-page font-sans'>
            {/*DA ELIMINARE*/}
            <div className='test-controls'>
                <button onClick={()=> setIsProprietario(!isProprietario)}>Cambia {isProprietario ? 'Proprietario' : 'Studente'}</button>
            </div>
            <div className='profile-card-container'>
                <div className='profilo-header'>
                    <div className='profile-avatar'><User size={50} color='green'/></div>
                    <div className='profilo-info'>
                        <div className='profilo-name-row'>
                            <h2>{currentUser.name}</h2>
                            {currentUser.verified &&(
                                <span className='badge-verified'><BadgeCheck/>VERIFICATO</span>
                            )}
                            <span className='badge-role'>{currentUser.roleLabel}</span>
                        </div>
                        <p className='profilo-email'><Mail size={15}/> {currentUser.email}</p>
                        <p className='profilo-bio'>{currentUser.bio}</p>
                    </div>
                </div>
                <div className='profile-details-grid'>
                    {currentUser.roleType !== 'proprietario' && (
                        <div className='detail-box'>
                            <div className='detail-icon blue-icon'><BriefcaseBusiness/></div>
                            <div className='detail-text'>
                                <span className='detail-label'>IMPIEGO</span>
                                <span className='detail-value'>{currentUser.faculty}</span>
                            </div>
                        </div>
                    )}
                    <div className='detail-box'>
                        <div className="detail-icon green-icon"><User/></div>
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
                        <button className="btn-action btn-primary" onClick={() => navigate('/ricerca')}><Search/>CERCA UNA STANZA</button>
                    ):(
                        <button className="btn-action btn-secondary" onClick={() => navigate('/annunci')}><Grip/>GESTISCI I MIEI ANNUNCI</button>
                    )}
                </div>
                <div className="profilo-footer-actions">
                    <button className="btn-modifica"><PencilLine/> MODIFICA DETTAGLI</button>
                    <button className="btn-disconnetti" onClick={()=>{onLogout(); navigate('/')}}><LogOut/>DISCONNETTI ACCOUNT</button>
                </div>
            </div>    
        </div>            
    );
}