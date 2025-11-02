import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

/**
 * Custom Text Node component.
 *
 * We render:
 * - a top "title" bar with icon + name
 * - the message label
 * - left handle = target (incoming allowed multiple)
 * - right handle = source (outgoing only one; enforced in onConnect)
 */

import "./textnode.css";

type Data = {
  label: string;
  type?: string;
};

export default function TextNode({ id, data }: NodeProps<Data>) {
  return (
    <div className="textnode">
      {/* left target handle (incoming) */}
      <Handle type="target" position={Position.Left} id={`target-${id}`} />
      <div className="textnode-header">
        <span className="title">Send Message</span>
        <span className="whatsapp-badge">💬</span>
      </div>
      <div className="textnode-body">{data?.label}</div>
      {/* right source handle (outgoing) */}
      <Handle type="source" position={Position.Right} id={`source-${id}`} />
    </div>
  );
}
