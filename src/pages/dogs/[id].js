"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ImageSlider from "@/components/image-slider";
import { ArrowLeft } from "lucide-react";

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
	const [hasApplied, setHasApplied] = useState(false);

	useEffect(() => {
		const fetchAdoptions = async () => {
			if (!session) return;

			try {
				const response = await fetch("/api/adoption?user=true", {
					method: "GET",
				});
				if (!response.ok) {
					throw new Error("Failed to fetch adoptions");
				}
				const data = await response.json();

				// Check if user has already applied for this specific dog
				const alreadyApplied = data.some(
					(application) => application.dogId === dog.id
				);
				setHasApplied(alreadyApplied);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAdoptions();
	}, [session, dog.id]);

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
		<div className="relative min-h-full w-full flex justify-center py-10 bg-background">
			<Card className="flex flex-col bg-card rounded-lg shadow-md">
				<CardHeader className="text-center border-b border-border p-6">
					<CardTitle className="text-4xl font-extrabold text-primary">
						{dog.name}
					</CardTitle>
				</CardHeader>

				<CardContent className="flex gap-10 p-8 px-16 items-stretch">
					<div className="flex items-center w-[40vw] h-full">
						<ImageSlider imageArray={dog.imageUrl} dog={dog} />
					</div>
					<div className="flex flex-col justify-evenly">
						<div className="space-y-3 text-base text-muted-foreground">
							<h2 className="font-bold text-accent">Details</h2>
							<p>
								<strong className="text-primary">Age:</strong> {dog.age} Years
							</p>
							<p>
								<strong className="text-primary">Description:</strong>{" "}
								{dog.description}
							</p>
							<div>
								<strong className="text-primary">Status:</strong>{" "}
								<Badge variant="secondary">{dog.status}</Badge>
							</div>
							<p>
								<strong className="text-primary">Breed:</strong>{" "}
								{dog.breed?.name || "Unknown"}
							</p>
						</div>

						<div className="space-y-3 text-base text-muted-foreground">
							<h3 className="font-bold text-accent">Shelter Information</h3>
							<p>
								<strong className="text-primary">Name:</strong>{" "}
								<button
									onClick={() => router.push(`/shelters/${dog.shelter.id}`)}
								>
									{dog.shelter?.name}
								</button>
							</p>
							<p>
								<strong className="text-primary">Address:</strong>{" "}
								{dog.shelter?.address}
							</p>
							<p>
								<strong className="text-primary">Phone:</strong>{" "}
								{dog.shelter?.phoneNumber}
							</p>
						</div>

						{session ? (
							hasApplied ? (
								<div>
									<p className="mt-8 text-muted-foreground">
										You have already applied to adopt this dog.
									</p>
									<button
										onClick={() => router.push(`/myAdoptions`)}
										className="text-sm font-medium rounded-lg text-primary hover:underline mt-2 self-start border px-4 py-2"
									>
										View My Adoptions
									</button>
								</div>
							) : (
								<form
									onSubmit={handleAdoptionSubmit}
									className="space-y-5 mt-8"
								>
									<Textarea
										value={formData.applicationForm}
										onChange={(e) =>
											setFormData({
												...formData,
												applicationForm: e.target.value,
											})
										}
										placeholder="Why do you want to adopt this dog?"
										className="w-full text-base rounded-lg placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring p-3"
										required
									/>
									<Button
										type="submit"
										className="w-full py-3 font-medium text-base rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-300"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Submitting..." : "Submit Application"}
									</Button>
								</form>
							)
						) : (
							<div className="mt-8 gap-2 text-muted-foreground w-full flex flex-col ">
								<p className="text-sm text-card-foreground/20">
									Please sign in to adopt this dog.
								</p>
								<Button
									type="submit"
									className="w-fit py-3 font-medium text-base rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-300"
									disabled={true}
								>
									Apply for Adoption
								</Button>
							</div>
						)}
					</div>
				</CardContent>

				<CardFooter className="text-center border-t border-border py-4">
					<p className="text-sm w-full text-muted-foreground">
						Adopt responsibly. Ensure you&apos;re ready to provide a loving
						home.
					</p>
				</CardFooter>
			</Card>

			<Button
				variant="outline"
				className="absolute rounded-full w-fit h-fit left-10 top-10"
				onClick={() => {
					router.back();
				}}
			>
				<ArrowLeft />
			</Button>
		</div>
	);
}
