import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert } from "@/components/ui/alert";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Adoptions() {
	const [adoptions, setAdoptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { theme } = useTheme();
	// Fetch adoptions
	useEffect(() => {
		const fetchAdoptions = async () => {
			try {
				const response = await fetch("/api/adoption?user=true", {
					method: "GET",
				});
				if (!response.ok) {
					throw new Error("Failed to fetch adoptions");
				}
				const data = await response.json();
				setAdoptions(data);
			} catch (error) {
				console.error(error);
				setError("Unable to fetch adoptions. Please try again later.");
			}
		};

		fetchAdoptions();
	}, []);

	// Delete adoption
	const deleteAdoption = async (adoptionId) => {
		setLoading(true);
		try {
			const response = await fetch("/api/adoption", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ adoptionId }),
			});
			if (!response.ok) {
				throw new Error("Failed to delete adoption");
			}
			setAdoptions((prev) =>
				prev.filter((adoption) => adoption.id !== adoptionId)
			);
		} catch (error) {
			console.error(error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Manage Adoptions</h1>
			{/* 
			{error && (
				<Alert variant="destructive" className="mb-4">
					{error}
				</Alert>
			)} */}

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{adoptions.map((adoption) => (
					<Card key={adoption.id} className="shadow-md">
						<CardHeader>
							<CardTitle className="text-lg font-bold">
								{adoption.dog.name}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Image
								src={adoption.dog.imageUrl[0] || "/placeholder-image-dog.png"}
								alt={adoption.dog.name}
								width={500}
								height={500}
								className={`w-full h-48 rounded-lg mb-4 ${
									adoption.dog.imageUrl.length === 0 &&
									(theme === "dark" || theme === "system") &&
									"invert"
								} ${
									adoption.dog.imageUrl.length === 0
										? "object-contain"
										: "object-cover"
								}`}
							/>
							<p className="text-sm text-gray-500 mb-2">
								<strong>Breed:</strong> {adoption.dog.breed.name}
							</p>
							<p className="text-sm text-gray-500 mb-2">
								<strong>Description:</strong> {adoption.dog.description}
							</p>
							<p className="text-sm text-gray-500 mb-2">
								<strong>Applicant:</strong> {adoption.user.name}
							</p>
							<p className="text-sm text-gray-500 mb-4">
								<strong>Status:</strong> {adoption.status}
							</p>
							<Button
								variant="destructive"
								className="w-full"
								disabled={loading}
								onClick={() => deleteAdoption(adoption.id)}
							>
								{loading ? "Deleting..." : "Delete"}
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
