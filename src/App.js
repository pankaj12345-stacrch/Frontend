import React, { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, clearTasks, updateTask } from "./services/taskService";
import "./App.css"; // Import CSS

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchTasks = async () => {
    const { data } = await getTasks();
    setTasks(data);
  };

  const addTask = async () => {
    if (!newTitle.trim()) return;
    await createTask({
      title: newTitle,
      description: newDescription,
      isCompleted: false
    });
    setNewTitle("");
    setNewDescription("");
    fetchTasks();
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleClearAll = async () => {
    await clearTasks();
    fetchTasks();
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async () => {
    await updateTask(editingId, {
      id: editingId,
      title: editTitle,
      description: editDescription,
      isCompleted: tasks.find(t => t.id === editingId)?.isCompleted || false
    });
    setEditingId(null);
    fetchTasks();
  };

  const toggleCompletion = async (task) => {
    await updateTask(task.id, {
      ...task,
      isCompleted: !task.isCompleted
    });
    fetchTasks();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      <h1>📋 Task Management</h1>

      <div className="input-group">
        <input
          className="input-field"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter task title"
        />
        <input
          className="input-field"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter task description"
        />
        <button className="btn add-btn" onClick={addTask}>Add</button>
        <button className="btn clear-btn" onClick={handleClearAll}>Clear All</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleCompletion(task)}
            />
            {editingId === task.id ? (
              <>
                <input
                  className="edit-field"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  className="edit-field"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <button className="btn save-btn" onClick={saveEdit}>Save</button>
                <button className="btn cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span className={`task-text ${task.isCompleted ? "completed" : ""}`}>
                  <b>{task.title}</b> — {task.description}
                </span>
                <button className="btn edit-btn" onClick={() => startEditing(task)}>✏️ Edit</button>
                <button className="btn delete-btn" onClick={() => removeTask(task.id)}>❌ Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
