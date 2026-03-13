import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const { POST: _POST, GET: _GET } = toNextJsHandler(auth);

const corsHeaders: Record<string, string> = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
};

function addCors(response: Response): Response {
	for (const [k, v] of Object.entries(corsHeaders)) {
		response.headers.set(k, v);
	}
	return response;
}

export async function OPTIONS() {
	return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(...args: Parameters<typeof _GET>) {
	const res = await _GET(...args);
	return addCors(res);
}

export async function POST(...args: Parameters<typeof _POST>) {
	const res = await _POST(...args);
	return addCors(res);
}
