import { UserRole } from "@prisma/client"

export const titleToRole: Record<UserRole, string> = {
	Admin: "Admin",
	Developer: "Developer",
	Owner: "Owner",
	Viewer: "Viewer",
}
