import { ModuleData } from "@/lib/types/graph"
import { useReactFlow } from "@xyflow/react"
import React, { memo } from "react"

const ModuleGroupNode = memo(
	({ data }: { data: ModuleData; isConnectable: boolean }) => {
		const { getNodes } = useReactFlow()
		const nodes = getNodes()
		const myNodes = nodes.filter((node) => node.parentId === data.elementId)
		const padding = `${Math.max(myNodes.length * 25, 100)}px`
		return (
			<div
				className="rounded-md bg-purple-300/50 text-black"
				style={{ padding }}
			></div>
		)
	},
)

ModuleGroupNode.displayName = "ModuleNode"

export default ModuleGroupNode
