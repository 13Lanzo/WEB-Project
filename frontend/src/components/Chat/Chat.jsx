import './Chat.css'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { User, Search, GripHorizontal, Laugh, Mic, Plus, SendHorizonal, PhoneForwarded, Video, CheckCheck, Ellipsis } from 'lucide-react'
import io from 'socket.io-client'
import { getConversations, getMessages, createMessage } from '../../services/api';

// Connessione al server Socket.IO (relativa per supportare il proxying)
const socket = io();

export default function Chat({ currentUser }) {
    const location = useLocation(); //per avere l'indirizzamento da Dettagli.js
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [attivoConChiId, setAttivoConChiId] = useState(location.state?.aperturaDirettaConChi || null);
    const [nomeContattoCorrente, setNomeContattoCorrente] = useState(location.state?.aperturaDirettaNome || "");

    // Recupera il token di sicurezza salvato al momento del Login
    // const token = localStorage.getItem('token'); --> viene recuperato automaticamente dal server attraverso le API
    const myUserId = currentUser?.id || currentUser?._id;
    // EFFECT 1: All'avvio, registra l'utente sul server Socket e carica la sidebar
    useEffect(() => {
        // Spostiamo la funzione DENTRO l'effetto per risolvere il warning di ESLint
        // Spostiamo la funzione DENTRO l'effetto per risolvere il warning di ESLint
        const caricaConversazioni = async () => {
            try {
                const data = await getConversations();
                if (data.success) {
                    setConversations(data.dati);
                }
            } catch (errore) {
                console.error("Errore nel caricamento delle conversazioni:", errore);
            }
        };

        if (myUserId) {
            socket.emit('registra_utente', myUserId);
            caricaConversazioni();
        }
    }, [myUserId]);

    // EFFECT 2: Quando cambia l'utente attivo
    useEffect(() => {
        if (attivoConChiId) {
            const fetchMessaggi = async () => {
                try {
                    const data = await getMessages(attivoConChiId);
                    if (Array.isArray(data)) {
                        setMessageList(data);
                    } else if (data && data.dati) {
                        setMessageList(data.dati);
                    } else {
                        setMessageList([]);
                    }
                } catch (error) {
                    console.error("Errore nel caricamento dei messaggi:", error);
                    setMessageList([]);
                }
            };
            fetchMessaggi();
        }
    }, [attivoConChiId]);


    // EFFECT 3: Resta in ascolto di nuovi messaggi in arrivo (Real-Time)
    useEffect(() => {
        const gestisciNuovoMessaggio = (data) => {
            const mittenteReale = data.mittente?._id || data.mittente;
            if (mittenteReale === attivoConChiId || mittenteReale === myUserId) {
                setMessageList((list) => [...list, data]);
            }
        };

        socket.on('ricevi_messaggio', gestisciNuovoMessaggio);
        return () => socket.off('ricevi_messaggio', gestisciNuovoMessaggio);
    }, [attivoConChiId, myUserId]);

    // 3. INVIA IL MESSAGGIO (Salva nel DB + Invia su Socket)
    const sendMessage = async () => {
        if (message.trim() !== '' && attivoConChiId) {
            try {
                const dataModificata = await createMessage(attivoConChiId, message);
                const messaggioEffettivo = dataModificata.dati || dataModificata;
                // B. Trasmissione istantanea (Socket.IO) per il destinatario
                const messageData = {
                    destinatarioId: attivoConChiId,
                    mittente: myUserId,
                    testo: message,
                    createdAt: messaggioEffettivo.createdAt || new Date()
                };

                socket.emit('invia_messaggio', messageData);

                // C. Aggiorna lo schermo immediatamente per chi scrive
                setMessageList((list) => [...list, messaggioEffettivo]);
                setMessage('');

            } catch (errore) {
                console.error("Errore durante l'invio del messaggio:", errore);
            }
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
                        {conversations.map((altroUtente) => {
                            const isActive = altroUtente._id === attivoConChiId;

                            return (
                                <div
                                    key={altroUtente._id}
                                    className={`contact-item ${isActive ? 'active' : ''}`}
                                    onClick={() => {
                                        setAttivoConChiId(altroUtente._id);
                                        setNomeContattoCorrente(`${altroUtente.nome} ${altroUtente.cognome}`);
                                    }}
                                >
                                    <div className='avatar-small'><User size={40} /></div>
                                    <div className='contact-info'>
                                        <div className='contact-top'>
                                            <span className='contact-name'>{altroUtente.nome} {altroUtente.cognome}</span>
                                        </div>
                                        <p className='contact-msg'>
                                            Clicca per aprire la chat
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
                            <div className='avatar-medium'><User size={40} /></div>
                            <div>
                                <h4>{nomeContattoCorrente || "Seleziona una chat"}</h4>
                                {attivoConChiId && <span className='status'>Online</span>}
                            </div>
                        </div>
                        <div className='header-actions'>
                            <button className='filter-btn header actions'><PhoneForwarded /></button>
                            <button className='filter-btn header actions'><Video /></button>
                            <button className='filter-btn header actions'><Ellipsis /></button>
                        </div>
                    </header>

                    <div className='messages-area'>
                        <div className='date-separator'><span>Cronologia Chat</span></div>

                        {messageList.map((msgContent, index) => {
                            const mittenteId = msgContent.mittente?._id || msgContent.mittente;
                            const myUserId = currentUser?.id || currentUser?._id;
                            const isMe = mittenteId === myUserId;

                            return (
                                <div key={index} className={`msg-wrapper ${isMe ? 'sent' : 'received'}`}>
                                    {!isMe && <div className='avatar-msg'><User /></div>}
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
                            <button className='action-btn'><Plus /></button>
                            <button className='action-btn'><Laugh /></button>
                        </div>
                        <input
                            type='text'
                            placeholder='Scrivi un messaggio...'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => { e.key === 'Enter' && sendMessage(); }}
                            disabled={!attivoConChiId}
                        />
                        <button
                            className='send-btn'
                            onClick={sendMessage}
                            disabled={!attivoConChiId}
                        >
                            {message.length > 0 ? <SendHorizonal /> : <Mic />}
                        </button>
                    </footer>
                </main>
            </div>
        </div>
    );
}