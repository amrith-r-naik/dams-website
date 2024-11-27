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
			// Fetch dog details and breed list on load
			fetch(`/api/dogs/${id}`)
				.then((res) => res.json())
				.then(setDog);
			fetch("/api/dogBreed")
				.then((res) => res.json())
				.then(setBreeds);
		}
	}, [id]);

	// Handle image upload to Cloudinary
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

		// Update the dog's imageUrl state with the newly uploaded images
		setDog((prevDog) => ({
			...prevDog,
			imageUrl: [...prevDog.imageUrl, ...uploadedImages],
		}));
	};

	// Handle form submission for updating the dog
	const handleUpdate = async (e) => {
		e.preventDefault();
		const res = await fetch(`/api/dogs/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(dog),
		});
		if (res.ok) alert("Dog updated successfully!");
	};

	// Delete an image from the dog's imageUrl array
	const handleDeleteImage = (urlToDelete) => {
		setDog((prevDog) => ({
			...prevDog,
			imageUrl: prevDog.imageUrl.filter((url) => url !== urlToDelete),
		}));
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
			<input
				type="file"
				multiple
				accept="image/*"
				onChange={handleImageUpload}
			/>
			<div>
				<h3>Uploaded Images:</h3>
				<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
					{dog.imageUrl.map((url, index) => (
						<div key={index} style={{ position: "relative" }}>
							<img
								src={url}
								alt={`Uploaded ${index}`}
								style={{ width: "100px", height: "100px", objectFit: "cover" }}
							/>
							<button
								onClick={() => handleDeleteImage(url)}
								style={{
									position: "absolute",
									top: "0",
									right: "0",
									background: "rgba(0, 0, 0, 0.5)",
									color: "white",
									border: "none",
									cursor: "pointer",
								}}
							>
								X
							</button>
						</div>
					))}
				</div>
			</div>
			<button type="submit">Update Dog</button>
		</form>
	);
}
