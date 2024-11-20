import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";

const DogsPage = () => {
	const [dogs, setDogs] = useState([]);
	const [loading, setLoading] = useState(true);

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

	if (loading) return <p>Loading...</p>;
	return (
		<main className={`w-full h-screen`}>
			<MainNav className="w-full px-8 py-3 border-b border-b-border absolute top-0" />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-20 h-full px-4">
				{dogs.length === 0 && <p>NO DOGS FOUND</p>}
				{dogs.map((dog) => (
					<div key={dog.id} className="card bg-white shadow-lg p-4 rounded-lg">
						<Image
							src={dog.imageUrl || "/placeholder-image.png"}
							alt={dog.name}
							className="w-full h-48 object-cover rounded-lg mb-4"
						/>
						<h2 className="text-xl font-semibold">{dog.name}</h2>
						<p className="text-gray-700">Breed: {dog.breed}</p>
						<p className="text-gray-700">Age: {dog.age} years</p>
						<p className="text-gray-700">Size: {dog.size}</p>
						<Link
							href={`/dogs/${dog.id}`}
							className="text-blue-500 hover:underline mt-2 block"
						>
							View More
						</Link>
					</div>
				))}
			</div>
		</main>
	);
};

export default DogsPage;
