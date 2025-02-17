import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Main() {
    const [tasks, setTasks] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [done, setDone] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                fetchFordonForms(),
                fetchTeleForms(),
                fetchForsakringsForms()
            ]);
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchFordonForms = async () => {
        try {
            const response = await fetch('/api/fordon', {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            if (response.ok) {
                const data = await response.json();
                const activeSubmissions = data.filter(sub => sub.email);
                const newTickets = activeSubmissions.map(submission => ({
                    id: submission.id,
                    chatToken: submission.chatToken,
                    issueType: `${submission.firstName} - ${submission.companyType}`,
                    wtp: submission.issueType,
                    email: submission.email,
                    message: submission.message,
                    submittedAt: submission.submittedAt || submission.createdAt,
                    registrationNumber: submission.registrationNumber
                }));

                updateTasks(newTickets);
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Error fetching fordon submissions:', error);
        }
    };

    const fetchTeleForms = async () => {
        try {
            const response = await fetch('/api/tele', {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            if (response.ok) {
                const data = await response.json();
                const activeSubmissions = data.filter(sub => sub.email);
                const newTickets = activeSubmissions.map(submission => ({
                    id: submission.id,
                    chatToken: submission.chatToken,
                    issueType: `${submission.firstName} - ${submission.companyType}`,
                    wtp: submission.issueType,
                    email: submission.email,
                    message: submission.message,
                    submittedAt: submission.submittedAt || submission.createdAt,
                    serviceType: submission.serviceType
                }));

                updateTasks(newTickets);
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Error fetching tele submissions:', error);
        }
    };

    const fetchForsakringsForms = async () => {
        try {
            const response = await fetch('/api/forsakring', {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            if (response.ok) {
                const data = await response.json();
                const activeSubmissions = data.filter(sub => sub.email);
                const newTickets = activeSubmissions.map(submission => ({
                    id: submission.id,
                    chatToken: submission.chatToken,
                    issueType: `${submission.firstName} - ${submission.companyType}`,
                    wtp: submission.issueType,
                    email: submission.email,
                    message: submission.message,
                    submittedAt: submission.submittedAt || submission.createdAt,
                    insuranceType: submission.insuranceType
                }));

                updateTasks(newTickets);
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Error fetching forsakring submissions:', error);
        }
    };

    const updateTasks = (newTickets) => {
        setTasks(prevTasks => {
            const existingIds = new Set(prevTasks.map(task => task.id));
            const uniqueNewTickets = newTickets.filter(ticket => !existingIds.has(ticket.id));
            
            if (uniqueNewTickets.length === 0) {
                return prevTasks;
            }

            const allTasks = [...uniqueNewTickets, ...prevTasks]
                .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
            
            return allTasks;
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
                                <Link 
                                    to={`/chat/${task.chatToken}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Öppna chatt
                                </Link>
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
                                <Link 
                                    to={`/chat/${task.chatToken}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Öppna chatt
                                </Link>
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
                                <Link 
                                    to={`/chat/${task.chatToken}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Öppna chatt
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Main;