import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";

const SheltersPage = () => {
	const [shelters, setShelters] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchShelters = async () => {
			try {
				const response = await fetch("/api/shelter");
				const data = await response.json();
				setShelters(data.shelters);
			} catch (error) {
				console.error("Error fetching shelters:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchShelters();
	}, []);

	if (loading) return <p>Loading...</p>;
	return (
		<div className="w-full h-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-8">
			{shelters.length === 0 && (
				<p className="col-span-full text-center">NO shelterS FOUND</p>
			)}
			{shelters.map((shelter) => (
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
						href={`/shelters/${shelter.id}`}
						className="text-primary hover:underline mt-2 block text-center"
					>
						View More
					</Link>
				</div>
			))}
		</div>
	);
};

export default SheltersPage;
