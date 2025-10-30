import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Voiqq - Accessible PDF Reader</h1>
        <p>Upload, read, and tag PDFs with ease.</p>
      </header>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">SaaS features here...</p>
    </div>
  );
}

export default App;
