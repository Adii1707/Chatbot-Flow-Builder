import React from "react";

/**
 * NodesPanel provides draggable node types.
 * When drag starts we add the MIME type "application/reactflow" with value node type.
 */

export default function NodesPanel() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="nodes-panel">
      <h4>Nodes</h4>
      <div
        className="node-item"
        onDragStart={(e) => onDragStart(e, "textNode")}
        draggable
      >
        <div className="node-icon">💬</div>
        <div className="node-label">Message</div>
      </div>

      <p style={{ fontSize: 12, color: "#666", marginTop: 12 }}>Drag to canvas</p>
    </div>
  );
}
