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
      const edge = {
        ...connection,
        animated: true,
        id: `${edges.length} + 1`,
        type: "customEdge",
      };
      setEdges((prevEdges) => addEdge(edge, prevEdges));
    },
    [edges]
  );

  const selectedNode = nodes.find(n => n.id === selected && n.type === "textNode");

  const handleSave = () => {
    setError(null);
    if (nodes.length > 1) {
      const nodeIdsWithIncoming = new Set(edges.map(e => e.target));
      const nodesWithNoIncoming = nodes.filter(n => !nodeIdsWithIncoming.has(n.id));
      if (nodesWithNoIncoming.length > 1) {
        setError("Error: More than one node has empty target handles.");
        return;
      }
    }
    const flow = { nodes, edges };
    localStorage.setItem("flow", JSON.stringify(flow));
    setError(null);
    alert("Flow saved!");
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
    <Box height="100" width="100%" display="flex">
      <Box width="220px" bg="#f7f7f7" p={2} borderRight="1px solid #ddd">
        {selectedNode ? (
          <SettingsPanel
            value={selectedNode.data.text}
            onChange={v => setNodes(ns => ns.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, text: v } } : n))}
          />
        ) : (
          <>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Nodes Panel</div>
            <div
              draggable
              onDragStart={e => {
                e.dataTransfer.setData("application/reactflow", "textNode");
                e.dataTransfer.effectAllowed = "move";
              }}
              style={{
                padding: 10,
                background: "#fff",
                border: "1px solid #aaa",
                borderRadius: 6,
                cursor: "grab",
                marginBottom: 8,
              }}
            >
              Text Node
            </div>
            <SaveButton onClick={handleSave} />
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          </>
        )}
      </Box>
      <Box flex={1} height="500px">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          onDrop={e => {
            e.preventDefault();
            const type = e.dataTransfer.getData("application/reactflow");
            if (type === "textNode") {
              const bounds = e.currentTarget.getBoundingClientRect();
              const position = reactFlowInstance.project({
                x: e.clientX - bounds.left,
                y: e.clientY - bounds.top,
              });
              setNodes(prev => [
                ...prev,
                {
                  id: `${+new Date()}`,
                  type: "textNode",
                  position,
                  data: { text: "Text Message" },
                },
              ]);
            }
          }}
          onDragOver={e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onNodeClick={(_, node) => setSelected(node.id)}
          onPaneClick={() => setSelected(null)}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Box>
    </Box>
  );
};
