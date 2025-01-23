import { AccessLevel, UserRole } from "@prisma/client"

export const PUBLIC_PATHS = ["/", "/user/login", "/org/create"]

export const ROLE_HIERARCHY: UserRole[] = [
	"Owner",
	"Admin",
	"Developer",
	"Viewer",
]

export const ACCESS_LEVEL_HIERARCHY: AccessLevel[] = ["Admin", "Write", "Read"]
