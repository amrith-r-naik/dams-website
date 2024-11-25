import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

export async function getServerSideProps(context) {
	const { id } = context.params;

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dogs/${id}`);
	if (res.status === 404) {
		return { notFound: true };
	}

	const dog = await res.json();
	return { props: { dog } };
}

export default function DogDetail({ dog }) {
	const { data: session } = useSession();
	const router = useRouter();
	const [formData, setFormData] = useState({ applicationForm: "" });
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAdoptionSubmit = async (e) => {
		e.preventDefault();

		if (!session) {
			alert("You need to sign in to adopt a dog.");
			return;
		}

		setIsSubmitting(true);
		try {
			const res = await fetch("/api/adoption", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: session.user.id,
					dogId: dog.id,
					applicationForm: formData.applicationForm,
				}),
			});

			if (res.ok) {
				alert("Adoption application submitted successfully!");
				setFormData({ applicationForm: "" });
				router.push("/"); // Redirect to home or another page
			} else {
				const error = await res.json();
				alert(`Error: ${error.message}`);
			}
		} catch (error) {
			alert("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div style={{ display: "flex", gap: "2rem" }}>
			{/* Left section: Carousel */}
			<div style={{ flex: 1 }}>
				<h1>{dog.name}</h1>
				<div style={{ position: "relative", width: "100%", height: "500px" }}>
					{dog.imageUrl.map((url, index) => (
						<Image
							key={index}
							src={url}
							alt={`${dog.name} image ${index + 1}`}
							layout="fill"
							objectFit="cover"
							style={{ borderRadius: "8px" }}
						/>
					))}
				</div>
			</div>

			{/* Right section: Details */}
			<div style={{ flex: 2 }}>
				<h2>Details</h2>
				<p>
					<strong>Age:</strong> {dog.age}
				</p>
				<p>
					<strong>Description:</strong> {dog.description}
				</p>
				<p>
					<strong>Status:</strong> {dog.status}
				</p>
				<p>
					<strong>Breed:</strong> {dog.breed?.name || "Unknown"}
				</p>

				<h3>Shelter Information</h3>
				<p>
					<strong>Name:</strong> {dog.shelter?.name}
				</p>
				<p>
					<strong>Address:</strong> {dog.shelter?.address}
				</p>
				<p>
					<strong>Phone:</strong> {dog.shelter?.phoneNumber}
				</p>

				{/* Adoption Form */}
				{session ? (
					<form onSubmit={handleAdoptionSubmit}>
						<h3>Adopt {dog.name}</h3>
						<textarea
							value={formData.applicationForm}
							onChange={(e) =>
								setFormData({ ...formData, applicationForm: e.target.value })
							}
							placeholder="Why do you want to adopt this dog?"
							required
							style={{ width: "100%", height: "100px", marginBottom: "1rem" }}
						/>
						<button
							type="submit"
							disabled={isSubmitting}
							style={{
								background: "blue",
								color: "white",
								padding: "0.5rem 1rem",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							{isSubmitting ? "Submitting..." : "Submit Application"}
						</button>
					</form>
				) : (
					<p>
						<strong>Please sign in to adopt this dog.</strong>
					</p>
				)}
			</div>
		</div>
	);
}
