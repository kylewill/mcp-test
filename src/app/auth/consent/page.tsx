"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConsentForm() {
	const params = useSearchParams();
	const clientName = params.get("client_name") || "MCP Client";
	const scope = params.get("scope") || "default";

	const handleApprove = () => {
		const form = document.createElement("form");
		form.method = "POST";
		form.action = `/api/auth/oauth2/authorize?${params.toString()}`;

		const input = document.createElement("input");
		input.name = "consent";
		input.value = "true";
		form.appendChild(input);

		document.body.appendChild(form);
		form.submit();
	};

	return (
		<div style={{ padding: 40, fontFamily: "monospace" }}>
			<h1>Authorize</h1>
			<p>
				<strong>{clientName}</strong> wants access to your account.
			</p>
			<p>Scope: {scope}</p>
			<button onClick={handleApprove}>Approve</button>
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
