const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

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
			issuer: appUrl,
			authorization_endpoint: `${appUrl}/api/auth/oauth2/authorize`,
			token_endpoint: `${appUrl}/api/auth/oauth2/token`,
			registration_endpoint: `${appUrl}/api/auth/oauth2/register`,
			jwks_uri: `${appUrl}/api/auth/jwks`,
			response_types_supported: ["code"],
			grant_types_supported: ["authorization_code", "refresh_token"],
			code_challenge_methods_supported: ["S256"],
			token_endpoint_auth_methods_supported: [
				"client_secret_basic",
				"client_secret_post",
				"none",
			],
		},
		{ headers: corsHeaders },
	);
}
