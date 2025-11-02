import React from "react";
import FlowCanvas from "./Components/flowchartcanvas";

/**
 * Root app - shows header and FlowCanvas
 */
export default function App() {
  return (
    <div className="app-root">
      <header className="topbar">
        <h3>Chatbot Flow Builder</h3>
      </header>
      <FlowCanvas />
    </div>
  );
}
