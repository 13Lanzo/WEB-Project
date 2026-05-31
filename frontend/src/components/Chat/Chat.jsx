import './Chat.css'
import { useEffect, useState } from 'react'
import {User, Search, GripHorizontal, Laugh, Mic, Plus, SendHorizonal, PhoneForwarded, Video, CheckCheck, Ellipsis  } from 'lucide-react'
import io from 'socket.io-client'

const myRandomId =Math.floor(Math.random()*1000).toString();
const socket=io.connect('http://localhost:5000');

export default function Chat() {
    const [message, setMessage]=useState('');
    //salvataggio messaggi veri
    const [messageList, setMessageList]=useState([]);

    const [contacts, setContacts] = useState([
    { id: 1, name: "Giuseppe Pierpaolo", lastMsg: "Sounds good! Let's check the room to...", time: "10:43 AM", active: true },
    ]);

    const updateLastMessage=(newText, newTime)=>{
            setContacts(prevContacts =>
                prevContacts.map(contact=>{
                    if (contact.active){
                        return{...contact, lastMsg: newText, time: newTime};
                    }
                return contact;
                })
            );
        };
    //per ascoltare i messaggi in arrivo
    useEffect(()=>{
        socket.on('ricevi_messaggio',(data)=>{
            setMessageList((list)=>[...list,data]);
            updateLastMessage(data.text, data.time);
        });
        return()=> socket.off('ricevi_messaggio')
    }, []);

    //per inviare messaggio
    const sendMessage= async()=>{
        if(message!=='') {
            const currentTime = new Date().getHours() +':'+ new Date().getMinutes();
            const messageData={
                author: myRandomId,
                text: message,
                time: currentTime
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
                        {contacts.map(contact =>(
                            <div key={contact.id} className={`contact-item ${contact.active ? 'active':''}`}>
                                <div className='avatar-small'><User size={40}/></div>
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
                            <div className='avatar-medium'><User size={40}/></div>
                            <div>
                                {contacts.map(contact =>(
                                    <h4>{contact.name}</h4>))}
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
                            const isMe=msgContent.author===myRandomId;
                            return(
                                <div key={index} className={`msg-wrapper ${isMe ? 'sent' : 'received'}`}>{isMe && <div className='avatar-msg'><User/></div>}
                                    <div className='msg-bubble'>
                                        <p>{msgContent.text}</p>
                                        <span className='msg-time'>{msgContent.time} {isMe && <CheckCheck size={14}/>}</span>
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