import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { Box } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { initialNodes } from "./Workflow.constants";
import CustomEdge from "./CustomEdge";
import TextNode from "./TextNode";
import SettingsPanel from "./SettingsPanel";
import SaveButton from "./SaveButton";
import toast from "react-hot-toast";

const nodeTypes = {
  textNode: TextNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const initialEdges: Edge[] = [];

export const Workflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reactFlowInstance = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((prevEdges) =>
        addEdge(
          {
            ...connection,
            animated: true,
            id: `${edges.length + 1}`,
            type: "customEdge",
          },
          prevEdges
        )
      );
    },
    [edges, setEdges]
  );

  const selectedNode = nodes.find((n) => n.id === selected && n.type === "textNode");

  const handleSave = () => {
    setError(null);
    if (nodes.length > 1) {
      const nodeIdsWithIncoming = new Set(edges.map((e) => e.target));
      const nodesWithNoIncoming = nodes.filter((n) => !nodeIdsWithIncoming.has(n.id));
      if (nodesWithNoIncoming.length > 1) {
        const errMsg = "Error: More than one node has empty target handles.";
        // setError(errMsg);
        toast.error(errMsg); 
        return;
      }
    }
    const flow = { nodes, edges };
    localStorage.setItem("flow", JSON.stringify(flow));
    // setError(null);
    toast.success("Flow saved!"); 
  };

  useEffect(() => {
    const saved = localStorage.getItem("flow");
    if (saved) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
      setNodes(savedNodes || []);
      setEdges(savedEdges || []);
    }
  }, [setNodes, setEdges]);

  return (
    <Box height="100vh" width="100vw" display="flex">
      <Box width="220px" bg="#f7f7f7" p={2} height="100%">
        {selectedNode ? (
          <>
            <SettingsPanel
              value={selectedNode.data.text}
              onChange={(v) =>
                setNodes((ns) =>
                  ns.map((n) =>
                    n.id === selectedNode.id ? { ...n, data: { ...n.data, text: v } } : n
                  )
                )
              }
            />
            <button
              style={{
                marginTop: 16,
                background: "#e53e3e",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 12px",
                cursor: "pointer",
                width: "100%",
                fontWeight: 600,
              }}
              onClick={() => {
                setNodes((ns) => ns.filter((n) => n.id !== selectedNode.id));
                setEdges((es) => es.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
                setSelected(null);
              }}
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Panel</div>
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/reactflow", "textNode");
                e.dataTransfer.effectAllowed = "move";
              }}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: 6,
                background: "#fff",
                cursor: "grab",
                marginBottom: 16,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Message
            </div>
            <SaveButton onClick={handleSave} />
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          </>
        )}
      </Box>
      <Box flex={1} height="100%">
        <ReactFlow
          style={{ height: "100%" }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          onDrop={(e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData("application/reactflow");
            if (type === "textNode") {
              const bounds = e.currentTarget.getBoundingClientRect();
              const position = reactFlowInstance.project({
                x: e.clientX - bounds.left,
                y: e.clientY - bounds.top,
              });
              setNodes((prev) => [
                ...prev,
                {
                  id: `${+new Date()}`,
                  type: "textNode",
                  position,
                  data: { text: "Message" },
                },
              ]);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onNodeClick={(_, node) => setSelected(node.id)}
          onPaneClick={() => setSelected(null)}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="20"
              markerHeight="20"
              refX="10"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L10,5 L0,10 Z" fill="#222" />
            </marker>
          </defs>
          <Background />
          <Controls />
        </ReactFlow>
      </Box>
    </Box>
  );
};
