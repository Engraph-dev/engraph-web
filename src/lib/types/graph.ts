import { workflowData } from "@/lib/data/sample-workflow"
import { type Node } from "@xyflow/react"

export enum NodeType {
	Module = "module",
	Symbol = "symbol",
	ModuleGroup = "moduleGroup",
}

export type ModuleData = (typeof workflowData.workflowData.moduleNodes)[0][0]

export type SymbolData = (typeof workflowData.workflowData.symbolNodes)[0][0]

export type ModuleNode = Node & { data: ModuleData; type: NodeType.Module }

export type SymbolNode = Node & { data: SymbolData; type: NodeType.Symbol }

export type GraphNodes = (ModuleNode | SymbolNode)[]

export enum EdgeType {
	Bidirectional = "bidirectional",
}
