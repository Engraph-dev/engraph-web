import CustomEdge from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/custom-edge"
import ModuleNodeComponent from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/module-node"
import ModuleGroupNodeComponent from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/module-node-parent"
import SymbolNodeComponent from "@/components/pages/(protected)/projects/[projectId]/workflows/[workflowId]/symbol-node"
import useWorkflowId from "@/lib/context/workflow-id"
import { workflowData as DEFAULT_WORKFLOW_DATA } from "@/lib/data/sample-workflow"
import { GetWorkflowResponse } from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows/[workflowId]"
import {
	EdgeType,
	GraphNodes,
	ModuleNode,
	NodeType,
	SymbolNode,
} from "@/lib/types/graph"
import dagre from "@dagrejs/dagre"
import {
	Background,
	type Connection,
	Controls,
	type Edge,
	MiniMap,
	type Node,
	ReactFlow,
	addEdge,
	useEdgesState,
	useNodesState,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import React, { useCallback } from "react"

const defaultPosition = { x: 0, y: 0 }

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

const nodeWidth = 250
const nodeHeight = 36

const getLayoutedElements = (
	nodes: GraphNodes,
	edges: Edge[],
	direction = "TB",
) => {
	const isHorizontal = direction === "LR"
	dagreGraph.setGraph({ rankdir: direction })

	nodes.forEach((node) => {
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
	})

	edges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target)
	})

	dagre.layout(dagreGraph)

	const newNodes = nodes.map((node) => {
		const nodeWithPosition = dagreGraph.node(node.id)
		const newNode = {
			...node,
			targetPosition: isHorizontal ? "left" : "top",
			sourcePosition: isHorizontal ? "right" : "bottom",
			// We are shifting the dagre node position (anchor=center center) to the top left
			// so it matches the React Flow node anchor point (top left).
			position: {
				x: nodeWithPosition.x - nodeWidth / 2,
				y: nodeWithPosition.y - nodeHeight / 2,
			},
		}

		return newNode
	})

	return { nodes: newNodes, edges }
}

const edgeTypes = {
	[EdgeType.Bidirectional]: CustomEdge,
}

const nodeTypes = {
	[NodeType.Module]: ModuleNodeComponent,
	[NodeType.Symbol]: SymbolNodeComponent,
	[NodeType.ModuleGroup]: ModuleGroupNodeComponent,
}

export default function Graph({
	workflowData,
}: {
	workflowData: (typeof DEFAULT_WORKFLOW_DATA)["workflowData"]
}) {
	const moduleNodes: ModuleNode[] = workflowData.moduleNodes
		.flat()
		.map(
			(node) =>
				[
					{
						id: node.elementId + "-group",
						data: { ...node, elementId: node.elementId + "-group" },
						type: NodeType.ModuleGroup,
						position: defaultPosition,
						connectable: false,
					},
					{
						id: node.elementId,
						data: node,
						type: NodeType.Module,
						position: defaultPosition,
						parentId: node.elementId + "-group",
						connectable: false,
						extent: "parent",
					},
				] as ModuleNode[],
		)
		.flat()

	const symbolNodes: SymbolNode[] = workflowData.symbolNodes
		.flat()
		.map((node) => ({
			id: node.elementId,
			data: node,
			type: NodeType.Symbol,
			position: defaultPosition,
			parentId: moduleNodes.find(
				(moduleNode) =>
					moduleNode.data.properties.modulePath ===
						node.properties.symbolPath &&
					moduleNode.id.includes("-group"),
			)?.id,
			extent: "parent",
			connectable: false,
		}))

	const initialNodes: GraphNodes = [...moduleNodes, ...symbolNodes]

	const initialEdges: Edge[] = workflowData.nodeLinks
		.flat()
		.map((link) => ({
			id: link.elementId,
			target: link.startNodeElementId,
			source: link.endNodeElementId,
			data: link,
			type: EdgeType.Bidirectional,
		}))
		.filter((edge) => edge.data.type !== "EXPORTS")

	const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
		initialNodes,
		initialEdges,
	)

	const [nodes, setNodes, onNodesChange] = useNodesState(
		layoutedNodes as Node[],
	)
	const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

	// const onConnect = useCallback((connection: Connection) => {
	//     setEdges((eds) => addEdge(connection, eds));
	// }, []);

	return (
		<div suppressHydrationWarning className="h-[80vh] w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				edgeTypes={edgeTypes}
				// onConnect={onConnect}
				className="react-flow-subflows-example"
				nodeTypes={nodeTypes}
				fitView
				style={{ backgroundColor: "#F7F9FB" }}
			>
				<MiniMap />
				<Controls />
				<Background color="#E6E6E6" />
			</ReactFlow>
		</div>
	)
}
