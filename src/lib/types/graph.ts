import { GetWorkflowResponse } from "@/lib/defs/engraph-backend/orgs/me/projects/[projectId]/workflows/[workflowId]"

export interface WorkflowIdComponentProps {
	workflowData: GetWorkflowResponse["workflowData"]
}
