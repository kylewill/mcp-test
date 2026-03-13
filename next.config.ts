import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: "/api/auth/:path*",
				headers: [
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{ key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
					},
				],
			},
		];
	},
};

export default nextConfig;
