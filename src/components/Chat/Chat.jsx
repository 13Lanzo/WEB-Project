import './Chat.css'
import { useState } from 'react'
import {User, Search, GripHorizontal, Laugh, Mic, Plus, SendHorizonal, PhoneForwarded, Video, CheckCheck, Ellipsis  } from 'lucide-react'

export default function Chat() {
    const [message, setMessace]=useState('');
    const contacts = [
    { id: 1, name: "Alex Chen", lastMsg: "Sounds good! Let's check the room to...", time: "10:43 AM", active: true },
    { id: 2, name: "Sarah Miller", lastMsg: "Are you okay with pets in the apartment?", time: "Yesterday" },
    { id: 3, name: "Jordan Smith", lastMsg: "I sent the lease agreement over to your...", time: "Tue" },
  ];
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
                                <h4>Utente esempio</h4>
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
                        <div className='msg-wrapper received'>
                            <div className='avatar-msg'><User/></div>
                            <div className='msg-bubble'>
                                <p>Ciao vuoi vivere con me?</p>
                                <span className='msg-time'>10:30 AM</span>
                            </div>
                        </div>
                        <div className='msg-wrapper sent'>
                            <div className='msg-bubble received'>
                                <p>Ciao ok</p>
                                <span className='msg-time'>10:42 AM <CheckCheck/></span>
                            </div>
                        </div>
                        <div className='msg-wrapper received'>
                            <div className='avatar-msg'><User/></div>
                            <div className='msg-bubble'>
                                <p>Godo</p>
                                <span className='msg-time'>10:45 AM</span>
                            </div>
                        </div>
                    </div>

                    <footer className='chat-input-container'>
                        <div className='input-actions'>
                            <button className='action-btn'><Plus/></button>
                            <button className='action-btn'><Laugh/></button>
                        </div>
                        <input type='text' placeholder='Scrivi un messaggio...' value={message} onChange={(e)=>setMessace(e.target.value)}/>
                        <button className='send-btn'>{message.length>0 ? <SendHorizonal/> : <Mic />}</button>
                    </footer>
                </main>
            </div>
            
        </div>
    );
}