// Importerar nödvändiga React hooks för state-hantering, sidoeffekter, callbacks och referenser
import { useState, useEffect, useCallback, useRef } from "react";

// Definierar huvudkomponenten för applikationen
function Main() {
    // State för alla ärenden/tasks
    const [tasks, setTasks] = useState([]);
    // State för användarens egna ärenden
    const [myTasks, setMyTasks] = useState([]);
    // State för färdiga ärenden
    const [done, setDone] = useState([]);
    // State för att hålla koll på vilket ärende som dras
    const [draggedTask, setDraggedTask] = useState(null);
    // State för laddningsstatus
    const [loading, setLoading] = useState(true);
    // State för felhantering
    const [error, setError] = useState(null);
    // Referens för att hålla koll på intervallet för automatisk uppdatering
    const intervalRef = useRef(null);

    // Callback-funktion för att hämta ärenden från API:et
    const fetchTickets = useCallback(async () => {
        try {
            // Sätter loading till true endast vid första laddningen
            if (!intervalRef.current) {
                setLoading(true);
            }
            // Återställer eventuella fel
            setError(null);

            // Gör API-anropet
            const response = await fetch('/api/tickets');

            // Kontrollerar om API-anropet lyckades
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Konverterar svaret till JSON
            const data = await response.json();

            // Mappar om datan för att matcha applikationens format
            const newTickets = data.map(ticket => ({
                ...ticket,
                id: ticket.chatToken,
                issueType: `${ticket.sender} - ${ticket.formType}`,
                wtp: ticket.formType,
                chatLink: `http://localhost:3001/chat/${ticket.chatToken}`
            }));

            // Uppdaterar listan med ärenden
            updateTasks(newTickets);
        } catch (error) {
            // Loggar fel i konsolen
            console.error("Error fetching tickets:", error);
            // Sätter felmeddelande för användaren
            setError("Kunde inte hämta ärenden. Försök igen senare.");
        } finally {
            // Stänger av laddningsindikatorn
            setLoading(false);
        }
    }, []);

    // Effekt som körs när komponenten monteras
    useEffect(() => {
        // Hämtar ärenden direkt
        fetchTickets();

        // Rensar eventuellt existerande intervall
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Sätter upp ett nytt intervall för att hämta ärenden var 30:e sekund
        intervalRef.current = setInterval(fetchTickets, 30000);

        // Cleanup-funktion som körs när komponenten avmonteras
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchTickets]);

    // Funktion för att uppdatera ärendelistan med ny data
    const updateTasks = (newTickets) => {
        setTasks(prevTasks => {
            // Skapar en Map med existerande ärenden för snabb uppslagning
            const existingTasks = new Map(prevTasks.map(task => [task.chatToken, task]));

            // Kombinerar nya ärenden med existerande data
            const updatedTasks = newTickets.map(ticket => ({
                ...ticket,
                ...existingTasks.get(ticket.chatToken)
            }));

            // Sorterar ärenden efter timestamp, nyaste först
            return updatedTasks.sort((a, b) =>
                new Date(b.timestamp) - new Date(a.timestamp)
            );
        });
    };

    // Funktion som körs när man börjar dra ett ärende
    const handleDragStart = (task) => {
        setDraggedTask(task);
    };

    // Funktion som körs när man släpper ett ärende i en ny kolumn
    const handleDrop = (setTargetColumn, targetColumn) => {
        if (draggedTask) {
            // Tar bort ärendet från alla kolumner
            setTasks(prev => prev.filter(task => task.id !== draggedTask.id));
            setMyTasks(prev => prev.filter(task => task.id !== draggedTask.id));
            setDone(prev => prev.filter(task => task.id !== draggedTask.id));

            // Lägger till ärendet i målkolumnen
            setTargetColumn(prev => [...prev, draggedTask]);
            // Återställer draggedTask
            setDraggedTask(null);
        }
    };

    // Förhindrar standardbeteende vid drag-over
    const handleDragOver = (e) => e.preventDefault();

    // Funktion för att hantera redigering av ärenden
    const handleTaskEdit = (taskId, newContent, setColumn) => {
        setColumn(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, content: newContent }
                : task
        ));
    };

    // Funktion för att formatera datum enligt svenskt format
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

    // Renderar laddningsskärm när ärenden hämtas första gången
    if (loading && tasks.length === 0) {
        return (
            // Container för laddningsvyn
            <div className="main-container">
                {/* Sidopanel med personalinformation */}
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
                {/* Container för laddningsanimation */}
                <div className="ticket-tasks">
                    <h2 className="ticket-tasks-header">Ärenden</h2>
                    <div className="p-4 space-y-4">
                        {/* Tre pulserande platshållare för ärenden */}
                        <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                        <div className="text-gray-500 text-center mt-4">Laddar ärenden...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Renderar felmeddelande om något gick fel
    if (error) {
        return (
            <div className="main-container">
                {/* Visar felmeddelande i en röd ruta */}
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
                {/*Knapp för att försöka igen */}
                <button
                    onClick={fetchTickets}
                    className="retry-button mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Försök igen
                </button>
            </div>
        );
    }

    // Huvudvy för applikationen
    return (
        // Huvudcontainer
        <div className="main-container">
            {/* Sidopanel med personalinformation */}
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

            {/*Sektion för alla ärenden */}
            <div
                className="ticket-tasks"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(setTasks, tasks)}
            >
                <h2 className="ticket-tasks-header">Ärenden</h2>
                {tasks.map((task) => (
                    // Container för varje ärende
                    <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="ticket-task-item"
                    >
                        {/*Redigerbar ärendetitel */}
                        <div className="ticket-task-content"
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleTaskEdit(task.id, e.currentTarget.textContent, setTasks)}
                        >
                            {task.issueType}
                        </div>
                        {/* Container för ärendedetaljer */}
                        <div className="ticket-task-details">
                            <div className="ticket-wtp">{task.wtp}</div>
                            <div className="ticket-task-email">{task.email}</div>
                            <div className="ticket-task-time">{formatDate(task.submittedAt)}</div>
                            <div className="ticket-task-token">
                                {/*Länk till chatten*/}
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

            {/* Sektion för mina ärenden */}
            <div
                className="ticket-my-tasks"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(setMyTasks, myTasks)}
            >
                <h2 className="ticket-my-tasks-header">Mina ärenden</h2>
                {myTasks.map((task) => (
                    // Container för varje ärende
                    <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="ticket-task-item"
                    >
                        {/* Redigerbar ärendetitel */}
                        <div className="ticket-task-content"
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleTaskEdit(task.id, e.currentTarget.textContent, setMyTasks)}
                        >
                            {task.issueType}
                        </div>
                        {/* Container för ärendedetaljer */}
                        <div className="ticket-task-details">
                            <div className="ticket-wtp">{task.wtp}</div>
                            <div className="ticket-task-email">{task.email}</div>
                            <div className="ticket-task-time">{formatDate(task.submittedAt)}</div>
                            <div className="ticket-task-token">
                                {/* Länk till chatten */}
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

            {/* Sektion för färdiga ärenden */}
            <div
                className="ticket-done"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(setDone, done)}
            >
                <h2 className="ticket-done-header">Klara</h2>
                {done.map((task) => (
                    // Container för varje ärende
                    <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="ticket-task-item"
                    >
                        {/* Redigerbar ärendetitel */}
                        <div className="ticket-task-content"
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleTaskEdit(task.id, e.currentTarget.textContent, setDone)}
                        >
                            {task.issueType}
                        </div>
                        {/* Container för ärendedetaljer */}
                        <div className="ticket-task-details">
                            <div className="ticket-wtp">{task.wtp}</div>
                            <div className="ticket-task-time">{formatDate(task.timestamp)}</div>
                            <div className="ticket-task-token">
                                {/* Länk till chatten */}
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

// Exporterar Main-komponenten som default export
export default Main;