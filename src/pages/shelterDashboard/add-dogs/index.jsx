// /pages/dogs/add.js (Updated)
import { useState, useEffect } from "react";
import Layout from "../layout";

export default function AddDogPage() {
	const [form, setForm] = useState({
		name: "",
		age: 0,
		description: "",
		status: "AVAILABLE",
		imageUrl: [],
		breedId: null,
	});

	const [breeds, setBreeds] = useState([]);

	useEffect(() => {
		fetch("/api/dogBreed")
			.then((res) => res.json())
			.then(setBreeds);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/addDog", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		if (res.ok) alert("Dog added successfully!");
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Add Dog</h1>
			<input
				placeholder="Name"
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
			/>
			<input
				type="number"
				placeholder="Age"
				value={form.age}
				onChange={(e) => setForm({ ...form, age: e.target.value })}
			/>
			<textarea
				placeholder="Description"
				value={form.description}
				onChange={(e) => setForm({ ...form, description: e.target.value })}
			/>
			<select
				value={form.breedId || ""}
				onChange={(e) =>
					setForm({ ...form, breedId: parseInt(e.target.value) })
				}
			>
				<option value="">Select Breed</option>
				{breeds.map((breed) => (
					<option key={breed.id} value={breed.id}>
						{breed.name}
					</option>
				))}
			</select>
			<button type="submit">Add Dog</button>
		</form>
	);
}
AddDogPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
