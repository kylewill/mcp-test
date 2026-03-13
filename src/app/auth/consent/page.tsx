"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ConsentForm() {
	const params = useSearchParams();
	const clientName = params.get("client_name") || "MCP Client";
	const [status, setStatus] = useState<string | null>(null);

	async function handleConsent(accept: boolean) {
		setStatus(accept ? "Approving..." : "Denying...");

		try {
			const res = await fetch("/api/mcp/consent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					accept,
					oauth_query: params.toString(),
				}),
				credentials: "include",
			});

			const json = await res.json();
			if (json.redirectUrl) {
				window.location.href = json.redirectUrl;
				return;
			}

			setStatus(`Unexpected response: ${JSON.stringify(json)}`);
		} catch (e) {
			setStatus(`Error: ${e}`);
		}
	}

	return (
		<div style={{ padding: 40, fontFamily: "monospace" }}>
			<h1>Authorize</h1>
			<p>
				<strong>{clientName}</strong> wants access to your account.
			</p>
			<button onClick={() => handleConsent(true)}>Approve</button>
			<button onClick={() => handleConsent(false)} style={{ marginLeft: 8 }}>
				Deny
			</button>
			{status && <p>{status}</p>}
		</div>
	);
}

export default function ConsentPage() {
	return (
		<Suspense>
			<ConsentForm />
		</Suspense>
	);
}
