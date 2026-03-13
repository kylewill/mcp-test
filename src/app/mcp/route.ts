import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { z } from "zod";

const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

let cachedJWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
	if (!cachedJWKS) {
		cachedJWKS = createRemoteJWKSet(new URL(`${appUrl}/api/auth/jwks`));
	}
	return cachedJWKS;
}

const CORS_HEADERS: Record<string, string> = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
	"Access-Control-Expose-Headers": "Mcp-Session-Id, WWW-Authenticate",
};

async function verifyBearer(
	request: Request,
): Promise<{ userId: string } | null> {
	const authHeader = request.headers.get("authorization");
	if (!authHeader?.startsWith("Bearer ")) return null;

	try {
		const { payload } = await jwtVerify(authHeader.slice(7), getJWKS());
		if (!payload.sub) return null;
		return { userId: payload.sub };
	} catch (e) {
		console.log("[mcp-auth] Token verification failed:", e);
		return null;
	}
}

async function handle(request: Request): Promise<Response> {
	if (request.method === "OPTIONS") {
		return new Response(null, { status: 204, headers: CORS_HEADERS });
	}

	const user = await verifyBearer(request);
	if (!user) {
		return new Response(
			JSON.stringify({
				error: "unauthorized",
				error_description: "Valid bearer token required",
			}),
			{
				status: 401,
				headers: {
					...CORS_HEADERS,
					"WWW-Authenticate": `Bearer realm="mcp", resource_metadata="${appUrl}/.well-known/oauth-protected-resource/mcp"`,
					"Content-Type": "application/json",
				},
			},
		);
	}

	console.log(`[mcp] Authenticated user: ${user.userId}`);

	const server = new McpServer({ name: "mcp-test", version: "1.0.0" });

	server.tool("echo", { message: z.string() }, async ({ message }) => ({
		content: [{ type: "text", text: `Echo: ${message}` }],
	}));

	server.tool("whoami", {}, async () => ({
		content: [{ type: "text", text: `User ID: ${user.userId}` }],
	}));

	const transport = new WebStandardStreamableHTTPServerTransport();
	await server.connect(transport);
	const response = await transport.handleRequest(request);

	const merged = new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	});
	for (const [k, v] of Object.entries(CORS_HEADERS)) {
		merged.headers.set(k, v);
	}
	return merged;
}

export { handle as GET, handle as POST, handle as DELETE, handle as OPTIONS };
