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
		const res = await fetch(`/api/dogs/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(dog),
		});
		if (res.ok) alert("Dog updated successfully!");
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
		<form onSubmit={handleUpdate} className="p-6 space-y-6">
			<h1 className="text-2xl font-bold">Update Dog</h1>

			<Label htmlFor="name">Dog Name</Label>
			<Input
				id="name"
				value={dog.name}
				onChange={(e) => setDog({ ...dog, name: e.target.value })}
				placeholder="Enter dog's name"
			/>

			<Label htmlFor="age">Age</Label>
			<Input
				id="age"
				type="number"
				value={dog.age}
				onChange={(e) => setDog({ ...dog, age: parseInt(e.target.value) })}
				placeholder="Enter dog's age"
			/>

			<Label htmlFor="description">Description</Label>
			<Textarea
				id="description"
				value={dog.description}
				onChange={(e) => setDog({ ...dog, description: e.target.value })}
				placeholder="Write a description about the dog"
			/>

			<Label htmlFor="breed">Breed</Label>
			<Select
				onValueChange={(value) => setDog({ ...dog, breedId: parseInt(value) })}
				defaultValue={dog.breedId || ""}
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

			<Label htmlFor="image">Upload Images</Label>
			<Input
				id="image"
				type="file"
				multiple
				accept="image/*"
				onChange={handleImageUpload}
			/>

			<div className="mt-4">
				<h3 className="text-lg font-medium">Uploaded Images:</h3>
				<div className="flex gap-4 flex-wrap">
					{dog.imageUrl.map((url, index) => (
						<Card
							key={index}
							className="relative w-[100px] h-[100px] border rounded-lg overflow-hidden"
						>
							<Image
								src={url}
								alt={`Uploaded ${index}`}
								layout="fill"
								objectFit="cover"
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

			<Button type="submit" variant="primary">
				Update Dog
			</Button>
		</form>
	);
}
