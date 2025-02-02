import { GetWorkflowResponse } from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows/[workflowId]"
import React, { memo } from "react"
import ForceGraph2D from "react-force-graph-2d"

export const ReactForceGraph = memo(
	({
		workflowData,
	}: {
		workflowData: GetWorkflowResponse["workflowData"]
	}) => {
		const moduleNodes = workflowData.moduleNodes.flat().map((node) => ({
			id: node.elementId,
			group: node.elementId,
			data: node,
			name: node.properties.modulePath,
		}))

		const symbolNodes = workflowData.symbolNodes.flat().map((node) => ({
			id: node.elementId,
			group: workflowData.moduleNodes
				.flat()
				.find(
					(moduleNode) =>
						moduleNode.properties.modulePath ===
						node.properties.symbolPath,
				)?.elementId,
			data: node,
			name: node.properties.symbolIdentifier,
		}))

		const initialNodes = [...moduleNodes, ...symbolNodes]

		const initialEdges = workflowData.nodeLinks
			.flat()
			.map((link) => ({
				target: link.startNodeElementId,
				source: link.endNodeElementId,
				data: link,
			}))
			.filter(
				(edge) =>
					initialNodes.find((node) => node.id === edge.source) &&
					initialNodes.find((node) => node.id === edge.target),
			)

		return (
			<div className="~bg-black overflow-x-hidden rounded-lg border">
				<ForceGraph2D
					graphData={{
						nodes: initialNodes,
						links: initialEdges,
					}}
					nodeRelSize={8}
					nodeAutoColorBy="group"
					nodeVal={(node) => node.val}
					nodeCanvasObject={(
						node,
						ctx: CanvasRenderingContext2D,
						_globalScale: number,
					) => {
						const label = node.name
						const textWidth = label.length
						const fontSize = 10
						const bckgDimensions = [textWidth, fontSize].map(
							(n) => n + fontSize * 0.2,
						)
						ctx.font = `${fontSize}px Sans-Serif`
						ctx.textAlign = "center"
						ctx.textBaseline = "middle"
						ctx.fillStyle = node.color
						ctx.beginPath()
						if (node.x && node.y) {
							ctx.arc(
								node.x,
								node.y,
								textWidth,
								0,
								2 * Math.PI,
								false,
							)
							ctx.fill()
							ctx.stroke()
							ctx.fillStyle = "rgba(255, 255, 255, 1)"
							ctx.fillText(
								label ? label : "",
								node.x,
								node.y,
								textWidth,
							)
						}
						node.__bckgDimensions = bckgDimensions
					}}
					linkWidth={(link) => link.width}
					linkDirectionalArrowLength={5}
					linkCurvature={0.25}
				/>
			</div>
		)
	},
)

ReactForceGraph.displayName = "ReactForceGraph"

export default ReactForceGraph
