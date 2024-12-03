import { useState, useEffect } from "react";
import Layout from "../layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectItem,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Adoptions() {
	const [adoptions, setAdoptions] = useState([]);
	const [loadingAdoptions, setLoadingAdoptions] = useState({}); // Track loading state for each adoption
	const [error, setError] = useState("");
	const { theme } = useTheme();

	// Fetch adoptions
	useEffect(() => {
		const fetchAdoptions = async () => {
			try {
				const response = await fetch("/api/adoption", {
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

	// Update adoption status
	const updateStatus = async (adoptionId, newStatus) => {
		setLoadingAdoptions((prev) => ({ ...prev, [adoptionId]: true })); // Set loading for specific adoption
		try {
			const response = await fetch("/api/adoption", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ adoptionId, status: newStatus }),
			});
			if (!response.ok) {
				throw new Error("Failed to update adoption status");
			}
			const updatedAdoption = await response.json();
			setAdoptions((prev) =>
				prev.map((adoption) =>
					adoption.id === updatedAdoption.id ? updatedAdoption : adoption
				)
			);
		} catch (error) {
			console.error(error);
			setError(error.message);
		} finally {
			setLoadingAdoptions((prev) => ({ ...prev, [adoptionId]: false })); // Reset loading for specific adoption
		}
	};

	// Delete adoption
	const deleteAdoption = async (adoptionId) => {
		setLoadingAdoptions((prev) => ({ ...prev, [adoptionId]: true })); // Set loading for specific adoption
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
			setLoadingAdoptions((prev) => ({ ...prev, [adoptionId]: false })); // Reset loading for specific adoption
		}
	};

	// Group adoptions by status
	const statuses = ["PENDING", "APPROVED", "REJECTED"];
	const groupedAdoptions = statuses.map((status) => {
		return {
			status,
			adoptions: adoptions.filter((adoption) => adoption.status === status),
		};
	});

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Adoptions by Status</h1>

			{error && <p className="text-red-500 mb-4">{error}</p>}

			{groupedAdoptions.map((group) => (
				<div key={group.status} className="mb-8">
					<h2 className="text-xl font-semibold mb-4">{group.status}</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{group.adoptions.length === 0 ? (
							<p className="col-span-full text-center text-muted-foreground">
								No adoptions in this category.
							</p>
						) : (
							group.adoptions.map((adoption) => (
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
										<div className="flex space-x-2 items-center mt-4">
											<Select
												value={adoption.status} // Bind the selected value to the status
												onValueChange={(newStatus) => {
													updateStatus(adoption.id, newStatus); // Immediately update adoption status
												}}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select Status" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="PENDING">Pending</SelectItem>
													<SelectItem value="APPROVED">Approved</SelectItem>
													<SelectItem value="REJECTED">Rejected</SelectItem>
												</SelectContent>
											</Select>

											<Button
												variant="destructive"
												onClick={() => deleteAdoption(adoption.id)}
												disabled={loadingAdoptions[adoption.id]} // Disable based on specific adoption loading state
											>
												{loadingAdoptions[adoption.id]
													? "Deleting..."
													: "Delete"}
											</Button>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</div>
			))}
		</div>
	);
}

Adoptions.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
