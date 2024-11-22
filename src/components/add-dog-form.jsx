import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";

<CldUploadWidget uploadPreset="<Your Upload Preset>">
	{({ open }) => {
		return <button onClick={() => open()}>Upload an Image</button>;
	}}
</CldUploadWidget>;
export default function AddDog() {
	const [formData, setFormData] = useState({
		name: "",
		age: "",
		description: "",
		status: "",
		imageUrl: "",
		shelterId: "",
		breedId: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/dogs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			console.log(response);
			alert("Dog created successfully!");
			console.log("Response:", response.data);
		} catch (error) {
			console.error("Error creating dog:", error);
			alert("Failed to create dog");
		}
	};

	useEffect(() => {
		const loadCloudinaryScript = () => {
			if (typeof window !== "undefined" && !window.cloudinary) {
				const script = document.createElement("script");
				script.src = "https://upload-widget.cloudinary.com/global/all.js";
				script.async = true;
				script.onload = () => {
					console.log("Cloudinary script loaded successfully.");
				};
				script.onerror = (e) => {
					console.error("Failed to load Cloudinary script", e);
				};
				document.body.appendChild(script);
			}
		};

		loadCloudinaryScript();
	}, []);

	const openCloudinaryWidget = () => {
		if (typeof window !== "undefined" && window.cloudinary) {
			const widget = window.cloudinary.createUploadWidget(
				{
					cloudName: "dxgkiabgb", // replace with your Cloudinary cloud name
					uploadPreset: "dams_upload", // Replace with your upload preset
					multiple: false, // Allow only one image upload at a time
					sources: ["local", "url", "camera"], // Upload options: local files, URL, or camera
					showAdvancedOptions: false,
					buttonClass: "my-upload-button",
				},
				(error, result) => {
					if (error) {
						console.error("Cloudinary upload error: ", error);
					}
					if (result.event === "success") {
						console.log("Uploaded Image URL:", result.info.secure_url);
						// Optional: Prevent the widget from closing automatically
						// widget.close(); // Don't call this to let the widget stay open
					} else if (result.event === "closed") {
						console.log("Widget closed");
					}
				}
			);

			// Open the widget
			widget.open();
		} else {
			console.error("Cloudinary script not loaded or not available.");
		}
	};

	return (
		<div>
			<h1>Create a New Dog</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Name:</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Age:</label>
					<input
						type="number"
						name="age"
						value={formData.age}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Description:</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Status:</label>
					<input
						type="text"
						name="status"
						value={formData.status}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Image:</label>
					<button type="button" onClick={openCloudinaryWidget}>
						Upload Image
					</button>
					{formData.imageUrl && (
						<div>
							<p>Image Uploaded:</p>
							<image src={formData.imageUrl} alt="Uploaded Dog" width={200} />
						</div>
					)}
				</div>
				<div>
					<label>Shelter ID:</label>
					<input
						type="text"
						name="shelterId"
						value={formData.shelterId}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Breed ID:</label>
					<input
						type="text"
						name="breedId"
						value={formData.breedId}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit">Create Dog</button>
			</form>
		</div>
	);
}
