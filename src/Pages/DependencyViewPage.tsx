'use client'

import { useEffect, useCallback } from 'react'
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
} from 'reactflow'
import { Package } from 'lucide-react'
import 'reactflow/dist/style.css'
import { Dependency } from '@/Utils/DependencyModel'

type DependencyViewPageProps = {
  dependencies: Dependency[];
}

export default function DependencyViewPage({ dependencies }: DependencyViewPageProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  // Improved layout function
  const layoutNodes = (nodes: Node[], edges: Edge[]) => {
    const levelWidth = 300
    const levelHeight = 100
    const nodeWidth = 180
    const nodeHeight = 40

    // Create a map of node levels
    const nodeLevels: { [key: string]: number } = {}
    const getNodeLevel = (nodeId: string): number => {
      if (nodeLevels[nodeId] !== undefined) return nodeLevels[nodeId]
      const parentEdges = edges.filter(e => e.target === nodeId)
      if (parentEdges.length === 0) return 0
      const parentLevels = parentEdges.map(e => getNodeLevel(e.source))
      return Math.max(...parentLevels) + 1
    }

    nodes.forEach(node => {
      nodeLevels[node.id] = getNodeLevel(node.id)
    })

    // Count nodes at each level
    const levelCounts: { [key: number]: number } = {}
    Object.values(nodeLevels).forEach(level => {
      levelCounts[level] = (levelCounts[level] || 0) + 1
    })

    // Position nodes
    const newNodes = nodes.map(node => {
      const level = nodeLevels[node.id]
      const nodesAtLevel = levelCounts[level]
      const index = nodes.filter(n => nodeLevels[n.id] === level).indexOf(node)
      
      const x = level * levelWidth + (levelWidth - nodeWidth) / 2
      const y = (index - (nodesAtLevel - 1) / 2) * levelHeight + (levelHeight - nodeHeight) / 2

      return { ...node, position: { x, y } }
    })

    return newNodes
  }

  useEffect(() => {
    if (dependencies && dependencies.length > 0) {
      const newNodes: Node[] = []
      const newEdges: Edge[] = []

      const addNodeAndEdges = (dep: Dependency, parentId?: string) => {
        const id = `${dep.name}-${dep.version}`
        
        newNodes.push({
          id,
          data: { label: `${dep.name}@${dep.version}` },
          position: { x: 0, y: 0 }, // Initial position, will be updated by layoutNodes
        })

        if (parentId) {
          newEdges.push({
            id: `${parentId}-${id}`,
            source: parentId,
            target: id,
            animated: true,
          })
        }

        if (dep.dependencies) {
          Object.entries(dep.dependencies).forEach(([name, version]) => {
            addNodeAndEdges({ name, version }, id)
          })
        }
      }

      dependencies.forEach((dep) => addNodeAndEdges(dep))

      const layoutedNodes = layoutNodes(newNodes, newEdges)
      setNodes(layoutedNodes)
      setEdges(newEdges)
    }
  }, [dependencies, setNodes, setEdges])

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
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}