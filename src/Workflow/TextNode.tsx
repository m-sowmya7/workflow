import React from "react";
import { NodeProps } from "reactflow";
import CustomHandle from "./CustomHandle";
import { Position } from "reactflow";

export default function TextNode({ id, data }: NodeProps<{ text: string }>) {
  return (
    <div style={{ background: "#fff", border: "1px solid #aaa", borderRadius: 8, padding: 12, minWidth: 120 }}>
      <div style={{ marginBottom: 8 }}>{data.text}</div>
  <CustomHandle type="source" position={Position.Right} />
  <CustomHandle type="target" position={Position.Left} />
    </div>
  );
}
