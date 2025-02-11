import { useState } from "react";

function Main() {

  const [tasks, setTasks] = useState(['Laga batteri', '2', 'Byta wunderbaum', '4', '5', '6', '7']);
  const [myTasks, setMyTasks] = useState(['1', 'Pumpa däck', '3', '4', '5']);
  const [done, setDone] = useState(['1', '2', '3', 'Vila', '5']);
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = (setTargetColumn, targetColumn) => {
    if (draggedTask) {
      setTasks((prev) => prev.filter((task) => task !== draggedTask));
      setMyTasks((prev) => prev.filter((task) => task !== draggedTask));
      setDone((prev) => prev.filter((task) => task !== draggedTask));

      setTargetColumn([...targetColumn, draggedTask]);
      setDraggedTask(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleTaskChange = (index, newValue, setColumn) => {
    setColumn((prev) => prev.map((task, i) => (i === index ? newValue : task)));
  }

  
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
  
      {/* Tasks Column */}
      <div
        className="tasks"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(setTasks, tasks)}
      >
        <h2 className="tasks-header">Tasks</h2>
        {tasks.map((task, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(task)}
            className="task-item"
          >
            {task}
          </div>
        ))}
      </div>
  
      {/* My Tasks Column */}
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
            onDragStart={() => handleDragStart(task)}
            className="task-item"
          >
            {task}
          </div>
        ))}
      </div>
  
      {/* Done Column */}
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
            onDragStart={() => handleDragStart(task)}
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