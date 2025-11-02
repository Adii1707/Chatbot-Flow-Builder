import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MarkerType,
  Node,
  NodeChange,
  NodeTypes,
  ReactFlowInstance,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import TextNode from "../Nodes/TextNode";
import NodesPanel from "../NodesPanel";
import SettingsPanel from "../SettingsPanel";
import { v4 as uuidv4 } from "uuid";
import "./FlowCanvas.css";

/**
 * FlowCanvas renders the React Flow area + left Nodes Panel and right Settings/Save button.
 *
 * Behaviors:
 * - Drag & drop to add nodes from panel
 * - Custom TextNode with a source and a target handle
 * - Only one outgoing edge allowed from a source handle
 * - Target handle allows multiple incoming edges
 * - Settings panel appears when a node is selected
 * - Save validation ensures only one node with empty source handle
 */

const initialNodes: Node[] = [
  {
    id: "node-1",
    position: { x: 100, y: 200 },
    data: { label: "test message 1", type: "text" },
    type: "textNode",
  },
];

const initialEdges: Edge[] = [];

export default function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // ✅ use React Flow state hooks instead of removeElements
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nodeTypes: NodeTypes = useMemo(() => ({ textNode: TextNode }), []);

  // ---- Enforce single outgoing edge per node's source handle
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source) return;

      const alreadyOutgoing = edges.some(
        (e) => e.source === connection.source
      );
      if (alreadyOutgoing) {
        setError("A source handle can have only one outgoing connection.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      const newEdge = {
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
        type: "smoothstep",
        markerEnd: { type: MarkerType.Arrow },
      } as Edge;

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [edges, setEdges]
  );

  // Remove node or edge
  const onElementsRemove = useCallback(
    (elementsToRemove: (Node | Edge)[]) => {
      const nodeIdsToRemove = elementsToRemove
        .filter((el: any) => el.position !== undefined)
        .map((n: any) => n.id);

      if (nodeIdsToRemove.length > 0) {
        setNodes((nds) => nds.filter((n) => !nodeIdsToRemove.includes(n.id)));
        setEdges((eds) =>
          eds.filter(
            (e) =>
              !nodeIdsToRemove.includes(e.source) &&
              !nodeIdsToRemove.includes(e.target)
          )
        );
        setSelectedNode(null);
      } else {
        setEdges((eds) =>
          eds.filter(
            (e) => !elementsToRemove.some((r) => (r as any).id === e.id)
          )
        );
      }
    },
    [setNodes, setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Drop handler to add node from panel
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !rfInstance) return;
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) return;

      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const id = uuidv4();
      const newNode: Node = {
        id,
        type: "textNode",
        position,
        data: { label: "New message", type: "text" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const updateNodeDataText = useCallback(
    (id: string, text: string) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, label: text } } : n
        )
      );
      setSelectedNode((sel) =>
        sel && sel.id === id
          ? { ...sel, data: { ...sel.data, label: text } }
          : sel
      );
    },
    [setNodes]
  );

  const onSave = useCallback(() => {
    setError(null);
    if (nodes.length <= 1) {
      alert("Flow saved (no validation issues)");
      return;
    }

    const nodesWithNoOutgoing = nodes.filter(
      (n) => !edges.some((e) => e.source === n.id)
    );

    if (nodesWithNoOutgoing.length > 1) {
      setError(
        "Cannot save Flow — more than one node has an empty source handle."
      );
      return;
    }

    alert("Flow saved successfully!");
  }, [nodes, edges]);

  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const removeSelected = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  return (
    <ReactFlowProvider>
      <div className="flowpage">
        <div className="left-panel">
          {selectedNode ? (
            <SettingsPanel
              node={selectedNode}
              onChangeText={(text) => updateNodeDataText(selectedNode.id, text)}
              onDelete={removeSelected}
            />
          ) : (
            <NodesPanel />
          )}
          <div className="save-block">
            <button className="save-btn" onClick={onSave}>
              Save Changes
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        </div>

        <div className="canvas" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onInit={setRfInstance}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
