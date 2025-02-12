import { useState } from "react";

function Main() {
  const [tasks, setTasks] = useState([]); 
  const [myTasks, setMyTasks] = useState([]); 
  const [done, setDone] = useState([]); 
  const [draggedTask, setDraggedTask] = useState(null);

  // Array med företagsnamn som kan dras
  const companies = ["Tesla", "Apple", "Google", "Meta", "Massive", "Amazon"];

  const handleDragStart = (company) => {
    setDraggedTask(company);
  };

  const handleDrop = (setTargetColumn, targetColumn) => {
    if (draggedTask) {
      // Kontrollera om uppgiften redan finns i någon kolumn
      const existsInAnyColumn = [
        ...tasks,
        ...myTasks,
        ...done
      ].includes(draggedTask);

      if (!existsInAnyColumn) {
        // Lägg bara till om uppgiften inte redan finns
        setTargetColumn([...targetColumn, draggedTask]);
      } else {
        // Om uppgiften redan finns, flytta den
        setTasks((prev) => prev.filter((task) => task !== draggedTask));
        setMyTasks((prev) => prev.filter((task) => task !== draggedTask));
        setDone((prev) => prev.filter((task) => task !== draggedTask));
        setTargetColumn([...targetColumn, draggedTask]);
      }
      setDraggedTask(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleTaskEdit = (index, newValue, setColumn) => {
    setColumn((prev) => {
      const newTasks = [...prev];
      newTasks[index] = newValue;
      return newTasks;
    });
  };

  // Modifierad renderTask funktion för att hantera både företag och uppgifter
  const renderTask = (task, index, setColumn) => (
    <div
      key={index}
      draggable
      className="task-item"
      onDragStart={() => handleDragStart(task)}
    >
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleTaskEdit(index, e.target.textContent, setColumn)}
        className="task-content"
      >
        {task}
      </div>
    </div>
  );

  return (
    <div className="main-container">
      <aside className="staff-aside">
        <h2 className="company-name">Företagsnamn</h2>
        {companies.map((company, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(company)}
            className="company-item"
          >
            {company}
          </div>
        ))}
      </aside>

      <div
        className="tasks"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(setTasks, tasks)}
      >
        <h2 className="tasks-header">Tasks</h2>
        {tasks.map((task, index) => renderTask(task, index, setTasks))}
      </div>

      <div
        className="my-tasks"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(setMyTasks, myTasks)}
      >
        <h2 className="my-tasks-header">My Tasks</h2>
        {myTasks.map((task, index) => renderTask(task, index, setMyTasks))}
      </div>

      <div
        className="done"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(setDone, done)}
      >
        <h2 className="done-header">Done</h2>
        {done.map((task, index) => renderTask(task, index, setDone))}
      </div>
    </div>
  );
}

export default Main;