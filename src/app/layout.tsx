import "@/app/globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/wrappers/theme-provider"
import { SessionProvider } from "@/lib/context/session"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"

const font = DM_Sans({
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Engraph",
	description: "Create documentation for your code.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html suppressHydrationWarning lang="en">
			<body className={`${font.className} dark min-h-svh antialiased`}>
				<SessionProvider>
					{/* <ThemeProvider
						attribute="class"
						defaultTheme="dark"
						// enableSystem
						disableTransitionOnChange
					> */}
					<main>{children}</main>
					<Toaster />
					{/* </ThemeProvider> */}
				</SessionProvider>
			</body>
		</html>
	)
}
