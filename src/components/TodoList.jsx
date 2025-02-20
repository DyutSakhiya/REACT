// TodoApp.jsx
import React, { useState } from "react";

function TodoApp() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);


  const handleAddTodo = () => {
    if (todo.trim()) {
      if (editIndex !== null) {
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = todo;
        setTodos(updatedTodos);
        setEditIndex(null);
      } else {
        setTodos([...todos, todo]);
      }
      setTodo("");
    }
  };
 
 
 ;

  const handleEditTodo = (index) => {
    setTodo(todos[index]); 
    setEditIndex(index);
  };


  const handleDeleteTodo = (index) => {
    console.log({index});
    const newTodos = todos.filter((_ , i) => i !== index);
    console.log({newTodos})
    setTodos(newTodos);
  };

  return (
    <div className="min-h-screen  flex justify-center items-center">
      <div className="w-full max-w-md bg-gray-300 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Todo List
        </h1>
        <div className="text-center text-gray-600 mb-4">
          Total Todos: {todos.length}
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            value={todo}
            
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Enter a task..."
            className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
            <button
              onClick={handleAddTodo}
              className="bg-green-600 text-white px-6 ml-1 py-2 rounded-r-md hover:bg-green-700 focus:outline-none"
            >
             {editIndex !== null ? "Update" : "Add"}

            </button>
          </div>
          <ul className="space-y-4">
          {todos.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center  bg-gray-200 px-4 py-2 rounded-md shadow-md"
            >
              <span className="font-bold text-xl text-gray-700 mr-2">
                {index + 1}.
              </span>
              <span>{task}</span>
              <button
               onClick={() => handleEditTodo(index)}
                className="text-green-600 hover:text-green-800 pl-[180px] focus:outline-none"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTodo(index)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                Delete
              </button>
              
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoApp;
