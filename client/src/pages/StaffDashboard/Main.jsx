// Importerar useState-funktionen från React, som låter oss hantera state (data som kan ändras) i komponenten
import { useState } from "react";


function Main() {
  // Skapar tre olika states för våra olika kolumner av uppgifter. Varje state börjar som en tom array [] ingen jävla hårdkodning här inte
  const [tasks, setTasks] = useState([]); 
  const [myTasks, setMyTasks] = useState([]); 
  const [done, setDone] = useState([]); 
  
  // State för att hålla koll på vilken uppgift som dras just nu. Null betyder att ingen uppgift dras
  const [draggedTask, setDraggedTask] = useState(null);

  // Funktion som körs när användaren börjar dra en uppgift
  const handleDragStart = (task) => {
    setDraggedTask(task); // Sparar den dragna uppgiften i state
  };

  // Funktion som körs när en uppgift släpps i en ny kolumn
  const handleDrop = (setTargetColumn, targetColumn) => {
    if (draggedTask) { // Kontrollerar om det finns en uppgift som dras
      
      // Tar bort uppgiften från alla kolumner genom att filtrera bort den
      setTasks((prev) => prev.filter((task) => task !== draggedTask));
      setMyTasks((prev) => prev.filter((task) => task !== draggedTask));
      setDone((prev) => prev.filter((task) => task !== draggedTask));
      
      // Lägger till uppgiften i den nya kolumnen
      setTargetColumn([...targetColumn, draggedTask]);
      // Nollställer den dragna uppgiften
      setDraggedTask(null);
    }
  };

  // Funktion som förhindrar standardbeteendet när något dras över en droppzon
  const handleDragOver = (e) => e.preventDefault();

  // Funktion som hanterar redigering av en uppgift
  const handleTaskEdit = (index, newValue, setColumn) => {
    setColumn((prev) => {
      const newTasks = [...prev]; // Skapar en kopia av alla uppgifter
      newTasks[index] = newValue; // Uppdaterar den specifika uppgiften
      return newTasks; // Returnerar den uppdaterade listan
    });
  };

  // Funktion för att lägga till en ny uppgift i en kolumn
  const addTask = (setColumn) => {
    setColumn((prev) => [...prev, 'Ny uppgift']); // Lägger till "Ny uppgift" i slutet av listan
  };

  // Hjälpfunktion som skapar HTML-strukturen för en enskild uppgift
  const renderTask = (task, index, setColumn) => (
    <div
      key={index} // Unik nyckel som React behöver för att hålla reda på element i listor
      draggable // Gör elementet dragbart
      className="task-item" // CSS-klass för styling
      onDragStart={() => handleDragStart(task)} // Kör handleDragStart när dragging börjar
    >
      <div
        contentEditable // Gör texten redigerbar
        suppressContentEditableWarning // Förhindrar React-varningar för contentEditable
        onBlur={(e) => handleTaskEdit(index, e.target.textContent, setColumn)} // Kör handleTaskEdit när redigering är klar
        className="task-content" // CSS-klass för styling
      >
        {task} 
      </div>
    </div>
  );

  // Här börjar själva renderingen av komponenten (det som syns på skärmen)
  return (
    <div className="main-container"> {/* Huvudcontainer för hela appen */}
      {/* Sidopanel med personal */}
      <aside className="staff-aside">
        <h2 className="company-name">Företagsnamn</h2>
        <div>Martin</div>
        <div>Ville</div>
        <div>Kevin</div>
        <div>Shaban</div>
        <div>Sigge</div>
        <div>Sebbe</div>
      </aside>

      {/* Tasks-kolumnen */}
      <div
        className="tasks"
        onDragOver={handleDragOver} // Tillåter att saker dras över denna kolumn
        onDrop={() => handleDrop(setTasks, tasks)} // Hanterar när något släpps i denna kolumn
      >
        <h2 className="tasks-header">Tasks</h2>
        <button 
          className="add-task-button" 
          onClick={() => addTask(setTasks)} // Lägger till ny uppgift när knappen klickas
        >
          + Lägg till ny
        </button>
        {/* Loopar genom alla tasks och renderar varje uppgift */}
        {tasks.map((task, index) => renderTask(task, index, setTasks))}
      </div>

      {/* My Tasks-kolumnen */}
      <div
        className="my-tasks"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(setMyTasks, myTasks)}
      >
        <h2 className="my-tasks-header">My Tasks</h2>
        {/* Loopar genom alla myTasks och renderar varje uppgift */}
        {myTasks.map((task, index) => renderTask(task, index, setMyTasks))}
      </div>

      {/* Done-kolumnen */}
      <div
        className="done"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(setDone, done)}
      >
        <h2 className="done-header">Done</h2>
        {/* Loopar genom alla done-uppgifter och renderar varje uppgift */}
        {done.map((task, index) => renderTask(task, index, setDone))}
      </div>
    </div>
  );
}

export default Main;