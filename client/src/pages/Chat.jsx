import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import EmojiPicker from "emoji-picker-react";

export default function Chat() {
    const { token } = useParams();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(""); 
    const [messages, setMessages] = useState([]);
    const [chatData, setChatData] = useState(null);
    const emojiPickerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchChatData = async () => {
        if (!token) {
            console.error('No token available');
            setError("Ingen token tillgänglig");
            setLoading(false);
            return;
        }

        try {
            console.log('Current token:', token);
            console.log('Making request to:', `/api/chat/${token}`);

            const response = await fetch(`/api/chat/${token}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);

            // Detaljerad felhantering
            if (response.status === 404) {
                setError("Ingen chatt hittades med denna token");
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`Server returned: ${response.status}`);
            }

            const data = await response.json();
            
            console.log('Parsed data:', data);

            if (data) {
                setChatData(data);
                setError(null);
            } else {
                setError("Ingen data hittades");
            }
        } catch (error) {
            console.error('Detailed error:', error);
            setError(`Ett fel uppstod: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Första mount och token-ändringar
    useEffect(() => {
        fetchChatData();
    }, [token]);

    // Manuell reload-funktion
    const reloadChatData = () => {
        setLoading(true);
        fetchChatData();
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
        setOpen(false);
    };

    const handleSendMessage = async () => {
        if (message.trim() !== "") {
            try {
                // Här skulle du lägga till logik för att skicka meddelande till backend
                const newMessage = {
                    sender: chatData.firstName, // Eller användarens namn
                    text: message,
                    timestamp: new Date().toISOString()
                };

                // Skicka meddelande till backend (implementera denna metod)
                // await sendMessageToBackend(newMessage);

                // Uppdatera lokala meddelanden
                setMessages(prevMessages => [...prevMessages, message]);
                setMessage("");
            } catch (error) {
                console.error("Kunde inte skicka meddelande:", error);
                // Eventuell felhantering
            }
        }
    };

    if (loading) {
        return (
            <div className="chat-container">
                <p className="loading-message">Laddar chatt...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat-container">
                <p className="error-message">{error}</p>
                <button onClick={reloadChatData}>Försök igen</button>
            </div>
        );
    }

    if (!chatData) {
        return (
            <div className="chat-container">
                <p>Ingen chat data hittades</p>
                <button onClick={reloadChatData}>Ladda om</button>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <h2 className="chat-namn">{chatData.firstName}</h2>
            
            <div className="messages-container">
                <div className="chat-info">
                    <p className="message-content">{chatData.message}</p>
                </div>
                
                {/* Visa tidigare skickade meddelanden */}
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <p>{msg}</p>
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input 
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

                <button onClick={handleSendMessage}>
                    Skicka
                </button>
            </div>
        </div>
    );
}