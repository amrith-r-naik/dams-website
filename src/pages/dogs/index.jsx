import React from "react";
import { MainNav } from "@/components/main-nav";

const DogsPage = () => {
	return (
		<main className={`w-full h-screen`}>
			<MainNav className="w-full px-8 py-3 border-b border-b-border absolute top-0" />
			<div className="pt-20">dogs list</div>
		</main>
	);
};

export default DogsPage;
