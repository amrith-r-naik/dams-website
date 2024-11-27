import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Layout from "./layout";
import Loader from "@/components/ui/loader";

const ShelterDashboardPage = () => {
	const router = useRouter();
	useEffect(() => {
		router.push("/shelterDashboard/manage-dogs");
	}, [router]);
	return (
		<div className="flex w-full items-center justify-center min-h-screen bg-background">
			<Loader className="w-8 h-8 text-primary animate-spin" />
		</div>
	);
};

export default ShelterDashboardPage;

ShelterDashboardPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
