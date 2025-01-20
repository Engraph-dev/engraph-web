"use client"

import ProjectsSection from "@/components/pages/(protected)/home/projects"
import TeamsSection from "@/components/pages/(protected)/home/teams"
import UsersSection from "@/components/pages/(protected)/home/users"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function HomePage() {
	const [activeTab, setActiveTab] = useState("projects")
	return (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab}
			className="space-y-4"
		>
			<TabsList>
				<TabsTrigger value="projects">Projects</TabsTrigger>
				<TabsTrigger value="teams">Teams</TabsTrigger>
				<TabsTrigger value="users">Users</TabsTrigger>
			</TabsList>
			<TabsContent value="projects">
				<ProjectsSection />
			</TabsContent>
			<TabsContent value="teams">
				<TeamsSection />
			</TabsContent>
			<TabsContent value="users">
				<UsersSection />
			</TabsContent>
		</Tabs>
	)
}
