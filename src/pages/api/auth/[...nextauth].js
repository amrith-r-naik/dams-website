import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async session({ session, token, user }) {
			session.user.id = token.sub; // Pass user ID to session
			return session;
		},
	},
};

export default NextAuth(authOptions);
