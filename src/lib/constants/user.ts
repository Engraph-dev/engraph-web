import { UserRole } from "@prisma/client"

export const titleToRole: Record<UserRole, string> = {
	Admin: "Admin",
	Developer: "Developer",
	Owner: "Owner",
	Viewer: "Viewer",
}

export const PUBLIC_PATHS = ["/", "/user/login", "/org/create"]
