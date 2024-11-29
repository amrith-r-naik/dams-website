import Image from "next/image";
import { useEffect, useState } from "react";

export default function FavoriteDogsList() {
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				const response = await fetch("/api/favourite");
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

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	if (favorites.length === 0) {
		return <p>No favorites added yet!</p>;
	}

	return (
		<div>
			<h2>Your Favorite Dogs</h2>
			<ul>
				{favorites.map((fav) => (
					<li key={fav.id}>
						<h3>{fav.dog.name}</h3>
						<p>{fav.dog.description}</p>
						<Image
							src={fav.dog.imageUrl[0]}
							alt={fav.dog.name}
							width="150"
							height="150"
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
