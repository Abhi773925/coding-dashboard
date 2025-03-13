import { useState } from "react";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: ["Task 1", "Task 2"],
    inProgress: ["Task 3"],
    completed: ["Task 4"],
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* To-Do Column */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="text-lg font-semibold">To-Do</h4>
        {tasks.todo.map((task, index) => (
          <div key={index} className="p-2 mt-2 bg-white shadow rounded">
            {task}
          </div>
        ))}
      </div>

      {/* In Progress Column */}
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h4 className="text-lg font-semibold">In Progress</h4>
        {tasks.inProgress.map((task, index) => (
          <div key={index} className="p-2 mt-2 bg-white shadow rounded">
            {task}
          </div>
        ))}
      </div>

      {/* Completed Column */}
      <div className="bg-green-100 p-4 rounded-lg">
        <h4 className="text-lg font-semibold">Completed</h4>
        {tasks.completed.map((task, index) => (
          <div key={index} className="p-2 mt-2 bg-white shadow rounded">
            {task}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
