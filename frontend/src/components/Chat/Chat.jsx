import './Chat.css'
import { useEffect, useState } from 'react'
import {User, Search, GripHorizontal, Laugh, Mic, Plus, SendHorizonal, PhoneForwarded, Video, CheckCheck, Ellipsis  } from 'lucide-react'
import io from 'socket.io-client'
//import axios from 'axios';

//const myRandomId =Math.floor(Math.random()*1000).toString();
const socket=io.connect('http://localhost:5000');

export default function Chat({currentUser, aperturaDirettaConChi = null, aperturaDirettaNome = ""}) {
    const [message, setMessage]=useState('');
    //salvataggio messaggi veri
    const [messageList, setMessageList]=useState([]);
    //salviamo tutte le persone con cui ho una chat attiva (per riempire la sidebar)
    const [conversations, setConversations]=useState([]);
    //memoriziamo l'id della persona con cui sto parlando in questo momento
    const [attivoConChiId, setAttivoConChiId]=useState(aperturaDirettaConChi);
    //memorizziamo il nome della persona con cui sto parlado
    const [nomeContattoCorrente, setNomeContattoCorrente]=useState(aperturaDirettaNome);

    //creiamo il nome del canale su cui comunicheremo, basato sui due id (ordinati per evitare duplicati)
    const roomId = attivoConChiId ? [currentUser.id, attivoConChiId].sort().join('_'): null;
    
    //primo effect: registra l'utente sul server in tempo reale
    useEffect(()=>{
        if(currentUser?.id){
            //dice al server Socket.io che siamo online
            socket.emit('join_room', currentUser.id);
            //avvia la funzione per caricare i contatti storici
            //caricaConversazioni();
        }
    }, [currentUser?.id]);

    //secondo effect: quando l'utente cambia contatto cliccando sulla sidebar, si sintonizza sulla nuova stanza

    useEffect(()=>{
        if(currentUser?.id && attivoConChiId && roomId){
            //dice al server Socket.io che voglio ascoltare i messaggi di questa stanza
            socket.emit('join_room', roomId);
        }
    }, [attivoConChiId, roomId, currentUser?.id]);

    //terzo effect: resta in attesa h24 in ascolto dei messaggi che arrivano in tempo reale da Socket.io

    useEffect(()=>{
        socket.on('ricevi_messaggio', (data) => {
            //verifichiamo che il messaggio ricevuto appartenga alla stanza attiva e lo mostriamo
            if(data.roomId === roomId){
                setMessageList((list)=>[...list, data]);
            }
        });
        return()=>socket.off('ricevi_messaggio');
    }, [roomId]);


    //per inviare messaggio
    const sendMessage= async()=>{
        if(message.trim() !== '' && attivoConChiId) {
            //const currentTime = new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes();
            const messageData={
                roomId: roomId,
                mittente: currentUser.id,
                destinatario: attivoConChiId,
                testo: message,
                createdAt: new Date()
            };
            await socket.emit('invia_messaggio', messageData);
            setMessageList((list)=>[...list, messageData]);
            setMessage('');
        }
    };

    return(
        <div className='chat-page'>
            <div className='chat-container'>
                <aside className='chat-sidebar'>
                    <div className='sidebar-header'>
                        <div className="search-bar">
                            <span className='icon'><Search/></span>
                            <input type='text' placeholder='Cerca conversazioni...'/>
                        </div>
                        <button className='filter-btn'><GripHorizontal/></button>
                    </div>
                    
                    <div className='constacts-list'>
                        {/* MODIFICA: Cicliamo l'array dinamico conversations inviato dal backend */}
                        {conversations.map((conv) => {
                            // Estraiamo i dati dell'utente con cui stiamo parlando
                            const altroUtente = conv.partecipante || { nome: "Utente", cognome: "" };
                            const isActive = altroUtente._id === attivoConChiId;

                            return (
                                <div 
                                    key={conv._id} 
                                    className={`contact-item ${isActive ? 'active' : ''}`}
                                    onClick={() => {
                                        // Quando clicchi un utente, salvi il suo ID e il suo Nome a schermo
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
                                                    : '10:00'}
                                            </span>
                                        </div>
                                        <p className='contact-msg'>
                                            {/* Mostra l'anteprima dell'ultimo messaggio reale */}
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
                                <h4>{nomeContattoCorrente}</h4>
                                <span className='status'>Online</span>
                            </div>
                        </div>
                        <div className='header-actions'>
                            <button className='filter-btn header actions'><PhoneForwarded/></button>
                            <button className='filter-btn header actions'><Video/></button>
                            <button className='filter-btn header actions'><Ellipsis/></button>
                        </div>
                    </header>
                    
                    <div className='messages-area'>
                        <div className='date-separator'><span>Oggi</span></div>
                        {messageList.map((msgContent, index)=>{
                            const mittenteId = msgContent.mittente?._id || msgContent.mittente;
                            const isMe = mittenteId === currentUser?.id;
                            return(
                                <div key={index} className={`msg-wrapper ${isMe ? 'sent' : 'received'}`}>{isMe && <div className='avatar-msg'><User/></div>}
                                    <div className='msg-bubble'>
                                        {/*leggiamo .testo allineato al database*/}

                                        <p>{msgContent.testo}</p>
                                        <span className='msg-time'>
                                            {/*sostituiamo il vecchio msgContent.time con la data reale convertita in orario*/}

                                            {msgContent.createdAt ? new Date(msgContent.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}): ''}{isMe && <CheckCheck size={14} style={{marginLeft: '5px'}}/>}
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
                        <input type='text' placeholder='Scrivi un messaggio...' value={message} onChange={(e)=>setMessage(e.target.value)} onKeyPress={(e)=> {e.key === 'Enter' && sendMessage();} }/>
                        <button className='send-btn' onClick={sendMessage}>{message.length>0 ? <SendHorizonal/> : <Mic />}</button>
                    </footer>
                </main>
            </div>
            
        </div>
    );
}