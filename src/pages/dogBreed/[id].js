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

	if (loading) return <p>Loading...</p>;
	if (!breed) return <p>Breed not found</p>;

	return (
		<div className="container mx-auto p-8">
			<h2 className="text-2xl font-semibold mt-6">Dogs in Breed</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
				{breed.dogs && breed.dogs.length > 0 ? (
					breed.dogs.map((dog) => (
						<div
							key={dog.id}
							className="card bg-gray-100 border border-gray-300 shadow-md p-4 rounded-lg"
						>
							<h3 className="text-lg font-semibold">{dog.name}</h3>
							<Image
								src={dog.imageUrl[0] || "/placeholder-image.jpg"}
								alt={dog.name}
								width={500}
								height={500}
								className="w-full h-48 object-cover rounded-lg mb-4"
							/>
							<p>Age: {dog.age}</p>
							<p>Status: {dog.status}</p>
							<p>Description: {dog.description}</p>
							<Link
								href={`/dogs/${dog.id}`}
								className="text-primary hover:underline mt-2 block text-center"
							>
								View More
							</Link>
						</div>
					))
				) : (
					<p className="col-span-full text-center">
						No dogs found in this Breed.
					</p>
				)}
			</div>
		</div>
	);
};

export default BreedDetailsPage;
