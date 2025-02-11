import { useState } from "react"; 

function Main() { 
  const [tasks, setTasks] = useState([]); // Skapar en state-variabel "tasks" och en funktion "setTasks" för att uppdatera den. Börjar som en tom array.
  const [myTasks, setMyTasks] = useState([]); 
  const [done, setDone] = useState([]); 
  const [draggedTask, setDraggedTask] = useState(null); // Skapar en state-variabel för att hålla den uppgift som dras.

  const handleDragStart = (task) => { // Funktion som anropas när en uppgift börjar dras.
    setDraggedTask(task); // Sätter den aktuella uppgiften som "draggedTask".
  };

  const handleDrop = (setTargetColumn, targetColumn) => { // Funktion som hanterar vad som händer när en uppgift släpps.
    if (draggedTask) { // Om det finns en uppgift som dras...
      setTasks((prev) => prev.filter((task) => task !== draggedTask)); // Tar bort uppgiften från "tasks"-kolumnen.
      setMyTasks((prev) => prev.filter((task) => task !== draggedTask)); // Tar bort uppgiften från "myTasks".
      setDone((prev) => prev.filter((task) => task !== draggedTask)); // Tar bort uppgiften från "done".
      
      setTargetColumn([...targetColumn, draggedTask]); // Lägger till uppgiften i målkolumnen.
      setDraggedTask(null); // Nollställer "draggedTask".
    }
  };

  const handleDragOver = (e) => e.preventDefault(); // Förhindrar standardbeteendet så att drop-eventet fungerar.

  const handleTaskEdit = (index, newValue, setColumn) => { // Funktion som hanterar redigering av en uppgift.
    setColumn((prev) => prev.map((task, i) => (i === index ? newValue : task))); // Uppdaterar uppgiften i kolumnen.
  };

  const addTask = (setColumn) => { // Funktion för att lägga till en ny uppgift.
    setColumn((prev) => [...prev, 'Ny uppgift']); // Lägger till en ny uppgift med texten "Ny uppgift".
  };

  return ( // Returnerar JSX (HTML-liknande kod) som beskriver hur komponenten ska se ut.
    <div className="main-container"> {/* En container som omsluter hela innehållet */}
      <aside className="staff-aside"> {/* En sidopanel som visar företagsnamn och personal */}
        <h2 className="company-name">Företagsnamn</h2>
        <div>Martin</div>
        <div>Ville</div>
        <div>Kevin</div>
        <div>Shaban</div>
        <div>Sigge</div>
        <div>Sebbe</div>
        Inloggad support
      </aside>

      {/* Kolumn för Tasks */}
      <div
        className="tasks"
        onDragOver={handleDragOver} // Tillåter att uppgifter kan dras över denna kolumn.
        onDrop={() => handleDrop(setTasks, tasks)} // Hanterar vad som händer när en uppgift släpps här.
      >
        <h2 className="tasks-header">Tasks</h2> 
        <button className="add-task-button" onClick={() => addTask(setTasks)}>+ Lägg till ny</button> {/* Knapp för att lägga till en ny uppgift */}
        {tasks.map((task, index) => ( // Loopar igenom "tasks" och skapar en div för varje uppgift.
          <div
            key={index} // Unikt nyckelvärde för varje uppgift.
            draggable // Gör att uppgiften kan dras.
            contentEditable // Gör att texten i uppgiften kan redigeras direkt.
            suppressContentEditableWarning={true} // Undertrycker en varning från React om contentEditable.
            onDragStart={() => handleDragStart(task)} // Anropas när uppgiften börjar dras.
            onInput={(e) => handleTaskEdit(index, e.currentTarget.textContent, setTasks)} // Anropas när texten i uppgiften ändras.
            className="task-item" // CSS-klass för styling.
          >
            {task} {/* Visar själva uppgiftens text */}
          </div>
        ))}
      </div>

      {/* Kolumn för My Tasks */}
      <div
        className="my-tasks"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(setMyTasks, myTasks)}
      >
        <h2 className="my-tasks-header">My Tasks</h2>
        {myTasks.map((task, index) => (
          <div
            key={index}
            draggable
            contentEditable
            suppressContentEditableWarning={true}
            onDragStart={() => handleDragStart(task)}
            onInput={(e) => handleTaskEdit(index, e.currentTarget.textContent, setMyTasks)}
            className="task-item"
          >
            {task}
          </div>
        ))}
      </div>

      {/* Kolumn för Done */}
      <div
        className="done"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(setDone, done)}
      >
        <h2 className="done-header">Done</h2>
        {done.map((task, index) => (
          <div
            key={index}
            draggable
            contentEditable
            suppressContentEditableWarning={true}
            onDragStart={() => handleDragStart(task)}
            onInput={(e) => handleTaskEdit(index, e.currentTarget.textContent, setDone)}
            className="task-item"
          >
            {task}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;