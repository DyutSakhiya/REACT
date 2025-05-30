import React, { useEffect, useState, useMemo } from "react";

const Todos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );
        const data = await response.json();
        setTodos(data);
        console.log("Fetched Todos:", data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  // const completedTodos = todos.filter((todo) => todo.completed === true);

  const completedTodos =  useMemo(() => todos.filter((todo) => todo.completed === true), [todos])

  return (
    <div>
      <h1>Completed Todos</h1>
      <ul>
        {completedTodos.map((todo) => (
          <li key={todo.id}>
            {todo.userId} | {todo.id} | {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
