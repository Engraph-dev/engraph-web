import { GetWorkflowResponse } from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows/[workflowId]"

export interface WorkflowIdComponentProps {
	workflowData: GetWorkflowResponse["workflowData"]
}

export enum Role {
	AI = "ai",
	USER = "user",
}
export interface Message {
	role: Role
	content: string
}
