import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import EmojiPicker from "emoji-picker-react";

export default function Chat() {
    const { token } = useParams();  // Vi får token från URL:en
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(""); 
    const [messages, setMessages] = useState([]);
    const [chatData, setChatData] = useState(null);
    const emojiPickerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mounted = useRef(true);

    useEffect(() => {
        const fetchChatData = async () => {
            if (!token) {
                setError("Ingen token tillgänglig");
                setLoading(false);
                return;
            }

            try {
                // Lägg till dessa debug-loggar
                console.log('Current token:', token);
                console.log('Making request to:', `/api/chat/${token}`);

                const response = await fetch(`/api/chat/${token}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                // Logga response status och headers
                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers));

                // Försök läsa response body oavsett status
                const text = await response.text();
                console.log('Response body:', text);

                if (!response.ok) {
                    throw new Error(`Server returned: ${text}`);
                }

                const data = text ? JSON.parse(text) : null;
                console.log('Parsed data:', data);

                if (data) {
                    setChatData(data);
                    setError(null);
                }
            } catch (error) {
                console.error('Detailed error:', error);
                setError(`Ett fel uppstod: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchChatData();
    }, [token]);  // Använd token i dependency array

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
            </div>
        );
    }

    if (!chatData) {
        return (
            <div className="chat-container">
                <p>Ingen chat data hittades</p>
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