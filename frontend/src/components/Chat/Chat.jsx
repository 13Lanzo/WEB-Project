import './Chat.css';
import { useEffect, useState, useRef } from 'react';
import { User, Search, GripHorizontal, Laugh, Mic, Plus, SendHorizonal, CheckCheck, Ellipsis } from 'lucide-react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const API = 'http://localhost:5000/api';

// Socket condiviso — inizializzato una volta sola
let socket = null;

export default function Chat({ currentUser }) {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Connetti Socket.IO e registra l'utente
    useEffect(() => {
        if (!currentUser) return;

        if (!socket) {
            socket = io('http://localhost:5000');
        }

        socket.emit('registra_utente', currentUser.id);

        // Ascolto messaggi in tempo reale
        socket.on('ricevi_messaggio', (data) => {
            // Se il messaggio è della conversazione attiva, aggiungilo
            setMessageList(prev => {
                const currentActiveId = activeContact?._id || activeContact?.utente?._id;
                if (data.mittenteId === currentActiveId || data.destinatarioId === currentActiveId) {
                    return [...prev, {
                        mittente: { _id: data.mittenteId, nome: data.mittenteNome },
                        destinatario: { _id: data.destinatarioId },
                        testo: data.testo,
                        createdAt: data.createdAt || new Date().toISOString()
                    }];
                }
                return prev;
            });

            // Aggiorna la lista conversazioni
            fetchConversations();
        });

        return () => {
            socket.off('ricevi_messaggio');
        };
    }, [currentUser, activeContact]);

    // Carica le conversazioni esistenti
    const fetchConversations = async () => {
        if (!currentUser) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/messages/conversations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            setConversations(data.dati || []);
        } catch { /* silenzioso */ }
    };

    useEffect(() => {
        fetchConversations();
    }, [currentUser]);

    // Gestione apertura chat diretta da /dettagli (passiamo l'utente via location.state)
    useEffect(() => {
        if (location.state?.chatWith) {
            const utente = location.state.chatWith;
            setActiveContact({ utente, ultimoMessaggio: '', nonLetti: 0 });
        }
    }, [location.state]);

    // Carica storico messaggi quando cambia il contatto attivo
    useEffect(() => {
        const conChiId = activeContact?.utente?._id || activeContact?._id;
        if (!conChiId || !currentUser) return;

        setLoading(true);
        const token = localStorage.getItem('token');

        fetch(`${API}/messages/${conChiId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                setMessageList(Array.isArray(data) ? data : []);
                // Segna come letti
                fetch(`${API}/messages/read/${conChiId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` }
                }).catch(() => { });
            })
            .catch(() => setMessageList([]))
            .finally(() => setLoading(false));
    }, [activeContact, currentUser]);

    // Scroll automatico ai messaggi più recenti
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    const sendMessage = async () => {
        const conChiId = activeContact?.utente?._id || activeContact?._id;
        if (!message.trim() || !conChiId || !currentUser) return;

        const token = localStorage.getItem('token');

        try {
            // Salva nel DB
            const res = await fetch(`${API}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ destinatarioId: conChiId, testo: message.trim() })
            });

            if (!res.ok) return;
            const data = await res.json();

            const nuovoMsg = data.dati;

            // Aggiunge messaggio alla lista locale
            setMessageList(prev => [...prev, nuovoMsg]);

            // Invia via socket per real-time al destinatario
            socket?.emit('invia_messaggio', {
                mittenteId: currentUser.id,
                destinatarioId: conChiId,
                testo: message.trim(),
                mittenteNome: currentUser.nome,
                createdAt: new Date().toISOString()
            });

            setMessage('');
            fetchConversations();
        } catch (e) {
            console.error('Errore invio messaggio:', e);
        }
    };

    const formatOrario = (dateStr) => {
        try {
            const d = new Date(dateStr);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        } catch {
            return '';
        }
    };

    const contactName = (conv) => {
        const u = conv.utente;
        if (!u) return 'Utente';
        return `${u.nome || ''} ${u.cognome || ''}`.trim();
    };

    if (!currentUser) {
        return (
            <div className='chat-page' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Accesso richiesto</h2>
                    <p>Devi essere loggato per accedere alla chat.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='chat-page'>
            <div className='chat-container'>
                {/* Sidebar conversazioni */}
                <aside className='chat-sidebar'>
                    <div className='sidebar-header'>
                        <div className="search-bar">
                            <span className='icon'><Search /></span>
                            <input type='text' placeholder='Cerca conversazioni...' />
                        </div>
                        <button className='filter-btn'><GripHorizontal /></button>
                    </div>

                    <div className='constacts-list'>
                        {conversations.length === 0 ? (
                            <div style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center' }}>
                                Nessuna conversazione ancora.<br />
                                <small>Scrivi a qualcuno dalla pagina di una stanza!</small>
                            </div>
                        ) : (
                            conversations.map((conv, idx) => {
                                const uid = conv.utente?._id;
                                const activeId = activeContact?.utente?._id || activeContact?._id;
                                const isActive = uid === activeId;
                                return (
                                    <div key={uid || idx}
                                        className={`contact-item ${isActive ? 'active' : ''}`}
                                        onClick={() => setActiveContact(conv)}>
                                        <div className='avatar-small'><User size={40} /></div>
                                        <div className='contact-info'>
                                            <div className='contact-top'>
                                                <span className='contact-name'>{contactName(conv)}</span>
                                                <span className='contact-time'>{formatOrario(conv.ultimoOrario)}</span>
                                            </div>
                                            <p className='contact-msg'>{conv.ultimoMessaggio || '...'}</p>
                                        </div>
                                        {conv.nonLetti > 0 && (
                                            <span className='unread-badge'>{conv.nonLetti}</span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* Area chat principale */}
                <main className='chat-main'>
                    {!activeContact ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
                            <Ellipsis size={48} />
                            <p style={{ marginTop: '1rem' }}>Seleziona una conversazione</p>
                        </div>
                    ) : (
                        <>
                            <header className='chat-header'>
                                <div className='header-user'>
                                    <div className='avatar-medium'><User size={40} /></div>
                                    <div>
                                        <h4>{contactName(activeContact)}</h4>
                                        <span className='status'>Online</span>
                                    </div>
                                </div>
                                <div className='header-actions'>
                                    <button className='filter-btn header actions'><Ellipsis /></button>
                                </div>
                            </header>

                            <div className='messages-area'>
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>Caricamento messaggi...</div>
                                ) : messageList.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        Nessun messaggio. Inizia la conversazione!
                                    </div>
                                ) : (
                                    messageList.map((msg, index) => {
                                        const isMe = msg.mittente?._id?.toString() === currentUser.id ||
                                            msg.mittente === currentUser.id;
                                        return (
                                            <div key={index} className={`msg-wrapper ${isMe ? 'sent' : 'received'}`}>
                                                {!isMe && <div className='avatar-msg'><User /></div>}
                                                <div className='msg-bubble'>
                                                    <p>{msg.testo}</p>
                                                    <span className='msg-time'>
                                                        {formatOrario(msg.createdAt)}
                                                        {isMe && <CheckCheck size={14} />}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <footer className='chat-input-container'>
                                <div className='input-actions'>
                                    <button className='action-btn'><Plus /></button>
                                    <button className='action-btn'><Laugh /></button>
                                </div>
                                <input
                                    type='text'
                                    placeholder='Scrivi un messaggio...'
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                                />
                                <button className='send-btn' onClick={sendMessage}>
                                    {message.length > 0 ? <SendHorizonal /> : <Mic />}
                                </button>
                            </footer>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}