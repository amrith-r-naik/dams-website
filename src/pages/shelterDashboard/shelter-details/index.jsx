import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ShelterPage = () => {
	const [shelter, setShelter] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state

	const router = useRouter();

	useEffect(() => {
		const fetchShelter = async () => {
			try {
				const response = await fetch("/api/shelter?current=true");
				const data = await response.json();
				if (!response.ok)
					throw new Error(data.error || "Failed to fetch shelter");
				setShelter(data.shelter);
			} catch (err) {
				console.error("Error fetching shelter:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchShelter();
	}, []);

	const handleUpdate = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/shelter`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(shelter),
			});
			if (!res.ok) throw new Error("Failed to update shelter");
			alert("Shelter updated successfully!");
			setIsDialogOpen(false); // Close dialog after successful update
		} catch (error) {
			console.error("Error updating shelter:", error);
			alert("Error updating shelter");
		}
	};

	if (loading)
		return (
			<div className="flex w-full items-center justify-center min-h-screen bg-background">
				<Loader className="w-8 h-8 text-primary animate-spin" />
			</div>
		);

	if (error)
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground">
				<p className="text-destructive font-semibold">{`Error: ${error}`}</p>
			</div>
		);

	if (!shelter)
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground">
				<p className="text-secondary-foreground font-medium">
					No shelter data available
				</p>
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
						<CardDescription className="text-sm text-card-foreground">
							Address: {shelter.address}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-card-foreground">
							<strong>Phone Number:</strong> {shelter.phoneNumber}
						</p>
					</CardContent>
					<CardFooter className="mt-6">
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button className="w-full">Update Shelter Details</Button>
							</DialogTrigger>
							<DialogContent className="max-w-lg">
								<DialogHeader>
									<DialogTitle>Update Shelter</DialogTitle>
									<DialogDescription>
										Update the shelter details below and save changes.
									</DialogDescription>
								</DialogHeader>
								<form onSubmit={handleUpdate} className="space-y-4">
									<Input
										value={shelter.name || ""}
										onChange={(e) =>
											setShelter({ ...shelter, name: e.target.value })
										}
										placeholder="Shelter Name"
										className="w-full"
									/>
									<Input
										value={shelter.address || ""}
										onChange={(e) =>
											setShelter({ ...shelter, address: e.target.value })
										}
										placeholder="Shelter Address"
										className="w-full"
									/>
									<Textarea
										value={shelter.phoneNumber || ""}
										onChange={(e) =>
											setShelter({ ...shelter, phoneNumber: e.target.value })
										}
										placeholder="Phone Number"
										className="w-full resize-none"
									/>
									<Button type="submit" className="w-full">
										Save Changes
									</Button>
								</form>
							</DialogContent>
						</Dialog>
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
