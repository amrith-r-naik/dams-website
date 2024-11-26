import { useEffect, useState } from "react";
import Link from "next/link";

const ShelterPage = () => {
	const [shelter, setShelter] = useState(null); // Shelter is a single object, not an array
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchShelter = async () => {
			try {
				const response = await fetch("/api/shelter");
				const data = await response.json();

				if (response.ok) {
					setShelter(data.shelter); // Access the `shelter` key in the API response
				} else {
					console.error("Error fetching shelter:", data.error);
				}
			} catch (error) {
				console.error("Error fetching shelter:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchShelter();
	}, []);

	if (loading) return <p>Loading...</p>;

	if (!shelter) return <p>No shelter data available</p>;

	return (
		<div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-8">
			<div
				key={shelter.id}
				className="card bg-card border border-border shadow-lg p-4 rounded-lg flex flex-col items-center"
			>
				<h2 className="text-xl font-semibold text-card-foreground text-center">
					{shelter.name}
				</h2>
				<p className="text-card-foreground/50 text-center">
					Address: {shelter.address}
				</p>
				<p className="text-card-foreground/50 text-center">
					Phone Number: {shelter.phoneNumber}
				</p>
				<Link
					href={`/shelter-details/${shelter.id}`}
					className="text-primary hover:underline mt-2 block text-center"
				>
					Edit
				</Link>
			</div>
		</div>
	);
};

export default ShelterPage;
