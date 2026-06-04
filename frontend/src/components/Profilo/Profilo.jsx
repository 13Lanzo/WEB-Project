import './Profilo.css';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {User, BadgeCheck, Mail, BriefcaseBusiness, Search, PencilLine, LogOut, Grip } from 'lucide-react'

export default function Profilo({onLogout}) {
    const navigate=useNavigate();
    
    // Recupera l'utente corrente da localStorage
    const currentUserStr = localStorage.getItem('user');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        fetch(`http://10.31.99.48:5000/api/users/${currentUser.id}/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.success) {
                setUser(resData.dati);
            }
            setLoading(false)
        })
        .catch(err => {
            console.error("Errore nel recupero dei dettagli utente:", err);
            setLoading(false);
        });
    }, [currentUser?.id]);

    if (loading) {
        return (
            <div className='profilo-page font-sans' style={{ textAlign: 'center', padding: '100px 20px', color: '#6b7280' }}>
                <h2>Caricamento profilo in corso...</h2>
            </div>
        );
    }

    if (!currentUser || !user) {
        return (
            <div className='profilo-page font-sans' style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Effettua l'accesso per visualizzare il tuo profilo.</h2>
                <button className='btn-action btn-primary' onClick={() => navigate('/')} style={{ marginTop: '20px', margin: '20px auto' }}>Torna alla Home</button>
            </div>
        );
    }

    const roleLabel = user.ruolo === 'proprietario' ? 'PROPRIETARIO' : 'CO-INQUILINO / STUDENTE';
    const statusLabel = user.ruolo === 'proprietario' ? 'PROPRIETARIO ATTIVO' : 'COINQUILINO ATTIVO';
    const bioText = user.bio || "Nessuna biografia inserita. Personalizza il tuo profilo per farti conoscere!";

    return(
        <div className='profilo-page font-sans'>
            <div className='profile-card-container'>
                <div className='profilo-header'>
                    <div className='profile-avatar'><User size={50} color='green'/></div>
                    <div className='profilo-info'>
                        <div className='profilo-name-row'>
                            <h2>{user.nome} {user.cognome}</h2>
                            <span className='badge-verified'><BadgeCheck/>VERIFICATO</span>
                            <span className='badge-role'>{roleLabel}</span>
                        </div>
                        <p className='profilo-email'><Mail size={15}/> {user.email}</p>
                        <p className='profilo-bio'>{bioText}</p>
                    </div>
                </div>
                <div className='profile-details-grid'>
                    {user.ruolo !== 'proprietario' && (
                        <div className='detail-box'>
                            <div className='detail-icon blue-icon'><BriefcaseBusiness/></div>
                            <div className='detail-text'>
                                <span className='detail-label'>ETÀ / PREFERENZE</span>
                                <span className='detail-value' style={{ fontSize: '13px' }}>
                                    {user.eta} anni • {user.tagPreferenze && user.tagPreferenze.length > 0 ? user.tagPreferenze.join(', ') : 'Nessuna preferenza'}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className='detail-box'>
                        <div className="detail-icon green-icon"><User/></div>
                        <div className="detail-text">
                            <span className="detail-label">STATO ACCOUNT</span>
                            <span className="detail-value">{statusLabel}</span>
                        </div>
                    </div>
                </div>
                <div className='profilo-cta-box'>
                    <div className='cta-texts'>
                        <h3>Pronto all'azione</h3>
                        <p>Spostati nella sezione corrispondente per operare sul network.</p>
                    </div>
                    {user.ruolo === 'studente' ?(
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