import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
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

			<div className="grid gap-6 md:grid-cols-3">
				{["PENDING", "APPROVED", "REJECTED"].map((status) => (
					<div key={status} className="flex flex-col space-y-4">
						<h2
							className={`text-xl font-semibold text-center ${
								status === "PENDING"
									? "text-yellow-600"
									: status === "APPROVED"
									? "text-green-600"
									: "text-red-600"
							}`}
						>
							{status}
						</h2>
						{(groupedAdoptions[status] || []).map((adoption) => (
							<Card
								key={adoption.id}
								className="shadow-md border border-border rounded-lg transition-transform transform hover:scale-105"
							>
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
									<p className="text-sm mb-2">
										<strong>Breed:</strong> {adoption.dog.breed.name}
									</p>
									<p className="text-sm mb-2">
										<strong>Shelter:</strong> {adoption.dog.shelter.name}
									</p>
								</CardContent>
								{/* Contact Details for APPROVED status */}
								{status === "APPROVED" && (
									<CardFooter className="flex flex-col items-start gap-2 p-4 rounded-b-lg">
										<h3 className="text-base font-semibold">
											Contact Shelter Staff:
										</h3>
										<div className="flex items-center gap-2">
											
											<span className="text-sm font-medium">
												{adoption.dog.shelter.phoneNumber}
											</span>
										</div>
										<p className="text-sm">
											Please reach out to the shelter staff for further
											information.
										</p>
									</CardFooter>
								)}
							</Card>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
