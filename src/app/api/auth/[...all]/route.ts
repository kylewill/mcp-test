import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const { POST: _POST, GET: _GET } = toNextJsHandler(auth);

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
};

function addCors(response: Response): Response {
	const merged = new Response(response.body, response);
	for (const [k, v] of Object.entries(corsHeaders)) {
		merged.headers.set(k, v);
	}
	return merged;
}

export async function OPTIONS() {
	return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: Request) {
	const res = await _GET(req);
	return addCors(res);
}

export async function POST(req: Request) {
	const res = await _POST(req);
	return addCors(res);
}
