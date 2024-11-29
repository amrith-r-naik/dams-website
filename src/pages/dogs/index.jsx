import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { useTheme } from "next-themes";

const DogsPage = () => {
	const [dogs, setDogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		const fetchDogs = async () => {
			try {
				const response = await fetch("/api/dogs?all=true");
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
		<div className="w-full h-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-8">
			{dogs.length === 0 && (
				<p className="col-span-full text-center">NO DOGS FOUND</p>
			)}
			{dogs.map((dog) => (
				<div
					key={dog.id}
					className="card bg-card border border-border shadow-lg p-4 rounded-lg flex flex-col items-center"
				>
					<Image
						src={dog.imageUrl[0] || "/placeholder-image-dog.png"}
						alt={dog.name}
						width={500}
						height={500}
						className={`w-full h-48 object-cover rounded-lg mb-4 ${dog.imageUrl.length===0 && theme==="dark" && "invert"}`}
					/>
					<h2 className="text-xl font-semibold text-card-foreground text-center">
						{dog.name}
					</h2>
					<p className="text-card-foreground/50 text-center">
						Breed:{dog.breed?.name}
					</p>
					<p className="text-card-foreground/50 text-center">
						Age: {dog.age} years
					</p>
					<p className="text-card-foreground/50 text-center">
						Description: {dog.description}
					</p>
					<Link
						href={`/dogs/${dog.id}`}
						className="text-primary hover:underline mt-2 block text-center"
					>
						View More
					</Link>
				</div>
			))}
		</div>
	);
};

export default DogsPage;
