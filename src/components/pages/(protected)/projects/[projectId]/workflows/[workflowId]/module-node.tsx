import { ModuleData } from "@/lib/types/graph"
import { Handle, Position } from "@xyflow/react"
import React, { memo } from "react"

const ModuleNode = memo(
	({ data, isConnectable }: { data: ModuleData; isConnectable: boolean }) => {
		return (
			<div className="rounded-md bg-green-300/50 p-2 text-black">
				<p className="text-xs">{data.properties.modulePath}</p>
				<Handle
					type="target"
					position={Position.Top}
					id="a"
					isConnectable={isConnectable}
				/>
				<Handle
					type="source"
					position={Position.Bottom}
					id="b"
					isConnectable={isConnectable}
				/>
			</div>
		)
	},
)

ModuleNode.displayName = "ModuleNode"

export default ModuleNode
