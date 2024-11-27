import React, { useState, useEffect } from "react";
import Layout from "../layout";
import Image from "next/image";
import Link from "next/link";

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

	// Handle status update
	const updateDogStatus = async (id, status) => {
		try {
			const response = await fetch(`/api/dogs/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status }),
			});

			if (!response.ok) {
				throw new Error("Failed to update status");
			}

			const updatedDog = await response.json();
			setDogs((prevDogs) =>
				prevDogs.map((dog) =>
					dog.id === id ? { ...dog, status: updatedDog.status } : dog
				)
			);
		} catch (error) {
			console.error("Error updating dog status:", error);
		}
	};

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

	if (loading) return <p>Loading...</p>;

	return (
		<div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-8">
			{dogs.length === 0 && (
				<p className="col-span-full text-center">NO DOGS FOUND</p>
			)}
			{dogs.map((dog) => (
				<div
					key={dog.id}
					className="card bg-card border border-border shadow-lg p-4 rounded-lg flex flex-col items-center"
				>
					<h2 className="text-xl font-semibold text-card-foreground text-center">
						{dog.name}
					</h2>
					<p className="text-card-foreground/50 text-center">
						Breed: {dog.breed.name}
					</p>
					<p className="text-card-foreground/50 text-center">
						Age: {dog.age} years
					</p>
					<p className="text-card-foreground/50 text-center">
						Description: {dog.description}
					</p>

					{/* Status Dropdown */}
					<div className="mt-2 w-full">
						<select
							value={dog.status}
							onChange={(e) => updateDogStatus(dog.id, e.target.value)}
							className="w-full p-2 bg-white border rounded"
						>
							<option value="AVAILABLE">AVAILABLE</option>
							<option value="UNAVAILABLE">UNAVAILABLE</option>
							<option value="ADOPTED">ADOPTED</option>
							<option value="DECEASED">DECEASED</option>
						</select>
					</div>

					{/* Delete Dog Button */}
					<button
						onClick={() => deleteDog(dog.id)}
						className="mt-4 text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded"
					>
						Delete Dog
					</button>

					{/* Edit Dog Link */}
					<Link
						href={`/shelterDashboard/manage-dogs/${dog.id}`}
						className="text-primary hover:underline mt-2 block text-center"
					>
						Edit Dog
					</Link>
				</div>
			))}
		</div>
	);
};

export default ManageDogsPage;

ManageDogsPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
