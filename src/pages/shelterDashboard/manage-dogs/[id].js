import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import Layout from "../layout";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function UpdateDogPage() {
	const [dog, setDog] = useState(null);
	const [breeds, setBreeds] = useState([]);
	const [errors, setErrors] = useState({});
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id) {
			fetch(`/api/dogs/${id}`)
				.then((res) => res.json())
				.then(setDog);
			fetch("/api/dogBreed")
				.then((res) => res.json())
				.then(setBreeds);
		}
	}, [id]);

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

		setDog((prevDog) => ({
			...prevDog,
			imageUrl: [...prevDog.imageUrl, ...uploadedImages],
		}));
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		// Validation
		const newErrors = {};

		if (!dog.name) {
			newErrors.name = "Dog name is required.";
		}
		if (!dog.age || dog.age <= 0) {
			newErrors.age = "Age must be a positive number.";
		}
		if (!dog.description) {
			newErrors.description = "Description is required.";
		}
		if (!dog.breedId) {
			newErrors.breed = "Breed must be selected.";
		}
		if (!dog.imageUrl || dog.imageUrl.length === 0) {
			newErrors.image = "At least one image must be uploaded.";
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			const res = await fetch(`/api/dogs/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(dog),
			});
			if (res.ok) alert("Dog updated successfully!");
		}
	};

	const handleDeleteImage = (urlToDelete) => {
		setDog((prevDog) => ({
			...prevDog,
			imageUrl: prevDog.imageUrl.filter((url) => url !== urlToDelete),
		}));
	};

	if (!dog)
		return (
			<div className="w-full min-h-full flex items-center justify-center">
				<Loader />
			</div>
		);

	return (
		<form onSubmit={handleUpdate} className="p-6 space-y-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold text-center mb-6">Update Dog</h1>

			<div className="space-y-4">
				<div>
					<Label htmlFor="name">Dog Name</Label>
					<Input
						id="name"
						value={dog.name}
						onChange={(e) => setDog({ ...dog, name: e.target.value })}
						placeholder="Enter dog's name"
						className="mt-2"
					/>
					{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
				</div>

				<div>
					<Label htmlFor="age">Age</Label>
					<Input
						id="age"
						type="number"
						value={dog.age}
						onChange={(e) => setDog({ ...dog, age: parseInt(e.target.value) })}
						placeholder="Enter dog's age"
						className="mt-2"
					/>
					{errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
				</div>

				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						value={dog.description}
						onChange={(e) => setDog({ ...dog, description: e.target.value })}
						placeholder="Write a description about the dog"
						className="mt-2"
					/>
					{errors.description && (
						<p className="text-red-500 text-sm">{errors.description}</p>
					)}
				</div>

				<div>
					<Label htmlFor="breed">Breed</Label>
					<Select
						onValueChange={(value) =>
							setDog({ ...dog, breedId: parseInt(value) })
						}
						defaultValue={dog.breedId || ""}
						className="mt-2"
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a breed" />
						</SelectTrigger>
						<SelectContent>
							{breeds.map((breed) => (
								<SelectItem key={breed.id} value={breed.id.toString()}>
									{breed.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.breed && (
						<p className="text-red-500 text-sm">{errors.breed}</p>
					)}
				</div>

				<div>
					<Label htmlFor="image">Upload Images</Label>
					<Input
						id="image"
						type="file"
						multiple
						accept="image/*"
						onChange={handleImageUpload}
						className="mt-2"
					/>
					{errors.image && (
						<p className="text-red-500 text-sm">{errors.image}</p>
					)}
				</div>
			</div>

			<div className="mt-6">
				<h3 className="text-lg font-medium mb-2">Uploaded Images:</h3>
				<div className="flex gap-4 flex-wrap">
					{dog.imageUrl.map((url, index) => (
						<Card
							key={index}
							className="relative w-[120px] h-[120px] border rounded-lg overflow-hidden"
						>
							<Image
								src={url}
								alt={`Uploaded ${index}`}
								layout="fill"
								objectFit="cover"
								className="rounded-md"
							/>
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"
								onClick={() => handleDeleteImage(url)}
							>
								<X size={16} />
							</Button>
						</Card>
					))}
				</div>
			</div>

			<div className="flex justify-center mt-8">
				<Button type="submit" className="w-full max-w-[200px]">
					Update Dog
				</Button>
			</div>
		</form>
	);
}

UpdateDogPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
