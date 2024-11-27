import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../layout";
import Loader from "@/components/ui/loader";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ShelterPage = () => {
	const [shelter, setShelter] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchShelter = async () => {
			try {
				const response = await fetch("/api/shelter?current=true");
				const data = await response.json();

				if (response.ok) {
					setShelter(data.shelter);
				} else {
					console.error("Error fetching shelter:", data.error);
				}
			} catch (error) {
				console.error("Error fetching shelter:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchShelter();
	}, []);

	if (loading)
		return (
			<div className="flex w-full items-center justify-center min-h-screen bg-background">
				<Loader className="w-8 h-8 text-primary animate-spin" />
			</div>
		);

	if (!shelter)
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
				<p>No shelter data available</p>
			</div>
		);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<Card className="bg-card border border-border shadow-xl rounded-lg p-6 mx-auto max-w-lg transition-transform hover:scale-[1.02]">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-card-foreground">
							{shelter.name}
						</CardTitle>
						<CardDescription className="text-sm text-muted-foreground">
							Address: {shelter.address}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-card-foreground">
							<strong>Phone Number:</strong> {shelter.phoneNumber}
						</p>
						<p className="text-sm text-muted-foreground">
							Need help? Contact the shelter for more details.
						</p>
					</CardContent>
					<CardFooter className="mt-6">
						<Link href={`/shelterDashboard/shelter-details/${shelter.id}`}>
							<Button
								variant="primary"
								className="w-full py-3 text-sm font-medium"
							>
								Edit Shelter Details
							</Button>
						</Link>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default ShelterPage;

ShelterPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
