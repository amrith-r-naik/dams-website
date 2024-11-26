// /pages/dogs/[id].js (Updated)
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function UpdateDogPage() {
	const [dog, setDog] = useState(null);
	const [breeds, setBreeds] = useState([]);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id) {
			fetch(`/api/editDog/${id}`)
				.then((res) => res.json())
				.then(setDog);
			fetch("/api/dogBreed")
				.then((res) => res.json())
				.then(setBreeds);
		}
	}, [id]);

	const handleUpdate = async (e) => {
		e.preventDefault();
		const res = await fetch(`/api/editDog/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(dog),
		});
		if (res.ok) alert("Dog updated successfully!");
	};

	if (!dog) return <p>Loading...</p>;

	return (
		<form onSubmit={handleUpdate}>
			<h1>Update Dog</h1>
			<input
				value={dog.name}
				onChange={(e) => setDog({ ...dog, name: e.target.value })}
			/>
			<input
				type="number"
				value={dog.age}
				onChange={(e) => setDog({ ...dog, age: parseInt(e.target.value) })}
			/>
			<textarea
				value={dog.description}
				onChange={(e) => setDog({ ...dog, description: e.target.value })}
			/>
			<select
				value={dog.breedId || ""}
				onChange={(e) => setDog({ ...dog, breedId: parseInt(e.target.value) })}
			>
				<option value="">Select Breed</option>
				{breeds.map((breed) => (
					<option key={breed.id} value={breed.id}>
						{breed.name}
					</option>
				))}
			</select>
			<button type="submit">Update Dog</button>
		</form>
	);
}
