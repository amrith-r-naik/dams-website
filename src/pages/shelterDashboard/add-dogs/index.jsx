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
	const handleImageUpload = async (e) => {
		const files = Array.from(e.target.files);
		const uploadedImages = [];

		for (const file of files) {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", "dams_upload"); // Replace with your Cloudinary preset

			const res = await fetch(
				"https://api.cloudinary.com/v1_1/dxgkiabgb/image/upload",
				{
					method: "POST",
					body: formData,
				}
			);
			const data = await res.json();
			uploadedImages.push(data.secure_url); // Push the secure URL of the uploaded image
		}

		setForm((prevForm) => ({
			...prevForm,
			imageUrl: [...prevForm.imageUrl, ...uploadedImages],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/dogs", {
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
			<input
				type="file"
				multiple
				accept="image/*"
				onChange={handleImageUpload}
			/>
			<div>
				<h3>Uploaded Images:</h3>
				<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
					{form.imageUrl.map((url, index) => (
						<img
							key={index}
							src={url}
							alt={`Uploaded ${index}`}
							style={{ width: "100px", height: "100px", objectFit: "cover" }}
						/>
					))}
				</div>
			</div>
			<button type="submit">Add Dog</button>
		</form>
	);
}
AddDogPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
