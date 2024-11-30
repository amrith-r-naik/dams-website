import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

const DogsPage = () => {
	const [dogs, setDogs] = useState([]);
	const [filteredDogs, setFilteredDogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [ageRange, setAgeRange] = useState("");
	const [selectedBreed, setSelectedBreed] = useState("");
	const [breeds, setBreeds] = useState([]); // List of all breeds for dropdown
	const router = useRouter();
	const session = useSession();
	const user = session.data?.user;

	useEffect(() => {
		const fetchDogs = async () => {
			try {
				const response = await fetch("/api/dogs?all=true");
				const data = await response.json();
				setDogs(data);
				setFilteredDogs(data); // Initialize with all dogs
				// Extract unique breeds for dropdown
				const uniqueBreeds = [...new Set(data.map((dog) => dog.breed?.name))];
				setBreeds(uniqueBreeds.filter(Boolean)); // Remove undefined or null
			} catch (error) {
				console.error("Error fetching dogs:", error);
			} finally {
				setLoading(false);
			}
		};

		const fetchFavorites = async () => {
			try {
				const response = await fetch("/api/favorite");
				const data = await response.json();
				if (Array.isArray(data)) {
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

	// Filter and sort logic
	useEffect(() => {
		let updatedDogs = [...dogs];

		// Filter by search query
		if (searchQuery) {
			updatedDogs = updatedDogs.filter((dog) =>
				dog.breed?.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Filter by age range
		if (ageRange) {
			const [min, max] = ageRange.split("-").map(Number);
			updatedDogs = updatedDogs.filter(
				(dog) => dog.age >= min && dog.age <= max
			);
		}

		// Filter by selected breed
		if (selectedBreed) {
			updatedDogs = updatedDogs.filter(
				(dog) => dog.breed?.name === selectedBreed
			);
		}

		setFilteredDogs(updatedDogs);
	}, [searchQuery, ageRange, selectedBreed, dogs]);

	const toggleFavorite = async (dogId) => {
		if (!user) {
			alert("Please log in to manage favorites.");
			return;
		}

		const isFavorite = favorites.includes(dogId);
		try {
			if (isFavorite) {
				setFavorites(favorites.filter((id) => id !== dogId));
				await fetch(`/api/favorite/${dogId}`, { method: "DELETE" });
			} else {
				setFavorites([...favorites, dogId]);
				await fetch(`/api/favorite/${dogId}`, { method: "POST" });
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
		<div className="w-full h-full p-8 bg-background text-foreground">
			{/* Search and Sort */}
			<div className="flex flex-wrap items-center gap-4 mb-6">
				<input
					type="text"
					placeholder="Search by breed"
					className="border rounded-lg p-2 text-sm"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				{/* Age Range Dropdown */}
				<select
					className="border rounded-lg p-2 text-sm"
					value={ageRange}
					onChange={(e) => setAgeRange(e.target.value)}
				>
					<option value="">All Age Range</option>
					<option value="0-1">0-1 Years</option>
					<option value="2-4">2-4 Years</option>
					<option value="5-7">5-7 Years</option>
					<option value="8-12">8-12 Years</option>
					<option value="13-20">13+ Years</option>
				</select>
				{/* Breed Dropdown */}
				<select
					className="border rounded-lg p-2 text-sm"
					value={selectedBreed}
					onChange={(e) => setSelectedBreed(e.target.value)}
				>
					<option value="">All Breeds</option>
					{breeds.map((breed) => (
						<option key={breed} value={breed}>
							{breed}
						</option>
					))}
				</select>
			</div>

			{/* Dog Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{filteredDogs.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center py-16">
						<p className="text-lg font-medium text-muted-foreground">
							🐾 No Dogs Found
						</p>
						<p className="text-sm text-muted-foreground mt-2">
							Try adjusting your filters or come back later.
						</p>
					</div>
				)}
				{filteredDogs.map((dog) => (
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
									stroke={favorites.includes(dog.id) ? "red" : "white"}
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
		</div>
	);
};

export default DogsPage;
