import { MainNav } from "@/components/main-nav";
import HeroSection from "@/components/hero-section";

export default function Home() {
	return (
		<main className={`w-full h-screen`}>
			<MainNav className="w-full px-8 py-3 border-b border-b-border absolute top-0" />
			<HeroSection />
		</main>
	);
}
