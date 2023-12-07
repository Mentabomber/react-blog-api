import { useEffect, useState } from "react";

let initialFetchDone = false;

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  async function fetchTodos() {
    const url = 'https://jsonplaceholder.typicode.com/todos'

    /*
      Usando la funzione Fetch di JS, possiamo fare una richiesta HTTP

      La funzione ritorna uan Promise contenente la risposta del server (istanza di una classe Response)
      ma non possiamo leggere il body della risposta direttamente in quanto è un ReadableStream (codice binario)

      Per ottenere il body della risposta, dobbiamo usare il metodo .json() della classe Response
      il quale ritorna una Promise contenente il body della risposta convertito in JSON
    */
    // const resp = await fetch(url);
    // const data = await resp.json();

    const data = await (await fetch(url)).json();

    setTodos(data);
  }

  useEffect(() => {
    if (!initialFetchDone) {
      initialFetchDone = true;
      fetchTodos();
    }
  }, []);

  return (<ul>
    {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
  </ul>);
}