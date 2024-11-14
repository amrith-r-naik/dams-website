import React from "react";
import localFont from "next/font/local";

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
		<main className={`${geistMono.variable} ${geistSans.variable}`}>
			{children}
		</main>
	);
};

export default Layout;
