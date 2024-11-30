import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const BreedDetailsPage = () => {
	const router = useRouter();
	const { id } = router.query; // Get the Breed ID from the URL
	const [breed, setBreed] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;

		const fetchBreedDetails = async () => {
			try {
				const response = await fetch(`/api/dogBreed?id=${id}`);
				const data = await response.json();

				if (response.ok) {
					setBreed(data.dogs);
				} else {
					console.error("Error fetching Breed details:", data.error);
				}
			} catch (error) {
				console.error("Error fetching Breed details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchBreedDetails();
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-medium">Loading...</p>
			</div>
		);
	}

	if (!breed) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg font-medium text-red-500">Breed not found</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-8 bg-background text-foreground">
			<h2 className="text-3xl font-bold text-center mb-8">Dogs of Breed {breed.name}</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
				{breed.dogs && breed.dogs.length > 0 ? (
					breed.dogs.map((dog) => (
						<div
							key={dog.id}
							className="relative card bg-card border border-border shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
						>
							{/* Image */}
							<Image
								src={dog.imageUrl[0] || "/placeholder-image.jpg"}
								alt={dog.name}
								width={500}
								height={500}
								className="w-full h-48 object-cover rounded-t-lg"
							/>
							{/* Dog Details */}
							<div className="p-4 flex flex-col gap-2">
								<h3 className="text-lg font-semibold text-card-foreground">
									{dog.name}
								</h3>
								<p className="text-sm text-muted-foreground">
									<span className="font-medium">Age:</span> {dog.age} years
								</p>
								<p className="text-sm text-muted-foreground">
									<span className="font-medium">Status:</span> {dog.status}
								</p>
								<p className="text-sm text-muted-foreground line-clamp-2">
									<span className="font-medium">Description:</span>{" "}
									{dog.description || "No description available."}
								</p>
								<Link
									href={`/dogs/${dog.id}`}
									className="text-sm font-medium rounded-lg text-primary hover:underline mt-2 self-start border px-4 py-2"
								>
									View More →
								</Link>
							</div>
						</div>
					))
				) : (
					<div className="col-span-full flex flex-col items-center justify-center py-16">
						<p className="text-lg font-medium text-muted-foreground">
							🐾 No Dogs Of This Breed Found
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default BreedDetailsPage;
