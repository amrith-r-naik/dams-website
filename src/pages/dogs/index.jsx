import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Heart, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Loader from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const DogsPage = () => {
	const [dogs, setDogs] = useState([]);
	const [filteredDogs, setFilteredDogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const { theme, setTheme } = useTheme();
	const [favorites, setFavorites] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [ageRange, setAgeRange] = useState("all");
	const [selectedBreed, setSelectedBreed] = useState("all");
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
		if (ageRange != "all") {
			const [min, max] = ageRange.split("-").map(Number);
			updatedDogs = updatedDogs.filter(
				(dog) => dog.age >= min && dog.age <= max
			);
		}

		// Filter by selected breed
		if (selectedBreed != "all") {
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

	if (loading)
		return (
			<div className="w-full min-h-full flex items-center justify-center">
				<Loader />
			</div>
		);

	return (
		<div className="w-full h-full p-8 bg-background text-foreground">
			{/* Search and Sort */}
			<div className="flex items-center gap-4 mb-6 w-full">
				<Input
					type="text"
					placeholder="Search by breed"
					className="w-full relative pl-10"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<Search className="absolute opacity-80  translate-x-full" size={16} />
				{/* Age Range Dropdown */}
				<Select onValueChange={(value) => setAgeRange(value)}>
					<SelectTrigger className="w-1/4" value={ageRange}>
						<SelectValue placeholder={"Filter by Age Range"} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Age group</SelectItem>
						<SelectItem value="0-1">0-1 Years</SelectItem>
						<SelectItem value="2-4">2-4 Years</SelectItem>
						<SelectItem value="5-7">5-7 Years</SelectItem>
						<SelectItem value="8-12">8-12 Years</SelectItem>
						<SelectItem value="13-20">13+ Years</SelectItem>
					</SelectContent>
				</Select>
				{/* Breed Dropdown */}
				<Select onValueChange={(value) => setSelectedBreed(value)}>
					<SelectTrigger className="w-1/4">
						<SelectValue placeholder="Filter by breed" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Breeds</SelectItem>
						{breeds.map((breed) => (
							<SelectItem key={breed} value={breed}>
								{breed}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Dog Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{filteredDogs.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center py-16">
						<p className="text-lg font-medium text-muted-foreground">
							🐾 No Dogs Found
						</p>
						
					</div>
				)}
				{filteredDogs.map((dog) => (
					<div
						key={dog.id}
						className="relative card bg-card border border-border shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
					>
						<Image
							src={dog.imageUrl[0] || "/placeholder-image-dog.png"}
							alt={dog.name}
							width={500}
							height={500}
							className={`w-full h-48 rounded-lg mb-4 ${
								dog.imageUrl.length === 0 && theme === "dark" && "invert"
							} ${
								dog.imageUrl.length === 0 ? "object-contain" : "object-cover"
							}`}
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
