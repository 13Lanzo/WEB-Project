import './Profilo.css';
import { useNavigate } from 'react-router-dom';
import { User, BadgeCheck, Mail, BriefcaseBusiness, Search, PencilLine, LogOut, Grip, Tag } from 'lucide-react';

export default function Profilo({ currentUser, onLogout }) {
    const navigate = useNavigate();

    // Se non c'è un utente loggato, redirect al login
    if (!currentUser) {
        return (
            <div className='profilo-page font-sans' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <h2>Accesso richiesto</h2>
                <p>Devi effettuare il login per vedere il tuo profilo.</p>
                <button className='btn-action btn-primary' onClick={() => navigate('/login')}>
                    <Search /> VAI AL LOGIN
                </button>
            </div>
        );
    }

    const isProprietario = currentUser.ruolo === 'proprietario';

    return (
        <div className='profilo-page font-sans'>
            <div className='profile-card-container'>
                <div className='profilo-header'>
                    <div className='profile-avatar'><User size={50} color='green' /></div>
                    <div className='profilo-info'>
                        <div className='profilo-name-row'>
                            <h2>{currentUser.nome} {currentUser.cognome}</h2>
                            <span className='badge-verified'><BadgeCheck />VERIFICATO</span>
                            <span className='badge-role'>
                                {isProprietario ? 'PROPRIETARIO' : 'INQUILINO'}
                            </span>
                        </div>
                        <p className='profilo-email'><Mail size={15} /> {currentUser.email}</p>
                        <p className='profilo-bio'>
                            {currentUser.bio && currentUser.bio.trim() !== ''
                                ? currentUser.bio
                                : 'Nessuna biografia inserita.'}
                        </p>
                    </div>
                </div>

                <div className='profile-details-grid'>
                    {/* Facoltà — solo per inquilini */}
                    {!isProprietario && currentUser.facolta && (
                        <div className='detail-box'>
                            <div className='detail-icon blue-icon'><BriefcaseBusiness /></div>
                            <div className='detail-text'>
                                <span className='detail-label'>FACOLTÀ / IMPIEGO</span>
                                <span className='detail-value'>{currentUser.facolta}</span>
                            </div>
                        </div>
                    )}
                    {/* Età */}
                    {currentUser.eta && (
                        <div className='detail-box'>
                            <div className='detail-icon green-icon'><User /></div>
                            <div className='detail-text'>
                                <span className='detail-label'>ETÀ</span>
                                <span className='detail-value'>{currentUser.eta} anni</span>
                            </div>
                        </div>
                    )}
                    {/* Stato account */}
                    <div className='detail-box'>
                        <div className="detail-icon green-icon"><User /></div>
                        <div className="detail-text">
                            <span className="detail-label">STATO ACCOUNT</span>
                            <span className="detail-value">
                                {isProprietario ? 'PROPRIETARIO ATTIVO' : 'COINQUILINO ATTIVO'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tag preferenze — solo per inquilini */}
                {!isProprietario && currentUser.tagPreferenze && currentUser.tagPreferenze.length > 0 && (
                    <div className='profilo-tags-section'>
                        <div className='detail-icon blue-icon' style={{ marginBottom: '8px' }}>
                            <Tag size={16} /> <span style={{ fontSize: '0.8rem', marginLeft: '4px', fontWeight: 600 }}>LE MIE PREFERENZE</span>
                        </div>
                        <div className='tags-flex-profilo'>
                            {currentUser.tagPreferenze.map((tag, i) => (
                                <span key={i} className='profilo-tag-pill'>{tag}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className='profilo-cta-box'>
                    <div className='cta-texts'>
                        <h3>Pronto all'azione</h3>
                        <p>Spostati nella sezione corrispondente per operare sul network.</p>
                    </div>
                    {isProprietario ? (
                        <button className="btn-action btn-secondary" onClick={() => navigate('/annunci')}>
                            <Grip />GESTISCI I MIEI ANNUNCI
                        </button>
                    ) : (
                        <button className="btn-action btn-primary" onClick={() => navigate('/ricerca')}>
                            <Search />CERCA UNA STANZA
                        </button>
                    )}
                </div>

                <div className="profilo-footer-actions">
                    {/* Modifica dettagli — rimane fittizio come richiesto */}
                    <button className="btn-modifica"><PencilLine /> MODIFICA DETTAGLI</button>
                    <button className="btn-disconnetti" onClick={() => { onLogout(); navigate('/'); }}>
                        <LogOut />DISCONNETTI ACCOUNT
                    </button>
                </div>
            </div>
        </div>
    );
}