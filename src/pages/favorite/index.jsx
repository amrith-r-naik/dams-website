import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash } from "lucide-react";
import Link from "next/link";

export default function FavoriteDogsList() {
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				const response = await fetch("/api/favorite");
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const data = await response.json();
				setFavorites(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFavorites();
	}, []);

	const deleteFavorite = async (dogId) => {
		try {
			const response = await fetch(`/api/favourite/${dogId}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			setFavorites(favorites.filter((fav) => fav.dog.id !== dogId));
		} catch (err) {
			console.error("Error deleting favorite:", err);
		}
	};

	if (loading) {
		return (
			<div className="space-y-4 p-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-20 w-full" />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-64">
				<p className="text-red-600 text-lg">{`Error: ${error}`}</p>
			</div>
		);
	}

	if (favorites.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-64">
				<p className="text-muted-foreground text-lg font-medium">
					🐾 No favorites added yet!
				</p>
			</div>
		);
	}

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Your Favorite Dogs</h2>
			<div className="space-y-4">
				{favorites.map((fav) => (
					<Card key={fav.id} className="border border-border">
						<div className="flex items-center gap-4 p-4">
							<Image
								src={fav.dog.imageUrl[0] || "/placeholder-image.jpg"}
								alt={fav.dog.name}
								width={100}
								height={100}
								className="w-20 h-20 object-cover rounded-lg"
							/>
							<div className="flex-1">
								<h3 className="text-lg font-medium text-card-foreground">
									{fav.dog.name}
								</h3>
								<p className="text-sm text-muted-foreground line-clamp-2">
									{fav.dog.description || "No description available."}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Link href={`/dogs/${fav.dog.id}`}>Details</Link>

								<Button
									variant="destructive"
									size="sm"
									onClick={() => deleteFavorite(fav.dog.id)}
								>
									<Trash size={16} />
									Delete from favorites
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
