import Navbar from "@/components/pages/(protected)/common/navbar"
import AuthLock from "@/components/wrappers/auth-lock"

type ProtectedLayoutProps = {
	children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
	return (
		<AuthLock>
			<Navbar />
			<div className="container mx-auto px-6 py-8 md:py-12">
				{children}
			</div>
		</AuthLock>
	)
}
