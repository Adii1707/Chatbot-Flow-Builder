import React, { useState, useEffect } from "react";
import { Node } from "reactflow";

type Props = {
  node: Node;
  onChangeText: (text: string) => void;
  onDelete: () => void;
};

export default function SettingsPanel({ node, onChangeText, onDelete }: Props) {
  const [text, setText] = useState<string>((node.data && node.data.label) || "");

  useEffect(() => {
    setText((node.data && node.data.label) || "");
  }, [node]);

  function saveText() {
    onChangeText(text);
  }

  return (
    <div className="settings-panel">
      <button className="back-btn" onClick={() => onChangeText(text)}>
        ←
      </button>
      <h4>Message</h4>

      <div className="form-group">
        <label>Text</label>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={saveText}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={saveText}>Save</button>
        <button className="btn btn-danger" onClick={onDelete}>Delete Node</button>
      </div>
    </div>
  );
}
