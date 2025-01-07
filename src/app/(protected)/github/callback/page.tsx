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

	const targetUrl = new URL("https://github.com/login/oauth/access_token")
	targetUrl.searchParams.set(
		"client_id",
		process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
	)
	targetUrl.searchParams.set(
		"client_secret",
		process.env.GITHUB_CLIENT_SECRET!,
	)
	targetUrl.searchParams.set("code", code)
	targetUrl.searchParams.set(
		"redirect_uri",
		process.env.NEXT_PUBLIC_ORIGIN + "/github/callback",
	)

	console.log(targetUrl.toString())

	const fetchResp = await fetch(targetUrl.toString(), {
		method: "POST",
		headers: {
			Accept: "application/json",
		},
	})

	if (fetchResp.ok) {
		const respJson = await fetchResp.json()
		return <>{JSON.stringify(respJson)}</>
	}

	return <>{JSON.stringify(callbackParams)}</>
}
