'use client'

import { useEffect, useCallback, useState, memo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Handle,
  Position,
  MarkerType,
} from 'reactflow'
import { Package, Info } from 'lucide-react'
import 'reactflow/dist/style.css'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dependency } from '@/Utils/DependencyModel'

type DependencyViewPageProps = {
  dependencies: Dependency[];
}

// Custom node component
const CustomNode = memo(({ data }: { data: Dependency }) => {
  // Determine border color based on the outdated status
  const borderColor = data.outdated ? 'border-red-500' : 'border-green-500';

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${borderColor}`}>
      <div className="flex items-center">
        <Package className="mr-2" />
        <div className="text-lg font-bold">{data.name}</div>
      </div>
      <div className="text-gray-500">{data.version}</div>
      <div className="mt-2">
        <div className="text-sm">License: {data.license || 'N/A'}</div>
        <div className="text-sm">Downloads: {data.downloads?.toLocaleString() || 'N/A'}</div>
      </div>
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
const nodeTypes = { custom: CustomNode };

export default function DependencyViewPage({ dependencies }: DependencyViewPageProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  };

  const layoutNodes = (nodes: Node[], edges: Edge[]) => {
    const levelHeight = 250;
    const nodeWidth = 250;
    const nodeHeight = 100;
    const horizontalSpacing = 300;

    const nodeLevels: { [key: string]: number } = {};
    const getNodeLevel = (nodeId: string): number => {
      if (nodeLevels[nodeId] !== undefined) return nodeLevels[nodeId];
      const childEdges = edges.filter(e => e.source === nodeId);
      if (childEdges.length === 0) return 0;
      const childLevels = childEdges.map(e => getNodeLevel(e.target));
      return Math.max(...childLevels) + 1;
    };

    nodes.forEach(node => {
      nodeLevels[node.id] = getNodeLevel(node.id);
    });

    const maxLevel = Math.max(...Object.values(nodeLevels));

    const levelCounts: { [key: number]: number } = {};
    Object.values(nodeLevels).forEach(level => {
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });

    const newNodes = nodes.map(node => {
      const level = nodeLevels[node.id];
      const nodesAtLevel = levelCounts[level];
      const index = nodes.filter(n => nodeLevels[n.id] === level).indexOf(node);

      const y = (maxLevel - level) * levelHeight + (levelHeight - nodeHeight) / 2;
      const x = (index - (nodesAtLevel - 1) / 2) * horizontalSpacing + (horizontalSpacing - nodeWidth) / 2;

      return { ...node, position: { x, y }, draggable: false, selectable: false }; // Disable dragging and selection
    });

    return newNodes;
  };

  useEffect(() => {
    if (dependencies && dependencies.length > 0) {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      const addNodeAndEdges = (dep: Dependency, parentId?: string) => {
        const id = `${dep.name}-${dep.version}`;

        newNodes.push({
          id,
          type: 'custom',
          data: dep,
          position: { x: 0, y: 0 },
          draggable: false,
          selectable: false,
        });

        if (parentId) {
          newEdges.push({
            id: `${parentId}-${id}`,
            source: parentId,
            target: id,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          });
        }

        if (dep.dependencies) {
          Object.entries(dep.dependencies).forEach(([name, version]) => {
            addNodeAndEdges({ name, version }, id);
          });
        }
      };

      dependencies.forEach((dep) => addNodeAndEdges(dep));

      const layoutedNodes = layoutNodes(newNodes, newEdges);
      setNodes(layoutedNodes);
      setEdges(newEdges);
    }
  }, [dependencies, setNodes, setEdges]);

  const highlightedEdges = edges.map((edge) => ({
    ...edge,
    style: {
      stroke: selectedNode && (edge.source === selectedNode || edge.target === selectedNode) ? '#3b82f6' : '#999',
      strokeWidth: selectedNode && (edge.source === selectedNode || edge.target === selectedNode) ? 2 : 1,
    },
  }));

  if (!dependencies || dependencies.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No dependencies to display. Please provide a list of dependencies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={highlightedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={onNodeClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="fixed bottom-4 right-4 p-2 bg-gray-200 rounded-full">
              <Info className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2">
              <p>Node color indicates license type:</p>
              <ul>
                <li>Green: MIT</li>
                <li>Blue: Apache</li>
                <li>Yellow: Other</li>
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
