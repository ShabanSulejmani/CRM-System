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
    const messagesEndRef = useRef(null);
    const intervalRef = useRef(null);
    const modalRef = useRef(null);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
               
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Rest of the fetch logic remains the same...
    const fetchData = async () => {
        if (!token) return;

        try {
            const [chatResponse, messagesResponse] = await Promise.all([
                fetch(`/api/chat/${token}`),
                fetch(`/api/chat/messages/${token}`)
            ]);

            if (!chatResponse.ok || !messagesResponse.ok) {
                throw new Error('Kunde inte hämta chattdata');
            }

            const [chatInfo, chatMessages] = await Promise.all([
                chatResponse.json(),
                messagesResponse.json()
            ]);
            
            setChatData(chatInfo);
            setMessages(chatMessages);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        intervalRef.current = setInterval(fetchData, 5000);
        return () => clearInterval(intervalRef.current);
    }, [token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (message.trim() === "" || !chatData) return;

        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatToken: token,
                    sender: chatData.sender,
                    message: message,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Kunde inte skicka meddelande');
            }

            setMessage("");
            await fetchData();
        } catch (error) {
            setError("Kunde inte skicka meddelande. Försök igen.");
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage(prev => prev + emojiObject.emoji);
        setOpen(false);
    };

    // Show loading skeleton
    if (loading) {
        return (
            <div className="chat-modal" ref={modalRef}>
                <div className="chat-modal__container">
                    <div className="chat-modal__header">
                        <div className="chat-modal__header-skeleton"></div>
                    </div>
                    <div className="chat-modal__messages">
                        <div className="chat-modal__messages-loading">
                            <div className="chat-modal__message-skeleton"></div>
                            <div className="chat-modal__message-skeleton chat-modal__message-skeleton--right"></div>
                            <div className="chat-modal__message-skeleton"></div>
                        </div>
                    </div>
                    <div className="chat-modal__input">
                        <div className="chat-modal__input-skeleton"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="chat-modal" ref={modalRef}>
                <div className="chat-modal__container">
                    <div className="chat-modal__error">
                        <p>{error}</p>
                        <button 
                            onClick={fetchData}
                            className="chat-modal__error-button"
                        >
                            Försök igen
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show empty state if no chat data
    if (!chatData) {
        return (
            <div className="chat-modal" ref={modalRef}>
                <div className="chat-modal__container">
                    <div className="chat-modal__empty">
                        Ingen chattdata tillgänglig
                    </div>
                </div>
            </div>
        );
    }

    // Main chat UI
    return (
        <div className="chat-modal" ref={modalRef}>
            <div className="chat-modal__container">
                <div className="chat-modal__header">
                    <h2 className="chat-modal__name">{chatData.firstName}</h2>
                    {chatData.formType && 
                        <div className="chat-modal__type">{chatData.formType}</div>
                    }
                    <button className="chat-modal__close">&times;</button>
                </div>
                
                <div className="chat-modal__messages">
                    {messages.map((msg, index) => (
                        <div 
                            key={msg.id || index}
                            className={`chat-modal__message ${
                                msg.sender === chatData.firstName 
                                    ? 'chat-modal__message--sent' 
                                    : 'chat-modal__message--received'
                            }`}
                        >
                            <p className="chat-modal__message-text">{msg.message}</p>
                            <small className="chat-modal__message-timestamp">
                                {new Date(msg.timestamp).toLocaleString()}
                            </small>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-modal__input-container">
                    <input 
                        type="text" 
                        className="chat-modal__input-field"
                        placeholder="Skriv ett meddelande..." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                    />

                    <div className="chat-modal__emoji-trigger" onClick={() => setOpen(!open)}>
                        😃
                    </div>

                    {open && (
                        <div ref={emojiPickerRef} className="chat-modal__emoji-picker">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}

                    <button className="chat-modal__send-button" onClick={handleSendMessage}>
                        Skicka
                    </button>
                </div>
            </div>
        </div>
    );
}