import React, { useState, useEffect } from "react";
import Layout from "../layout";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ManageDogsPage = () => {
	const [dogs, setDogs] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch dogs
	useEffect(() => {
		const fetchDogs = async () => {
			try {
				const response = await fetch("/api/dogs");
				const data = await response.json();
				setDogs(data);
			} catch (error) {
				console.error("Error fetching dogs:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDogs();
	}, []);

	// Handle dog deletion
	const deleteDog = async (id) => {
		if (confirm("Are you sure you want to delete this dog?")) {
			try {
				const response = await fetch(`/api/dogs/${id}`, {
					method: "DELETE",
				});

				if (!response.ok) {
					throw new Error("Failed to delete dog");
				}

				setDogs((prevDogs) => prevDogs.filter((dog) => dog.id !== id));
			} catch (error) {
				console.error("Error deleting dog:", error);
			}
		}
	};

	if (loading)
		return (
			<div className="flex w-full h-full items-center justify-center bg-background">
				<p className="text-lg font-semibold text-muted">Loading...</p>
			</div>
		);

	// Group dogs by status
	const statuses = ["AVAILABLE", "UNAVAILABLE", "ADOPTED", "DECEASED"];
	const groupedDogs = statuses.map((status) => {
		console.log("Status: ", status);
		return {
			status,
			dogs: dogs.filter((dog) => {
				console.log(`dog-${dog.imageUrl} status=`, dog.status);
				return dog.status === status;
			}),
		};
	});

	return (
		<div className="w-full p-6 bg-background">
			<h1 className="text-xl font-bold mb-6 text-foreground">Manage Dogs</h1>
			{groupedDogs.map((group) => (
				<div key={group.status} className="mb-8">
					{/* Status Heading */}
					<h2 className="text-lg font-semibold text-card-foreground mb-4">
						{group.status}
					</h2>
					{/* Dog Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{group.dogs.length === 0 ? (
							<p className="col-span-full text-center text-muted-foreground">
								No dogs in this category.
							</p>
						) : (
							group.dogs.map((dog) => (
								<div
									key={dog.id}
									className="flex flex-col bg-card border border-border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
								>
									{/* Image Section */}
									<div className="relative w-full h-40 mb-4">
										<Image
											src={dog.imageUrl[0] || "/placeholder-image.jpg"}
											alt={dog.name}
											layout="fill"
											objectFit="cover"
											className="rounded-lg"
										/>
									</div>

									{/* Dog Details */}
									<div className="mb-4">
										<h2 className="text-lg font-semibold text-card-foreground">
											{dog.name}
										</h2>
										<p className="text-sm text-muted-foreground">
											Breed: {dog.breed?.name}
										</p>
										<p className="text-sm text-muted-foreground">
											Age: {dog.age} years
										</p>
										<p className="text-sm text-muted-foreground truncate">
											{dog.description}
										</p>
									</div>

									{/* Delete Button */}
									<Button
										variant="destructive"
										onClick={() => deleteDog(dog.id)}
										className="w-full"
									>
										<Trash2 size={16} /> Delete Dog
									</Button>
								</div>
							))
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default ManageDogsPage;

ManageDogsPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
