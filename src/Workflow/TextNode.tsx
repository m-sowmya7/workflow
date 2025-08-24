import React from "react";
import { NodeProps, Position, Handle } from "reactflow";

export default function TextNode({ id, data }: NodeProps<{ text: string }>) {
  return (
    <div style={{ background: "#fff", border: "1px solid #aaa", borderRadius: 8, padding: 12, minWidth: 120 }}>
      <div style={{ marginBottom: 8 }}>{data.text}</div>
      {/* Source handle on the right */}
      <Handle type="source" position={Position.Right} />
      {/* Target handle on the left */}
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
