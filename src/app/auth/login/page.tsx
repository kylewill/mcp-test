"use client";

import { useState } from "react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("");

	const params =
		typeof window !== "undefined"
			? new URLSearchParams(window.location.search)
			: new URLSearchParams();

	const handleLogin = async () => {
		const res = await fetch("/api/auth/sign-in/email", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (res.ok) {
			const callbackUrl = params.get("callbackUrl");
			if (callbackUrl) {
				window.location.href = callbackUrl;
			} else {
				window.location.href = "/";
			}
		} else {
			setStatus("Login failed");
		}
	};

	const handleSignup = async () => {
		const res = await fetch("/api/auth/sign-up/email", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password, name: email.split("@")[0] }),
		});

		if (res.ok) {
			setStatus("Signed up! Now log in.");
		} else {
			setStatus("Signup failed");
		}
	};

	return (
		<div style={{ padding: 40, fontFamily: "monospace" }}>
			<h1>MCP Test — Login</h1>
			<input
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				style={{ display: "block", marginBottom: 8 }}
			/>
			<input
				placeholder="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				style={{ display: "block", marginBottom: 8 }}
			/>
			<button onClick={handleLogin}>Log In</button>
			<button onClick={handleSignup} style={{ marginLeft: 8 }}>
				Sign Up
			</button>
			{status && <p>{status}</p>}
			{params.toString() && (
				<pre style={{ fontSize: 10, marginTop: 20, opacity: 0.5 }}>
					OAuth params: {params.toString()}
				</pre>
			)}
		</div>
	);
}
