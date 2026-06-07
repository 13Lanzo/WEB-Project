import './Chat.css'
import { useEffect, useState } from 'react'
import { User, Search, GripHorizontal, Laugh, Mic, Plus, SendHorizonal, PhoneForwarded, Video, CheckCheck, Ellipsis } from 'lucide-react'
import io from 'socket.io-client'
import axios from 'axios'

const socket = io.connect('http://localhost:5000');

export default function Chat({ currentUser, aperturaDirettaConChi = null, aperturaDirettaNome = "" }) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [attivoConChiId, setAttivoConChiId] = useState(aperturaDirettaConChi);
    const [nomeContattoCorrente, setNomeContattoCorrente] = useState(aperturaDirettaNome);

    // Creiamo il nome del canale (stanza) combinando i due ID ordinati alfabeticamente
    const roomId = attivoConChiId ? [currentUser?.id, attivoConChiId].sort().join('_') : null;
    const token = localStorage.getItem('token'); // Recuperiamo il token per le chiamate protette

    // ========================================================
    // EFFECT 1: SINTONIZZA L'UTENTE E CARICA LA SIDEBAR INIZIALE
    // ========================================================
    useEffect(() => {
        const caricaConversazioni = async () => {
            if (!currentUser?.id) return;
            try {
                const response = await axios.get(`http://localhost:5000/api/chat/conversations/${currentUser.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data) {
                    setConversations(response.data);
                }
            } catch (err) {
                console.error("Errore nel recupero della sidebar chat:", err);
            }
        };

        if (currentUser?.id) {
            socket.emit('join_room', currentUser.id);
            caricaConversazioni();
        }
    }, [currentUser?.id, token]);

    // ========================================================
    // EFFECT 2: CAMBIA STANZA E SCARICA LA CRONOLOGIA MESSAGGI
    // ========================================================
    useEffect(() => {
        const caricaMessaggiStorici = async () => {
            if (!roomId) return;
            try {
                const response = await axios.get(`http://localhost:5000/api/chat/messages/${roomId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data) {
                    setMessageList(response.data);
                }
            } catch (err) {
                console.error("Errore nel recupero dello storico messaggi:", err);
            }
        };

        if (currentUser?.id && attivoConChiId && roomId) {
            socket.emit('join_room', roomId);
            caricaMessaggiStorici();
        }
    }, [attivoConChiId, roomId, token, currentUser?.id]); 

    // ========================================================
    // EFFECT 3: RESTA IN ASCOLTO H24 DEI MESSAGGI IN REALTIME
    // ========================================================
    useEffect(() => {
        const aggiornaSidebar = async () => {
            if (!currentUser?.id) return;
            try {
                const response = await axios.get(`http://localhost:5000/api/chat/conversations/${currentUser.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data) {
                    setConversations(response.data);
                }
            } catch (err) {
                console.error("Errore aggiornamento sidebar:", err);
            }
        };

        socket.on('ricevi_messaggio', (data) => {
            if (data.roomId === roomId) {
                setMessageList((list) => [...list, data]);
            }
            aggiornaSidebar(); 
        });

        return () => socket.off('ricevi_messaggio');
    }, [roomId, currentUser?.id, token]);

    // ========================================================
    // GESTIONE DELL'INVIO DEL MESSAGGIO DALL'INPUT
    // ========================================================
    const sendMessage = async () => {
        if (message.trim() !== '' && attivoConChiId && currentUser?.id) {
            const messageData = {
                roomId: roomId,
                mittente: currentUser.id,
                destinatario: attivoConChiId,
                testo: message,
                createdAt: new Date()
            };

            await socket.emit('invia_messaggio', messageData);
            setMessageList((list) => [...list, messageData]);
            setMessage('');

            // Delay per consentire il salvataggio a DB prima di ricaricare le anteprime della sidebar
            setTimeout(async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/chat/conversations/${currentUser.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data) {
                        setConversations(response.data);
                    }
                } catch (err) {
                    console.error("Errore aggiornamento sidebar dopo invio:", err);
                }
            }, 100);
        }
    };

    return (
        <div className='chat-page'>
            <div className='chat-container'>
                <aside className='chat-sidebar'>
                    <div className='sidebar-header'>
                        <div className="search-bar">
                            <span className='icon'><Search/></span>
                            <input type='text' placeholder='Cerca conversazioni...' />
                        </div>
                        <button className='filter-btn'><GripHorizontal/></button>
                    </div>
                    
                    <div className='constacts-list'>
                        {conversations.map((conv) => {
                            const altroUtente = conv.partecipante || { nome: "Utente", cognome: "" };
                            const isActive = altroUtente._id === attivoConChiId;

                            return (
                                <div 
                                    key={conv._id} 
                                    className={`contact-item ${isActive ? 'active' : ''}`}
                                    onClick={() => {
                                        setAttivoConChiId(altroUtente._id);
                                        setNomeContattoCorrente(`${altroUtente.nome} ${altroUtente.cognome}`);
                                    }}
                                >
                                    <div className='avatar-small'><User size={40}/></div>
                                    <div className='contact-info'>
                                        <div className='contact-top'>
                                            <span className='contact-name'>{altroUtente.nome} {altroUtente.cognome}</span>
                                            <span className='contact-time'>
                                                {conv.ultimoMessaggio?.createdAt 
                                                    ? new Date(conv.ultimoMessaggio.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                                    : ''}
                                            </span>
                                        </div>
                                        <p className='contact-msg'>
                                            {conv.ultimoMessaggio?.testo || "Clicca per aprire la chat"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                <main className='chat-main'>
                    <header className='chat-header'>
                        <div className='header-user'>
                            <div className='avatar-medium'><User size={40}/></div>
                            <div>
                                <h4>{nomeContattoCorrente || "Seleziona una conversazione"}</h4>
                                <span className='status'>{nomeContattoCorrente ? "Online" : ""}</span>
                            </div>
                        </div>
                        <div className='header-actions'>
                            <button className='filter-btn header actions'><PhoneForwarded/></button>
                            <button className='filter-btn header actions'><Video/></button>
                            <button className='filter-btn header actions'><Ellipsis/></button>
                        </div>
                    </header>
                    
                    <div className='messages-area'>
                        {roomId && <div className='date-separator'><span>Conversazione</span></div>}
                        {messageList.map((msgContent, index) => {
                            const mittenteId = msgContent.mittente?._id || msgContent.mittente;
                            const isMe = mittenteId === currentUser?.id;
                            return (
                                <div key={index} className={`msg-wrapper ${isMe ? 'sent' : 'received'}`}>
                                    {isMe && <div className='avatar-msg'><User/></div>}
                                    <div className='msg-bubble'>
                                        <p>{msgContent.testo}</p>
                                        <span className='msg-time'>
                                            {msgContent.createdAt 
                                                ? new Date(msgContent.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                                : ''} 
                                            {isMe && <CheckCheck size={14} style={{ marginLeft: '5px' }} />}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <footer className='chat-input-container'>
                        <div className='input-actions'>
                            <button className='action-btn'><Plus/></button>
                            <button className='action-btn'><Laugh/></button>
                        </div>
                        <input 
                            type='text' 
                            placeholder='Scrivi un messaggio...' 
                            value={message} 
                            disabled={!attivoConChiId}
                            onChange={(e) => setMessage(e.target.value)} 
                            onKeyPress={(e) => { e.key === 'Enter' && sendMessage(); }}
                        />
                        <button className='send-btn' onClick={sendMessage} disabled={!attivoConChiId}>
                            {message.length > 0 ? <SendHorizonal /> : <Mic />}
                        </button>
                    </footer>
                </main>
            </div>
        </div>
    );
}