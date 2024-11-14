import localFont from "next/font/local";
import { MainNav } from "@/components/main-nav";
import HeroSection from "@/components/hero-section";

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

export default function Home() {
	return (
		<main
			className={`${geistMono.variable} ${geistSans.variable} w-full h-screen`}
		>
			<MainNav className="w-full px-8 py-3 border-b border-b-border absolute top-0" />
			<HeroSection />
		</main>
	);
}
