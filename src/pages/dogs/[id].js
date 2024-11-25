import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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
		<div className="min-h-screen bg-muted-foreground p-6 flex flex-col gap-6">
			{/* Dog Details Card */}
			<Card className="max-w-5xl mx-auto">
				<CardHeader>
					<h1 className="text-2xl font-semibold text-primary">{dog.name}</h1>
				</CardHeader>
				<CardContent className="flex flex-col md:flex-row gap-6">
					{/* Left Section: Image Carousel */}
					<div className="flex-1">
						<div className="relative w-full h-96 rounded-lg overflow-hidden">
							{dog.imageUrl.map((url, index) => (
								<Image
									key={index}
									src={url}
									alt={`${dog.name} image ${index + 1}`}
									fill
									className="rounded-lg object-cover"
								/>
							))}
						</div>
					</div>

					{/* Right Section: Dog Details */}
					<div className="flex-2">
						<h2 className="text-xl font-semibold mb-4 text-secondary">
							Details
						</h2>
						<div className="space-y-2">
							<p>
								<strong>Age:</strong> {dog.age}
							</p>
							<p>
								<strong>Description:</strong> {dog.description}
							</p>
							<p>
								<strong>Status:</strong>{" "}
								<Badge variant="secondary">{dog.status}</Badge>
							</p>
							<p>
								<strong>Breed:</strong> {dog.breed?.name || "Unknown"}
							</p>
						</div>
						<h3 className="text-lg font-medium mt-6 text-accent">
							Shelter Information
						</h3>
						<div className="space-y-2">
							<p>
								<strong>Name:</strong> {dog.shelter?.name}
							</p>
							<p>
								<strong>Address:</strong> {dog.shelter?.address}
							</p>
							<p>
								<strong>Phone:</strong> {dog.shelter?.phoneNumber}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Adoption Form */}
			<Card className="max-w-5xl mx-auto">
				<CardHeader>
					<h2 className="text-xl font-semibold text-primary">
						Adopt {dog.name}
					</h2>
				</CardHeader>
				<CardContent>
					{session ? (
						<form onSubmit={handleAdoptionSubmit} className="space-y-4">
							<Textarea
								value={formData.applicationForm}
								onChange={(e) =>
									setFormData({ ...formData, applicationForm: e.target.value })
								}
								placeholder="Why do you want to adopt this dog?"
								className="w-full"
								required
							/>
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "Submitting..." : "Submit Application"}
							</Button>
						</form>
					) : (
						<p className="text-muted">
							<strong>Please sign in to adopt this dog.</strong>
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
