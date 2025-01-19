import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/wrappers/theme-provider"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"

const font = DM_Sans({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Engraph",
	description: "Create documentation for your code.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html suppressHydrationWarning lang="en">
			<body className={`${font.className} min-h-svh antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main>{children}</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
