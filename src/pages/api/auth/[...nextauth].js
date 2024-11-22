import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions = {
	// debug: true,
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async session({ session, token, user }) {
			session.user.id = user.id;
			session.user.role = user.role;
			return session;
		},
		async jwt({ token, account, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
	},
};

export default NextAuth(authOptions);
