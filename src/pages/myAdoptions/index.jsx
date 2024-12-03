import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useTheme } from "next-themes";
export default function Adoptions() {
	const [adoptions, setAdoptions] = useState([]);
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

	// Group adoptions by status
	const groupedAdoptions = adoptions.reduce((groups, adoption) => {
		const { status } = adoption;
		if (!groups[status]) {
			groups[status] = [];
		}
		groups[status].push(adoption);
		return groups;
	}, {});

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Adoptions by Status</h1>

			{error && <p className="text-red-500 mb-4">{error}</p>}

			{Object.keys(groupedAdoptions).map((status) => (
				<div key={status} className="mb-8">
					<h2 className="text-xl font-semibold mb-4">{status}</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{groupedAdoptions[status].map((adoption) => (
							<Card key={adoption.id} className="shadow-md">
								<CardHeader>
									<CardTitle className="text-lg font-bold">
										{adoption.dog.name}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<Image
										src={
											adoption.dog.imageUrl[0] || "/placeholder-image-dog.png"
										}
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
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
