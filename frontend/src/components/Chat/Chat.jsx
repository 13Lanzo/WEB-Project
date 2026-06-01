import './Chat.css'
import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { User, Search, GripHorizontal, Laugh, Mic, Plus, SendHorizonal, PhoneForwarded, Video, CheckCheck, Ellipsis } from 'lucide-react'
import socket from '../../socket'

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [otherIsTyping, setOtherIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const location = useLocation();
    const contactToChatWith = location.state;

    // Recupera l'utente corrente da localStorage
    const currentUserStr = localStorage.getItem('user');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    const myId = currentUser ? currentUser.id : null;

    // 1. Carica l'elenco dei contatti (gli altri utenti registrati nel DB)
    useEffect(() => {
        if (!myId) return;

        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/users/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.success) {
                // Esclude l'utente stesso dalla lista
                const otherUsers = resData.dati.filter(u => u._id !== myId);
                
                let mappedContacts = otherUsers.map(user => ({
                    id: user._id,
                    name: `${user.nome} ${user.cognome}`,
                    lastMsg: "Nessun messaggio",
                    time: "",
                    active: false
                }));

                // Se arriviamo da un link "Contatta" con dati in location.state
                if (contactToChatWith && contactToChatWith.contactId) {
                    const exists = mappedContacts.find(c => c.id === contactToChatWith.contactId);
                    if (exists) {
                        mappedContacts = mappedContacts.map(c => ({
                            ...c,
                            active: c.id === contactToChatWith.contactId
                        }));
                        setActiveContact(exists);
                    } else {
                        const newContact = {
                            id: contactToChatWith.contactId,
                            name: contactToChatWith.contactName || "Utente",
                            lastMsg: "Nessun messaggio",
                            time: "",
                            active: true
                        };
                        mappedContacts = [newContact, ...mappedContacts];
                        setActiveContact(newContact);
                    }
                } else if (mappedContacts.length > 0) {
                    mappedContacts[0].active = true;
                    setActiveContact(mappedContacts[0]);
                }

                setContacts(mappedContacts);
            }
        })
        .catch(err => console.error("Errore nel caricamento dei contatti:", err));
    }, [contactToChatWith, myId]);

    // 2. Carica la cronologia chat quando cambia il contatto attivo
    useEffect(() => {
        if (!activeContact || !myId) return;

        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/messages/${myId}/messages/${activeContact.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                const history = data.map(msg => ({
                    author: typeof msg.mittente === 'object' ? msg.mittente._id : msg.mittente,
                    text: msg.testo,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    letto: msg.letto
                }));
                setMessageList(history);

                // Segnala al server che abbiamo letto i messaggi di questo contatto
                socket.emit("segna_letti", { mittenteId: activeContact.id });
            }
        })
        .catch(err => console.error("Errore nel caricamento della cronologia:", err));
    }, [activeContact, myId]);

    // 3. Gestione eventi socket in tempo reale (ricezione messaggi, notifiche di lettura, indicatore di scrittura)
    useEffect(() => {
        if (!myId) return;

        const handleReceiveMsg = (msg) => {
            const senderId = typeof msg.mittente === 'object' ? msg.mittente._id : msg.mittente;
            const receiverId = typeof msg.destinatario === 'object' ? msg.destinatario._id : msg.destinatario;

            // Se il messaggio appartiene alla chat con il contatto attivo
            if (activeContact && (
                (senderId === myId && receiverId === activeContact.id) ||
                (senderId === activeContact.id && receiverId === myId)
            )) {
                setMessageList(list => [...list, {
                    author: senderId,
                    text: msg.testo,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    letto: msg.letto
                }]);

                // Se l'abbiamo ricevuto noi, lo segnamo come letto immediatamente
                if (senderId === activeContact.id) {
                    socket.emit("segna_letti", { mittenteId: activeContact.id });
                }
            }

            // Aggiorna l'anteprima dell'ultimo messaggio nella barra laterale
            setContacts(prev => prev.map(c => {
                const targetId = senderId === myId ? receiverId : senderId;
                if (c.id === targetId) {
                    return {
                        ...c,
                        lastMsg: msg.testo,
                        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                }
                return c;
            }));
        };

        const handleMessagesRead = ({ destinatarioId }) => {
            // Se l'interlocutore attivo ha letto i nostri messaggi, aggiorna le doppie spunte a blu
            if (activeContact && destinatarioId === activeContact.id) {
                setMessageList(list => list.map(msg => {
                    if (msg.author === myId) {
                        return { ...msg, letto: true };
                    }
                    return msg;
                }));
            }
        };

        const handleUserTyping = ({ mittenteId, isTyping }) => {
            console.log("[Socket] Ricevuto 'user_typing' da:", mittenteId, "isTyping:", isTyping);
            if (activeContact && mittenteId === activeContact.id) {
                setOtherIsTyping(isTyping);
            }
        };

        socket.on('ricevi_messaggio', handleReceiveMsg);
        socket.on('messaggi_letti', handleMessagesRead);
        socket.on('user_typing', handleUserTyping);

        return () => {
            socket.off('ricevi_messaggio', handleReceiveMsg);
            socket.off('messaggi_letti', handleMessagesRead);
            socket.off('user_typing', handleUserTyping);
        };
    }, [activeContact, myId]);

    // Cambia la conversazione attiva al clic sul contatto
    const handleContactSelect = (contact) => {
        setContacts(prev => prev.map(c => ({
            ...c,
            active: c.id === contact.id
        })));
        setActiveContact(contact);
        setOtherIsTyping(false);
    };

    // Gestione input con indicatore di scrittura
    const handleInputChange = (e) => {
        setMessage(e.target.value);
        if (!activeContact) return;

        if (!isTyping) {
            setIsTyping(true);
            console.log("[Socket] Invio 'typing' = true a destinatario:", activeContact.id);
            socket.emit("typing", { destinatarioId: activeContact.id, isTyping: true });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            console.log("[Socket] Invio 'typing' = false (timeout) a destinatario:", activeContact.id);
            socket.emit("typing", { destinatarioId: activeContact.id, isTyping: false });
            setIsTyping(false);
        }, 2000);
    };

    // Invia un messaggio
    const sendMessage = async () => {
        if (message.trim() !== '' && activeContact) {
            const messageData = {
                destinatarioId: activeContact.id,
                testo: message
            };
            socket.emit('invia_messaggio', messageData);
            setMessage('');

            // Riconsegna lo stato "non sta scrivendo" immediatamente
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            console.log("[Socket] Invio 'typing' = false (messaggio inviato) a destinatario:", activeContact.id);
            socket.emit("typing", { destinatarioId: activeContact.id, isTyping: false });
            setIsTyping(false);
        }
    };

    return (
        <div className='chat-page'>
            <div className='chat-container'>
                <aside className='chat-sidebar'>
                    <div className='sidebar-header'>
                        <div className="search-bar">
                            <span className='icon'><Search /></span>
                            <input type='text' placeholder='Cerca conversazioni...' />
                        </div>
                        <button className='filter-btn'><GripHorizontal /></button>
                    </div>

                    <div className='constacts-list'>
                        {contacts.map(contact => (
                            <div 
                                key={contact.id} 
                                className={`contact-item ${contact.active ? 'active' : ''}`}
                                onClick={() => handleContactSelect(contact)}
                            >
                                <div className='avatar-small'><User size={40} /></div>
                                <div className='contact-info'>
                                    <div className='contact-top'>
                                        <span className='contact-name'>{contact.name}</span>
                                        <span className='contact-time'>{contact.time}</span>
                                    </div>
                                    <p className='contact-msg'>{contact.lastMsg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className='chat-main'>
                    <header className='chat-header'>
                        <div className='header-user'>
                            <div className='avatar-medium'><User size={40} /></div>
                            <div>
                                <h4>{activeContact ? activeContact.name : "Seleziona un contatto"}</h4>
                                <span className='status'>
                                    {otherIsTyping ? "sta scrivendo..." : "Online"}
                                </span>
                            </div>
                        </div>
                        <div className='header-actions'>
                            <button className='filter-btn header actions'><PhoneForwarded /></button>
                            <button className='filter-btn header actions'><Video /></button>
                            <button className='filter-btn header actions'><Ellipsis /></button>
                        </div>
                    </header>

                    <div className='messages-area'>
                        <div className='date-separator'><span>Oggi</span></div>
                        {messageList.map((msgContent, index) => {
                            const isMe = msgContent.author === myId;
                            return (
                                <div key={index} className={`msg-wrapper ${isMe ? 'sent' : 'received'}`}>
                                    {isMe && <div className='avatar-msg'><User /></div>}
                                    <div className='msg-bubble'>
                                        <p>{msgContent.text}</p>
                                        <span className='msg-time'>
                                            {msgContent.time}
                                            {isMe && (
                                                <CheckCheck 
                                                    size={14} 
                                                    style={{ 
                                                        color: msgContent.letto ? '#3b82f6' : '#9ca3af',
                                                        marginLeft: '4px',
                                                        display: 'inline-block',
                                                        verticalAlign: 'middle'
                                                    }} 
                                                />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
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
                            onChange={handleInputChange} 
                            onKeyPress={(e) => { e.key === 'Enter' && sendMessage(); }} 
                        />
                        <button className='send-btn' onClick={sendMessage}>
                            {message.length > 0 ? <SendHorizonal /> : <Mic />}
                        </button>
                    </footer>
                </main>
            </div>
        </div>
    );
}