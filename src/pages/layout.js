import React from "react";
import localFont from "next/font/local";
import { MainNav } from "@/components/main-nav";
import Footer from "@/components/footer";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

const Layout = ({ children }) => {
	return (
		<>
			<MainNav className="w-full py-3 border-b border-b-border" />
			<main
				className={`${geistMono.variable} ${geistSans.variable} flex min-h-[89vh] w-full`}
			>
				{children}
			</main>
			<Footer/>
		</>
	);
};

export default Layout;
