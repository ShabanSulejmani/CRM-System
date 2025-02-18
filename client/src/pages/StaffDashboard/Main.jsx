import { useState, useEffect } from "react";

function Main() {
    const [tasks, setTasks] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [done, setDone] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching tickets...");
                const [fordonResponse, teleResponse, forsakringResponse] = await Promise.all([
                    fetch('/api/fordon'),
                    fetch('/api/tele'),
                    fetch('/api/forsakring')
                ]);

                const fordonData = await fordonResponse.json();
                const teleData = await teleResponse.json();
                const forsakringData = await forsakringResponse.json();

                // Map tickets with additional information
                const newTickets = [
                    ...fordonData.map(ticket => ({
                        ...ticket,
                        issueType: `${ticket.firstName} - Fordonsservice`,
                        wtp: ticket.issueType,
                        chatLink: `http://localhost:3001/chat/${ticket.chatToken}`
                    })),
                    ...teleData.map(ticket => ({
                        ...ticket,
                        issueType: `${ticket.firstName} - Tele/Bredband`,
                        wtp: ticket.issueType,
                        chatLink: `http://localhost:3001/chat/${ticket.chatToken}`
                    })),
                    ...forsakringData.map(ticket => ({
                        ...ticket,
                        issueType: `${ticket.firstName} - Försäkringsärenden`,
                        wtp: ticket.issueType,
                        chatLink: `http://localhost:3001/chat/${ticket.chatToken}`
                    }))
                ];

                updateTasks(newTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const updateTasks = (newTickets) => {
        setTasks(prevTasks => {
            // Create a Set of existing task IDs for efficient lookup
            const existingTaskIds = new Set(prevTasks.map(task => task.id));
            
            // Filter out tickets that are already in the tasks
            const uniqueNewTickets = newTickets.filter(ticket => 
                !existingTaskIds.has(ticket.id)
            );

            // If there are new tickets, add them
            if (uniqueNewTickets.length > 0) {
                const combinedTasks = [
                    ...uniqueNewTickets, 
                    ...prevTasks
                ];

                // Sort by submission time, most recent first
                return combinedTasks.sort((a, b) => 
                    new Date(b.submittedAt) - new Date(a.submittedAt)
                );
            }

            // If no new tickets, return existing tasks
            return prevTasks;
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

    return (
        <div className="main-container">
            <aside className="staff-aside">
                <h2 className="company-name">Företagsnamn</h2>
                <div>Martin</div>
                <div>Ville</div>
                <div>Kevin</div>
                <div>Shaban</div>
                <div>Sigge</div>
                <div>Sebbe</div>
                Inloggad support
            </aside>

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
                        <div className="ticket-task-content" 
                             contentEditable
                             suppressContentEditableWarning={true}
                             onBlur={(e) => handleTaskEdit(task.id, e.currentTarget.textContent, setTasks)}
                        >
                            {task.issueType}
                        </div>
                        <div className="ticket-task-details">
                            <div className="ticket-wtp">{task.wtp}</div>
                            <div className="ticket-task-email">{task.email}</div>
                            <div className="ticket-task-time">{formatDate(task.submittedAt)}</div>
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
                        <div className="ticket-task-content" 
                             contentEditable
                             suppressContentEditableWarning={true}
                             onBlur={(e) => handleTaskEdit(task.id, e.currentTarget.textContent, setMyTasks)}
                        >
                            {task.issueType}
                        </div>
                        <div className="ticket-task-details">
                            <div className="ticket-wtp">{task.wtp}</div>
                            <div className="ticket-task-email">{task.email}</div>
                            <div className="ticket-task-time">{formatDate(task.submittedAt)}</div>
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
                        <div className="ticket-task-content" 
                             contentEditable
                             suppressContentEditableWarning={true}
                             onBlur={(e) => handleTaskEdit(task.id, e.currentTarget.textContent, setDone)}
                        >
                            {task.issueType}
                        </div>
                        <div className="ticket-task-details">
                            <div className="ticket-wtp">{task.wtp}</div>
                            <div className="ticket-task-email">{task.email}</div>
                            <div className="ticket-task-time">{formatDate(task.submittedAt)}</div>
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