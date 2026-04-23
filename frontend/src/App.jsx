import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = 'http://13.232.222.180:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks. Is Flask running?");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a task
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/tasks`, { title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      setError("Failed to create task.");
    }
    setLoading(false);
  };

  // Delete a task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>🗂️ Task Manager</h1>
        <p>A CI/CD Portfolio Project · Flask + React + Docker</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* Add Task Form */}
      <form onSubmit={handleCreate} className="task-form">
        <input
          type="text"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
        />
        <button type="submit" className="btn-add" disabled={loading}>
          {loading ? "Adding..." : "+ Add Task"}
        </button>
      </form>

      {/* Task Count */}
      <div className="task-count">
        {tasks.length === 0
          ? "No tasks yet — add one above!"
          : `${tasks.length} task${tasks.length > 1 ? "s" : ""}`}
      </div>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-info">
              <span className="task-id">#{task.id}</span>
              <span className="task-title">{task.title}</span>
            </div>
            <button
              className="btn-delete"
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="footer">
        Built with Flask · React · SQLite · Docker · GitHub Actions · AWS
      </div>
    </div>
  );
}

export default App;