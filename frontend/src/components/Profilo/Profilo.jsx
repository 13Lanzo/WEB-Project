import './Profilo.css';
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {User, BadgeCheck, Mail, BriefcaseBusiness, Search, PencilLine, LogOut, Grip } from 'lucide-react'

export default function Profilo({currentUser, onLogout}) {
    const navigate=useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    if (!currentUser) {
        return <div className='loading-container'><p>Caricamento profilo...</p></div>;
    }

    const isOwner = currentUser.ruolo === 'proprietario';
    const roleLabel = isOwner ? 'PROPRIETARIO' : 'CO-INQUILINO / STUDENTE';
    const nameToShow = `${currentUser.nome} ${currentUser.cognome || ''}`;
    const emailToShow = currentUser.email;
    const bioToShow = currentUser.bio || 'Nessuna biografia inserita. Personalizza il tuo profilo per farti conoscere!';
    const facultyToShow = currentUser.facolta || 'Non specificata';
    const statusToShow = isOwner ? 'PROPRIETARIO ATTIVO' : 'COINQUILINO ATTIVO';

    return(
        <div className='profilo-page font-sans'>
            <div className='profile-card-container'>
                <div className='profilo-header'>
                    <div className='profile-avatar'><User size={50} color='green'/></div>
                    <div className='profilo-info'>
                        <div className='profilo-name-row'>
                            <h2>{nameToShow}</h2>
                            <span className='badge-verified'><BadgeCheck/>VERIFICATO</span>
                            <span className='badge-role'>{roleLabel}</span>
                        </div>
                        <p className='profilo-email'><Mail size={15}/> {emailToShow}</p>
                        <p className='profilo-bio'>{bioToShow}</p>
                    </div>
                </div>
                <div className='profile-details-grid'>
                    {!isOwner && (
                        <div className='detail-box'>
                            <div className='detail-icon blue-icon'><BriefcaseBusiness/></div>
                            <div className='detail-text'>
                                <span className='detail-label'>FACOLTÀ / IMPIEGO</span>
                                <span className='detail-value'>{facultyToShow}</span>
                            </div>
                        </div>
                    )}
                    <div className='detail-box'>
                        <div className="detail-icon green-icon"><User/></div>
                        <div className="detail-text">
                            <span className="detail-label">STATO ACCOUNT</span>
                            <span className="detail-value">{statusToShow}</span>
                        </div>
                    </div>
                </div>
                <div className='profilo-cta-box'>
                    <div className='cta-texts'>
                        <h3>Pronto all'azione</h3>
                        <p>Spostati nella sezione corrispondente per operare sul network.</p>
                    </div>
                    {!isOwner ? (
                        <button className="btn-action btn-primary" onClick={() => navigate('/ricerca')}><Search/>CERCA UNA STANZA</button>
                    ) : (
                        <button className="btn-action btn-secondary" onClick={() => navigate('/area-riservata')}><Grip/>GESTISCI I MIEI ANNUNCI</button>
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