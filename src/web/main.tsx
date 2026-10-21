import { useState } from "react";
import { createRoot } from "react-dom/client";
import { generate } from "../core";

/**
 * Minimal editor: one constraint per line, live table preview, JSON download.
 * @returns The app element.
 */
function App() {
  const [text, setText] = useState("A M-F 10:00-16:00 work");
  let table;
  let error = "";
  try {
    table = generate(text.split("\n"));
  } catch (e) {
    error = (e as Error).message;
  }
  const href = table ? `data:application/json,${encodeURIComponent(JSON.stringify(table, null, 2))}` : undefined;
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>Timetable</h1>
      <textarea rows={6} cols={60} value={text} onChange={(e) => setText(e.target.value)} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {href && <p><a href={href} download="timetable.json">Download JSON</a></p>}
      <table border={1} style={{ borderCollapse: "collapse", fontSize: 12 }}>
        <tbody>
          {table?.grid.map((row, r) => (
            <tr key={r}>{row.map((cell, c) => <td key={c}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
