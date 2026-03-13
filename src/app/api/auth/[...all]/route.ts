import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export async function GET(req: Request) {
	return handlers.GET(req);
}

export async function POST(req: Request) {
	return handlers.POST(req);
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
