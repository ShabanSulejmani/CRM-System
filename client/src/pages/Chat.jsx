
import { useState, useEffect, useRef } from 'react';
import EmojiPicker from "emoji-picker-react";
import { useParams } from 'react-router-dom';

export default function Chat() {
    const { token } = useParams();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(""); 
    const [messages, setMessages] = useState([]);
    const [chatData, setChatData] = useState(null);
    const emojiPickerRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChatData = async () => {
            if (!token) return;
            
            try {
                // Uppdaterad endpoint för att hantera alla formulärtyper
                const response = await fetch(`/api/chat/${token}`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("Hämtad chat data:", data);
                    setChatData(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching chat data:', error);
                setLoading(false);
            }
        };

        fetchChatData();
        const interval = setInterval(fetchChatData, 5000);
        return () => clearInterval(interval);
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

    const renderChatContent = () => {
        if (loading) return <p className="loading-message">Laddar chat...</p>;
        if (!chatData) return <p>Ingen chat data hittades</p>;

        return (
            <>
                <h2 className="chat-namn">{chatData.firstName}</h2>
                <div className="messages-container">
                    <div className="chat-info">
                        <p className="issue-type">Ärende: {chatData.issueType}</p>
                        <p className="message-time">Meddelande skickat: {new Date().toLocaleString()}</p>
                        <p className="message-content">{chatData.message}</p>
                    </div>
                    {messages.map((msg, index) => (
                        <div key={index} className="message">{msg}</div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="p-4">
            <div className="chat-container">
                {renderChatContent()}

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