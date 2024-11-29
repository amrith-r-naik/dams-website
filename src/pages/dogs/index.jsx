import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

const DogsPage = () => {
	const [dogs, setDogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState([]); // Array of favorite dog IDs
	const router = useRouter();
	const session = useSession();
	const user = session.data?.user;

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

		const fetchFavorites = async () => {
			// if (!user) return;

			try {
				const response = await fetch("/api/favourite");
				const data = await response.json();
				console.log(data);
				if (Array.isArray(data)) {
					// Extract dog IDs from the fetched favorites
					setFavorites(data.map((fav) => fav.dogId));
				} else {
					console.error("Unexpected response format:", data);
					setFavorites([]);
				}
			} catch (error) {
				console.error("Error fetching favorites:", error);
			}
		};

		fetchDogs();
		fetchFavorites();
	}, [user]);

	const toggleFavorite = async (dogId) => {
		if (!user) {
			alert("Please log in to manage favorites.");
			return;
		}

		const isFavorite = favorites.includes(dogId);
		console.log(isFavorite);
		try {
			if (isFavorite) {
				await fetch(`/api/favourite/${dogId}`, { method: "DELETE" });
				setFavorites(favorites.filter((id) => id !== dogId));
			} else {
				console.log(dogId);
				await fetch(`/api/favourite/${dogId}`, { method: "POST" });
				setFavorites([...favorites, dogId]);
			}
		} catch (error) {
			console.error(
				`Error ${isFavorite ? "removing from" : "adding to"} favorites:`,
				error
			);
		}
	};

	if (loading) return <p>Loading...</p>;

	return (
		<div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8 bg-background text-foreground">
			{dogs.length === 0 && (
				<div className="col-span-full flex flex-col items-center justify-center py-16">
					<p className="text-lg font-medium text-muted-foreground">
						🐾 No Dogs Found
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						Try adjusting your filters or come back later.
					</p>
				</div>
			)}
			{dogs.map((dog) => (
				<div
					key={dog.id}
					className="relative card bg-card border border-border shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
				>
					<Image
						src={dog.imageUrl[0] || "/placeholder-image.jpg"}
						alt={dog.name}
						width={500}
						height={500}
						className="w-full h-56 object-cover"
					/>
					<div className="p-4 flex flex-col gap-2 h-1/2 justify-evenly">
						<div className="w-full flex justify-between items-center">
							<h2 className="text-lg font-semibold text-card-foreground">
								{dog.name}
							</h2>
							<Heart
								fill={favorites.includes(dog.id) ? "red" : "none"}
								stroke="red"
								opacity={0.8}
								size={20}
								className="cursor-pointer"
								onClick={() => toggleFavorite(dog.id)}
							/>
						</div>
						<p className="text-sm text-muted-foreground">
							<span className="font-medium">Breed:</span>{" "}
							{dog.breed?.name || "Unknown"}
						</p>
						<p className="text-sm text-muted-foreground">
							<span className="font-medium">Age:</span> {dog.age} years
						</p>
						<p className="text-sm text-muted-foreground">
							<span className="font-medium">Description:</span>{" "}
							{dog.description || "No description available."}
						</p>
						<button
							onClick={() => router.push(`/dogs/${dog.id}`)}
							className="text-sm font-medium rounded-lg text-primary hover:underline mt-2 self-start border px-4 py-2"
						>
							View More →
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default DogsPage;
