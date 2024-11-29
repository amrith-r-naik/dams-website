import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

const DogsPage = () => {
	const [dogs, setDogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const { theme, setTheme } = useTheme();
	const router = useRouter();

	useEffect(() => {
		const fetchDogs = async () => {
			try {
				const response = await fetch("/api/dogs?all=true");
				const data = await response.json();
				setDogs(data);
			} catch (error) {
				console.error("Error fetching dogs:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDogs();
	}, []);

	const session = useSession();
	const user = session.data?.user;

	if (loading) return <p>Loading...</p>;
	return (
		<div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8 bg-background text-foreground">
			{dogs.length === 0 && (
				<div className="col-span-full flex flex-col items-center justify-center py-16">
					<p className="text-lg font-medium text-muted-foreground">
						🐾 No Dogs Found
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						Try adjusting your filters or come back later.
					</p>
				</div>
			)}
			{dogs.map((dog) => (
				<div
					key={dog.id}
					className="relative card bg-card border border-border shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
				>
					<Image
						src={dog.imageUrl[0] || "/placeholder-image-dog.png"}
						alt={dog.name}
						width={500}
						height={500}
						className={`w-full h-48 rounded-lg mb-4 ${dog.imageUrl.length===0 && theme==="dark" && "invert"} ${dog.imageUrl.length===0 ? "object-contain" : "object-cover"}`}
					/>
					<div className="p-4 flex flex-col gap-2 h-1/2 justify-evenly ">
						<div className="w-full flex justify-between items-center">
							<h2 className="text-lg font-semibold text-card-foreground">
								{dog.name}
							</h2>
							{/* TODO (Pranav) : Implement add and remove favorite functionality*/}
							<Heart
								// TODO : Change the colors if added to favorites
								fill="none"
								stroke="white"
								opacity={0.5}
								size={20}
								onClick={() => alert("clicked")}
							/>
						</div>
						<p className="text-sm text-muted-foreground">
							<span className="font-medium">Breed:</span>{" "}
							{dog.breed?.name || "Unknown"}
						</p>
						<p className="text-sm text-muted-foreground">
							<span className="font-medium">Age:</span> {dog.age} years
						</p>
						<p className="text-sm text-muted-foreground">
							<span className="font-medium">Description:</span>{" "}
							{dog.description || "No description available."}
						</p>
						<Button
							onClick={() => router.push(`/dogs/${dog.id}`)}
							variant="outline"
							className="text-sm font-medium rounded-lg text-primary hover:underline mt-2 self-start"
						>
							View More →
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};

export default DogsPage;
