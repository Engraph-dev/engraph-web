import {
	BaseEdge,
	type EdgeProps,
	MarkerType,
	type ReactFlowState,
	getBezierPath,
	useStore,
} from "@xyflow/react"
import React from "react"

export type GetSpecialPathParams = {
	sourceX: number
	sourceY: number
	targetX: number
	targetY: number
}

export const getSpecialPath = (
	{ sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
	offset: number,
) => {
	const centerX = (sourceX + targetX) / 2
	const centerY = (sourceY + targetY) / 2

	return `M ${sourceX} ${sourceY} Q ${centerX} ${
		centerY + offset
	} ${targetX} ${targetY}`
}

export default function CustomEdge({
	source,
	target,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	markerEnd = MarkerType.ArrowClosed,
}: EdgeProps) {
	const isBiDirectionEdge = false

	const edgePathParams = {
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	}

	let path = ""

	if (isBiDirectionEdge) {
		path = getSpecialPath(edgePathParams, sourceX < targetX ? 25 : -25)
	} else {
		;[path] = getBezierPath(edgePathParams)
	}

	return <BaseEdge path={path} markerEnd={markerEnd} />
}
