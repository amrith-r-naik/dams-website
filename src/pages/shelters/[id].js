import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/ui/loader";
import { useTheme } from "next-themes";

const ShelterDetailsPage = () => {
	const router = useRouter();
	const { id } = router.query; // Get the shelter ID from the URL
	const [shelter, setShelter] = useState(null);
	const [loading, setLoading] = useState(true);
	const { theme } = useTheme();

	useEffect(() => {
		if (!id) return;

		const fetchShelterDetails = async () => {
			try {
				const response = await fetch(`/api/shelter?id=${id}`);
				const data = await response.json();

				if (response.ok) {
					setShelter(data.shelter);
				} else {
					console.error("Error fetching shelter details:", data.error);
				}
			} catch (error) {
				console.error("Error fetching shelter details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchShelterDetails();
	}, [id]);

	if (loading)
		return (
			<div className="w-full min-h-full flex items-center justify-center">
				<Loader />
			</div>
		);
	if (!shelter)
		return (
			<p className="text-destructive-foreground font-medium text-center">
				Shelter not found
			</p>
		);

	return (
		<div className="container mx-auto p-8 bg-background text-foreground">
			<div className="text-center mb-10">
				<h1 className={`text-3xl font-bold ${theme ==="dark" && theme === "system"? "invert" : ""} text-primary-foreground"`}>
					{shelter.name}
				</h1>
				<p className="text-card-foreground/70 mt-2">{shelter.address}</p>
				<p className="text-card-foreground/70">Phone: {shelter.phoneNumber}</p>
			</div>

			<h2 className="text-3xl font-bold text-center mb-8">
				Dogs in Shelter
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
				{shelter.dogs && shelter.dogs.length > 0 ? (
					shelter.dogs.map((dog) => (
						<div
							key={dog.id}
							className="relative card bg-card border border-border shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
						>
							{/* Image */}
							<Image
								src={dog.imageUrl[0] || "/placeholder-image-dog.png"}
								alt={dog.name}
								width={500}
								height={500}
								className={`w-full h-48 rounded-lg mb-4 ${dog.imageUrl.length === 0 &&
									(theme === "dark" || theme === "system") &&
									"invert"} ${dog.imageUrl.length === 0 ? "object-contain" : "object-cover"}`}
							/>
							{/* Dog Details */}
							<div className="p-4 flex flex-col gap-2">
								<h3 className="text-lg font-semibold text-card-foreground">
									{dog.name}
								</h3>
								<p className="text-sm text-muted-foreground">
									<span className="font-medium">Age:</span> {dog.age} years
								</p>
								<p className="text-sm text-muted-foreground">
									<span className="font-medium">Status:</span> {dog.status}
								</p>
								<p className="text-sm text-muted-foreground line-clamp-2">
									<span className="font-medium">Description:</span>{" "}
									{dog.description || "No description available."}
								</p>
								<Link
									href={`/dogs/${dog.id}`}
									className="text-sm font-medium rounded-lg text-primary hover:underline mt-2 self-start border px-4 py-2"
								>
									View More →
								</Link>
							</div>
						</div>
					))
				) : (
					<div className="col-span-full flex flex-col items-center justify-center py-16">
						<p className="text-lg font-medium text-muted-foreground">
							🐾 No Dogs Found in This Shelter
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ShelterDetailsPage;
