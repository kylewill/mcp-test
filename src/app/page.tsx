export default function Home() {
	return (
		<div style={{ padding: 40, fontFamily: "monospace" }}>
			<h1>MCP Test App</h1>
			<p>
				Connect Claude.ai to: <code>{process.env.BETTER_AUTH_URL}/mcp</code>
			</p>
			<p>
				<a href="/auth/login">Login / Sign Up</a>
			</p>
		</div>
	);
}
