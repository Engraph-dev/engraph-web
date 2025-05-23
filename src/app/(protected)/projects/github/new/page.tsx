import NewGithubProjectPage from "@/components/pages/(protected)/projects/github/new"
import { getInstallationRepositories } from "@/lib/github"
import { Repositories } from "@/lib/types/github"
import { redirect } from "next/navigation"

type GithubCallbackSearchParams = {
	code: string
	installation_id: string
	setup_action: "install" | "update"
}

type GithubCallbackPageProps = {
	searchParams: Promise<Partial<GithubCallbackSearchParams>>
}

export default async function GithubCallback(props: GithubCallbackPageProps) {
	const callbackParams = await props.searchParams

	const { code, installation_id, setup_action } = callbackParams
	if (!code || !installation_id || !setup_action) {
		redirect("/")
	}

	const installationRepositories = (await getInstallationRepositories(
		installation_id,
	)) as Repositories

	return <NewGithubProjectPage repositories={installationRepositories} />
}
