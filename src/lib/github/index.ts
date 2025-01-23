import { App } from "octokit"

const octokitInstance = new App({
	appId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
	privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
	log: {
		info: console.info,
		debug: console.debug,
		error: console.error,
		warn: console.warn,
	},
})

export async function getInstallationRepositories(installationId: string) {
	const authenticatedInstance = await octokitInstance.getInstallationOctokit(
		Number.parseInt(installationId),
	)

	const allowedRepos = await authenticatedInstance.paginate(
		"GET /installation/repositories",
	)

	return allowedRepos
}
