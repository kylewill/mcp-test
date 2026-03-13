import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").trim();

export async function POST(request: Request) {
	const body = await request.json();
	const cookies = request.headers.get("cookie") ?? "";

	console.log("[mcp/consent] accept:", body.accept);

	const response = await auth.handler(
		new Request(`${appUrl}/api/auth/oauth2/consent`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookies,
				Origin: appUrl,
			},
			body: JSON.stringify({
				accept: body.accept,
				oauth_query: body.oauth_query,
			}),
		}),
	);

	console.log("[mcp/consent] response status:", response.status);

	const locationHeader = response.headers.get("location");
	if (locationHeader) {
		return NextResponse.json({ redirectUrl: locationHeader });
	}

	const responseBody = await response.clone().json().catch(() => null);
	if (responseBody?.redirect && responseBody?.url) {
		return NextResponse.json({ redirectUrl: responseBody.url });
	}

	return NextResponse.json(responseBody ?? { error: "Unexpected response" }, {
		status: response.status,
	});
}
