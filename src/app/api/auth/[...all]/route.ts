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
	console.log(`[auth] POST ${req.url}`);
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
