import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

const ShelterDetailsPage = () => {
	const router = useRouter();
	const { id } = router.query; // Get the shelter ID from the URL
	const [shelter, setShelter] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;

		const fetchShelterDetails = async () => {
			try {
				const response = await fetch(`/api/shelter?id=${id}`);
				const data = await response.json();

				if (response.ok) {
					setShelter(data.shelter);
				} else {
					console.error("Error fetching shelter details:", data.error);
				}
			} catch (error) {
				console.error("Error fetching shelter details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchShelterDetails();
	}, [id]);

	if (loading) return <p>Loading...</p>;
	if (!shelter) return <p>Shelter not found</p>;

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold text-center">{shelter.name}</h1>
			<p className="text-center text-gray-600">{shelter.address}</p>
			<p className="text-center text-gray-600">Phone: {shelter.phoneNumber}</p>

			<h2 className="text-2xl font-semibold mt-6">Dogs in Shelter</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
				{shelter.dogs && shelter.dogs.length > 0 ? (
					shelter.dogs.map((dog) => (
						<div
							key={dog.id}
							className="card bg-gray-100 border border-gray-300 shadow-md p-4 rounded-lg"
						>
							<h3 className="text-lg font-semibold">{dog.name}</h3>
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
						No dogs found in this shelter.
					</p>
				)}
			</div>
		</div>
	);
};

export default ShelterDetailsPage;
