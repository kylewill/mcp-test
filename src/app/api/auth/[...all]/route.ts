import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export async function GET(req: Request) {
	console.log(`[auth] GET ${req.url}`);
	const res = await handlers.GET(req);
	console.log(`[auth] GET response: ${res.status}`);
	return res;
}

export async function POST(req: Request) {
	const url = new URL(req.url);
	console.log(`[auth] POST ${url.pathname}`);

	// Log body for register/token endpoints
	if (url.pathname.includes("register") || url.pathname.includes("token")) {
		const body = await req.text();
		console.log(`[auth] POST body: ${body}`);
		console.log(`[auth] POST headers: ${JSON.stringify({
			"content-type": req.headers.get("content-type"),
			"authorization": req.headers.get("authorization")?.slice(0, 30),
			"origin": req.headers.get("origin"),
		})}`);

		// Reconstruct request with the body we consumed
		const newReq = new Request(req.url, {
			method: "POST",
			headers: req.headers,
			body,
		});
		const res = await handlers.POST(newReq);
		const resBody = await res.clone().text();
		console.log(`[auth] POST response: ${res.status} ${resBody.slice(0, 500)}`);
		return res;
	}

	const res = await handlers.POST(req);
	console.log(`[auth] POST response: ${res.status}`);
	return res;
}

export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers":
				"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
		},
	});
}
