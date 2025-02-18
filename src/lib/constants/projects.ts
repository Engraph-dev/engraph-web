import { ProjectType } from "@prisma/client"

export const sourceToExtension: Record<ProjectType, string> = {
	[ProjectType.typescript]: "ts",
}
