import React, { useState } from "react";

function Todolist() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const handleAddTodo = () => {
    {
      setTodos([...todos, todo]);
    }
    setTodo("");
  };

  const handleDeleteTodo = (index) => {
    console.log({ index });
    const newTodos = todo.split(index, 0);
    console.log({ newTodos });
    setTodos(newTodos);
  };

  return (
    <div className="min-h-screen  flex justify-center items-center">
      <div className="w-full max-w-md bg-gray-600 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-300 mb-6">
          Todo List
        </h1>

        <div className="flex mb-4">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Enter a task..."
            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleAddTodo}
          className="bg-blue-600 text-white px-6 ml-40 py-2 mb-4 rounded-md  focus:outline-none"
        >
          Add
        </button>
        <ul className="space-y-4">
          {todos.map((items, index) => (
            <li
              key={index}
              className="flex justify-between items-center  bg-gray-200 px-4 py-2 rounded-md shadow-md"
            >
              <span>{items}</span>
              <button
                onClick={() => handleDeleteTodo(index)}
                className=" flex px-1    rounded-md  focus:outline-none"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todolist;




