import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [activeTab, setActiveTab] = useState("uncategorized");
  const [allCompletedModal, setAllCompletedModal] = useState(false);
  // New state for standalone categories
  const [standaloneCategories, setStandaloneCategories] = useState([]);

  // Extract unique categories from todos and merge with standalone categories
  const categories = [
    ...new Set([
      ...standaloneCategories,
      ...todos.filter((todo) => todo.category).map((todo) => todo.category),
    ]),
  ];

  // Check if all tasks in current tab are completed
  useEffect(() => {
    const currentTodos =
      activeTab === "all"
        ? todos
        : activeTab === "uncategorized"
        ? todos.filter((todo) => !todo.category)
        : todos.filter((todo) => todo.category === activeTab);

    // Only show completion modal if there are tasks and all are completed
    if (
      currentTodos.length > 0 &&
      currentTodos.every((todo) => todo.completed)
    ) {
      setAllCompletedModal(true);
    }
  }, [todos, activeTab]);

  const addTodo = (todo) => {
    setTodos((prevTodos) => [...prevTodos, todo]);

    // Switch to the new category tab if a todo with new category is added
    if (todo.category && !categories.includes(todo.category)) {
      setActiveTab(todo.category);
    }
  };

  const handleCategoryAdd = (newCategory) => {
    // Add the category to standalone categories if it doesn't already exist
    if (!categories.includes(newCategory)) {
      setStandaloneCategories((prev) => [...prev, newCategory]);
      // Switch to the new category tab immediately
      setActiveTab(newCategory);
    }
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
  };

  // Get the name of the current tab for display purposes
  const getCurrentTabName = () => {
    if (activeTab === "all") return "All Tasks";
    if (activeTab === "uncategorized") return "Uncategorized Tasks";
    return activeTab;
  };

  return (
    <div className="todo-app">
      <header>
        <h1>Todo List</h1>
        <p>Week 1 System Admin Weekly Project</p>
      </header>

      <main>
        <section className="todo-container">
          <TodoForm
            onAdd={addTodo}
            categories={categories}
            onCategoryAdd={handleCategoryAdd}
          />

          <div className="tab-navigation">
            <button
              className={activeTab === "uncategorized" ? "active-tab" : ""}
              onClick={() => setActiveTab("uncategorized")}
            >
              Uncategorized
            </button>
            <button
              className={activeTab === "all" ? "active-tab" : ""}
              onClick={() => setActiveTab("all")}
            >
              All Tasks
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={activeTab === category ? "active-tab" : ""}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="todo-content">
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              activeTab={activeTab}
            />
          </div>
        </section>
      </main>

      {/* All tasks completed modal */}
      <Modal
        isOpen={allCompletedModal}
        onClose={() => setAllCompletedModal(false)}
        title="All Tasks Completed!"
        type="success"
      >
        <div className="notification-message success">
          <div className="notification-icon">🎉</div>
          <p>
            Congratulations! You've completed all tasks in{" "}
            <strong>{getCurrentTabName()}</strong>.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default App;
