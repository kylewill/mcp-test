import { oauthProvider } from "@better-auth/oauth-provider";
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt } from "better-auth/plugins";

const prisma = new PrismaClient();

const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
	baseURL: appUrl,
	trustedOrigins: [
		appUrl,
		"https://claude.ai",
		"cursor://",
		"http://localhost:*",
	],
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	emailAndPassword: { enabled: true },
	plugins: [
		jwt({
			jwks: { keyPairConfig: { alg: "RS256" } },
		}),
		oauthProvider({
			loginPage: "/auth/login",
			consentPage: "/auth/consent",
			allowDynamicClientRegistration: true,
			allowUnauthenticatedClientRegistration: true,
			requirePKCE: true,
			validAudiences: [appUrl, `${appUrl}/mcp`],
		}),
	],
});
