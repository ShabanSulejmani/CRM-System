import { useState, useEffect, useRef } from 'react';
import EmojiPicker from "emoji-picker-react";
import { useParams, useNavigate } from 'react-router-dom';

export default function Chat() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(""); 
    const [messages, setMessages] = useState([]);
    const [chatData, setChatData] = useState(null);
    const emojiPickerRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const fetchChatData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            
            try {
                console.log('Försöker hämta chatdata för token:', token);
                
                const response = await fetch(`/api/chat/${encodeURIComponent(token)}`, {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                
                console.log('Chat response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Fel vid hämtning:', errorText);
                    throw new Error('Kunde inte hämta chattdata');
                }

                const data = await response.json();
                console.log('Hämtad chattdata:', data);

                if (isMounted) {
                    if (data) {
                        setChatData(data);
                        setLoading(false);
                    } else {
                        throw new Error('Ingen chattdata hittades');
                    }
                }
            } catch (error) {
                console.error('Fel vid hämtning av chattdata:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchChatData();
        const interval = setInterval(fetchChatData, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [token]);

    const handleEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
        setOpen(false);
    };

    const handleSendMessage = () => {
        if (message.trim() !== "") {
            setMessages(prevMessages => [...prevMessages, message]);
            setMessage("");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && !event.target.closest('.emoji')) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="p-4">
                <div className="chat-container">
                    <p className="loading-message">Laddar chatt...</p>
                </div>
            </div>
        );
    }

    if (!chatData) {
        return (
            <div className="p-4">
                <div className="chat-container">
                    <p className="error-message">Kunde inte hitta chatten. Kontrollera länken och försök igen.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="chat-container">
                <h2 className="chat-namn">{chatData.firstName}</h2>
                <div className="messages-container">
                    <div className="chat-info">
                        <p><strong>Ärende:</strong> {chatData.issueType}</p>
                        {chatData.serviceType && (
                            <p><strong>Tjänsttyp:</strong> {chatData.serviceType}</p>
                        )}
                        {chatData.registrationNumber && (
                            <p><strong>Registreringsnummer:</strong> {chatData.registrationNumber}</p>
                        )}
                        {chatData.insuranceType && (
                            <p><strong>Försäkringstyp:</strong> {chatData.insuranceType}</p>
                        )}
                        <p><strong>Meddelande:</strong></p>
                        <p className="message-content">{chatData.message}</p>
                    </div>
                    {messages.map((msg, index) => (
                        <div key={index} className="message">{msg}</div>
                    ))}
                </div>

                <input 
                    id="text-bar" 
                    type="text" 
                    placeholder="Skriv ett meddelande..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />

                <div className="emoji" onClick={() => setOpen(!open)}>
                    😃
                </div>

                {open && (
                    <div ref={emojiPickerRef} className="emojipicker">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}

                <button 
                    className="skicka-knapp"
                    onClick={handleSendMessage}
                >
                    Skicka
                </button>
            </div>
        </div>
    );
}