const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").trim();

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
};

export async function OPTIONS() {
	return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
	return Response.json(
		{
			resource: `${appUrl}/mcp`,
			authorization_servers: [appUrl],
			bearer_methods_supported: ["header"],
		},
		{ headers: corsHeaders },
	);
}
