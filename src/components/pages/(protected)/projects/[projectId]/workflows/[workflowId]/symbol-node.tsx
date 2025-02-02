import { SymbolData } from "@/lib/types/graph"
import { Handle, Position } from "@xyflow/react"
import React, { memo } from "react"

const SymbolNode = memo(
	({ data, isConnectable }: { data: SymbolData; isConnectable: boolean }) => {
		return (
			<div className="rounded-md bg-blue-300/50 p-2 text-black">
				<p className="text-xs">{data.properties.symbolIdentifier}</p>
				<Handle
					type="target"
					id="a"
					position={Position.Top}
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

SymbolNode.displayName = "ModuleNode"

export default SymbolNode
