import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "./layout";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}) {
	return (
		<SessionProvider session={session}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ThemeProvider>
		</SessionProvider>
	);
}
