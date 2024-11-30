import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/ui/loader";

const ShelterDetailsPage = () => {
	const router = useRouter();
	const { id } = router.query; // Get the shelter ID from the URL
	const [shelter, setShelter] = useState(null);
	const [loading, setLoading] = useState(true);

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
			<p className="text-destructive-foreground font-medium">
				Shelter not found
			</p>
		);

	return (
		<div className="container mx-auto p-8 bg-background text-foreground">
			<div className="max-w-3xl mx-auto text-center">
				<h1 className="text-3xl font-bold text-primary-foreground">
					{shelter.name}
				</h1>
				<p className="text-card-foreground/70 mt-2">{shelter.address}</p>
				<p className="text-card-foreground/70">Phone: {shelter.phoneNumber}</p>
			</div>

			<h2 className="text-2xl font-semibold text-secondary-foreground mt-10">
				Dogs in Shelter
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{shelter.dogs && shelter.dogs.length > 0 ? (
					shelter.dogs.map((dog) => (
						<div
							key={dog.id}
							className="bg-card text-card-foreground/70 border border-border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
						>
							<h3 className="text-lg font-semibold">{dog.name}</h3>
							<Image
								src={dog.imageUrl[0] || "/placeholder-image.jpg"}
								alt={dog.name}
								width={500}
								height={500}
								className="w-full h-48 object-cover rounded-lg mt-2"
							/>
							<div className="mt-3 text-card-foreground/70">
								<p>Age: {dog.age}</p>
								<p>Status: {dog.status}</p>
								<p className="text-sm line-clamp-3">{dog.description}</p>
							</div>
							<Link
								href={`/dogs/${dog.id}`}
								className="text-primary hover:underline mt-4 inline-block"
							>
								View More
							</Link>
						</div>
					))
				) : (
					<p className="col-span-full text-center text-card-foreground/70-foreground">
						No dogs found in this shelter.
					</p>
				)}
			</div>
		</div>
	);
};

export default ShelterDetailsPage;
