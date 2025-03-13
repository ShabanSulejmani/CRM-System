import { useChat } from './ChatContext';

// This component replaces the regular <a> link for chat tokens
export default function ChatLink({ chatToken, children, onClick }) { // Add onClick prop
  const { openChat } = useChat();
  
  const handleClick = (e) => {
    e.preventDefault(); // Prevent navigation
    
    // Call the onClick handler if provided
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
    
    openChat(chatToken);
  };
  
  return (
    <a 
      href={`/chat/${chatToken}`} 
      onClick={handleClick}
    >
      {children || 'Öppna chatt'}
    </a>
  );
}