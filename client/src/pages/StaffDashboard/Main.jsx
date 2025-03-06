// Updated ticket rendering with text truncation
import { useState, useEffect, useCallback, useRef } from "react";
import Aside from "./Aside";

function Main() {
    // State and other code remains the same
    const [tasks, setTasks] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [done, setDone] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const initialLoadRef = useRef(true);

    const fetchTickets = useCallback(async () => {
        try {
            if (initialLoadRef.current) {
                setLoading(true);
            }
            setError(null);
    
            const response = await fetch('/api/tickets', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 403) {
                throw new Error('Åtkomst nekad. Vänligen logga in igen.');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            
            const newTickets = data.map(ticket => ({
                ...ticket,
                id: ticket.chatToken,
                issueType: `${ticket.sender} - ${ticket.formType}`,
                wtp: ticket.formType,
                chatLink: `http://localhost:3001/chat/${ticket.chatToken}`
            }));
    
            updateTasks(newTickets);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            setError(error.message);
        } finally {
            if (initialLoadRef.current) {
                setLoading(false);
                initialLoadRef.current = false;
            }
        }
    }, []);

    useEffect(() => {
        fetchTickets();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(fetchTickets, 30000);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchTickets]);

    const updateTasks = (newTickets) => {
        setTasks(prevTasks => {
            const existingTasks = new Map(prevTasks.map(task => [task.chatToken, task]));
            const updatedTasks = newTickets.map(ticket => ({
                ...ticket,
                ...existingTasks.get(ticket.chatToken)
            }));
            return updatedTasks.sort((a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            );
        });
    };

    const handleDragStart = (task) => {
        setDraggedTask(task);
    };

    const handleDrop = (setTargetColumn, targetColumn) => {
        if (draggedTask) {
            setTasks(prev => prev.filter(task => task.id !== draggedTask.id));
            setMyTasks(prev => prev.filter(task => task.id !== draggedTask.id));
            setDone(prev => prev.filter(task => task.id !== draggedTask.id));
            setTargetColumn(prev => [...prev, draggedTask]);
            setDraggedTask(null);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleTaskEdit = (taskId, newContent, setColumn) => {
        setColumn(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, content: newContent }
                : task
        ));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Inget datum";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Ogiltigt datum";
        return date.toLocaleString('sv-SE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // UPDATED RENDER FUNCTION WITH TEXT TRUNCATION
    return (
        <div className="main-container">
            <Aside />
            
            <div
                className="ticket-tasks"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(setTasks, tasks)}
            >
                <h2 className="ticket-tasks-header">Ärenden</h2>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="ticket-task-item"
                    >
                        <div 
                            className="ticket-task-content truncate-text"
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleTaskEdit(task.id, e.currentTarget.textContent, setTasks)}
                            title={task.issueType} // Add title for hover tooltip
                        >
                            {task.issueType}
                        </div>
                        
                        <div className="ticket-task-details">
                            <div className="ticket-wtp truncate-text" title={task.wtp}>{task.wtp}</div>
                            <div className="ticket-task-email truncate-text" title={task.email}>{task.email}</div>
                            <div className="ticket-task-time truncate-text" title={formatDate(task.submittedAt || task.timestamp || task.createdAt)}>
                                {formatDate(task.submittedAt || task.timestamp || task.createdAt)}
                            </div>
                            <div className="ticket-task-token">
                                <a
                                    href={task.chatLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Öppna chatt
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="ticket-my-tasks"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(setMyTasks, myTasks)}
            >
                <h2 className="ticket-my-tasks-header">Mina ärenden</h2>
                {myTasks.map((task) => (
                    <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="ticket-task-item"
                    >
                        <div 
                            className="ticket-task-content truncate-text"
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleTaskEdit(task.id, e.currentTarget.textContent, setMyTasks)}
                            title={task.issueType}
                        >
                            {task.issueType}
                        </div>
                        
                        <div className="ticket-task-details">
                            <div className="ticket-wtp truncate-text" title={task.wtp}>{task.wtp}</div>
                            <div className="ticket-task-email truncate-text" title={task.email}>{task.email}</div>
                            <div className="ticket-task-time truncate-text" title={formatDate(task.submittedAt || task.timestamp || task.createdAt)}>
                                {formatDate(task.submittedAt || task.timestamp || task.createdAt)}
                            </div>
                            <div className="ticket-task-token">
                                <a
                                    href={task.chatLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Öppna chatt
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="ticket-done"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(setDone, done)}
            >
                <h2 className="ticket-done-header">Klara</h2>
                {done.map((task) => (
                    <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="ticket-task-item"
                    >
                        <div 
                            className="ticket-task-content truncate-text"
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleTaskEdit(task.id, e.currentTarget.textContent, setDone)}
                            title={task.issueType}
                        >
                            {task.issueType}
                        </div>
                        
                        <div className="ticket-task-details">
                            <div className="ticket-wtp truncate-text" title={task.wtp}>{task.wtp}</div>
                            <div className="ticket-task-time truncate-text" title={formatDate(task.submittedAt || task.timestamp || task.createdAt)}>
                                {formatDate(task.submittedAt || task.timestamp || task.createdAt)}
                            </div>
                            <div className="ticket-task-token">
                                <a
                                    href={task.chatLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Öppna chatt
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Main;