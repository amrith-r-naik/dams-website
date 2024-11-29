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
	const [errors, setErrors] = useState({});

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
			formData.append("upload_preset", "dams_upload");
			const res = await fetch(
				"https://api.cloudinary.com/v1_1/dxgkiabgb/image/upload",
				{
					method: "POST",
					body: formData,
				}
			);
			const data = await res.json();
			uploadedImages.push(data.secure_url);
		}
		setForm((prevForm) => ({
			...prevForm,
			imageUrl: [...prevForm.imageUrl, ...uploadedImages],
		}));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!form.name.trim()) newErrors.name = "Name is required.";
		if (!form.age || form.age <= 0)
			newErrors.age = "Age must be greater than 0.";
		if (!form.description.trim())
			newErrors.description = "Description is required.";
		if (!form.breedId) newErrors.breedId = "Please select a breed.";
		if (form.imageUrl.length === 0)
			newErrors.imageUrl = "Please upload at least one image.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			alert("Please fix the errors before submitting.");
			return;
		}

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
						<div>
							<input
								className={`w-full p-3 border rounded-lg bg-background text-foreground focus:ring ${
									errors.name ? "border-red-500" : "border-input"
								}`}
								placeholder="Name"
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm mt-1">{errors.name}</p>
							)}
						</div>
						<div>
							<input
								type="number"
								className={`w-full p-3 border rounded-lg bg-background text-foreground focus:ring ${
									errors.age ? "border-red-500" : "border-input"
								}`}
								placeholder="Age"
								value={form.age === 0 ? "" : form.age}
								onChange={(e) =>
									setForm({
										...form,
										age: e.target.value ? parseInt(e.target.value) : 0,
									})
								}
							/>
						</div>
						<div>
							<textarea
								className={`w-full p-3 border rounded-lg bg-background text-foreground focus:ring ${
									errors.description ? "border-red-500" : "border-input"
								}`}
								placeholder="Description"
								value={form.description}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
							/>
							{errors.description && (
								<p className="text-red-500 text-sm mt-1">
									{errors.description}
								</p>
							)}
						</div>
						<div>
							<select
								className={`w-full p-3 border rounded-lg bg-background text-foreground focus:ring ${
									errors.breedId ? "border-red-500" : "border-input"
								}`}
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
							{errors.breedId && (
								<p className="text-red-500 text-sm mt-1">{errors.breedId}</p>
							)}
						</div>
						<div>
							<input
								type="file"
								multiple
								accept="image/*"
								className={`w-full p-3 border rounded-lg bg-background text-foreground focus:ring ${
									errors.imageUrl ? "border-red-500" : "border-input"
								}`}
								onChange={handleImageUpload}
							/>
							{errors.imageUrl && (
								<p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
							)}
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold">Uploaded Images:</h3>
						<div className="flex gap-4 flex-wrap mt-2">
							{form.imageUrl.map((url, index) => (
								<Image
									key={index}
									src={url}
									alt={`Uploaded ${index}`}
									width={96}
									height={96}
									className="object-cover rounded-lg border border-muted"
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
