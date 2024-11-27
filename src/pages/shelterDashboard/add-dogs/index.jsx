import { useState, useEffect } from "react";
import Layout from "../layout";
import Image from "next/image";
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
		<div className="min-h-screen bg-background text-foreground">
			<div className="container mx-auto p-6">
				<form
					onSubmit={handleSubmit}
					className="bg-card p-8 rounded-lg shadow-md space-y-6"
				>
					<h1 className="text-2xl font-semibold text-primary">Add Dog</h1>
					<div className="space-y-4">
						<input
							className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring ring-primary"
							placeholder="Name"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>
						<input
							type="number"
							className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring ring-primary"
							placeholder="Age"
							value={form.age}
							onChange={(e) => setForm({ ...form, age: e.target.value })}
						/>
						<textarea
							className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring ring-primary"
							placeholder="Description"
							value={form.description}
							onChange={(e) =>
								setForm({ ...form, description: e.target.value })
							}
						/>
						<select
							className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring ring-primary"
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
							className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:ring ring-primary"
							onChange={handleImageUpload}
						/>
					</div>
					<div>
						<h3 className="text-lg font-semibold">Uploaded Images:</h3>
						<div className="flex gap-4 flex-wrap mt-2">
							{form.imageUrl.map((url, index) => (
								<Image
									key={index}
									src={url}
									alt={`Uploaded ${index}`}
									className="w-24 h-24 object-cover rounded-lg border border-muted"
								/>
							))}
						</div>
					</div>
					<button
						type="submit"
						className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:ring ring-primary"
					>
						Add Dog
					</button>
				</form>
			</div>
		</div>
	);
}

AddDogPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
