import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Info, SquareArrowOutUpRight } from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/router";

export default function Adoptions() {
	const [adoptions, setAdoptions] = useState([]);
	const [error, setError] = useState("");
	const { theme } = useTheme();
	const router = useRouter();

	// Fetch adoptions
	useEffect(() => {
		const fetchAdoptions = async () => {
			try {
				const response = await fetch("/api/adoption?user=true", {
					method: "GET",
				});
				if (!response.ok) {
					throw new Error("Failed to fetch adoptions");
				}
				const data = await response.json();
				setAdoptions(data);
			} catch (error) {
				console.error(error);
				setError("Unable to fetch adoptions. Please try again later.");
			}
		};

		fetchAdoptions();
	}, []);

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Your Adoptions</h1>

			{error && <p className="text-red-500 mb-4">{error}</p>}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{adoptions.map((adoption) => (
					<Card key={adoption.id} className=" flex flex-col w-full p-2 gap-2">
						<div className="flex items-center gap-4 p-2">
							<Image
								src={adoption.dog.imageUrl[0] || "/placeholder-image-dog.png"}
								alt={adoption.dog.name}
								width={100}
								height={100}
								className={`h-24 w-24 object-cover rounded-lg ${
									adoption.dog.imageUrl.length === 0 &&
									(theme === "dark" || theme === "system") &&
									"invert"
								}`}
							/>
							<div className="flex-1">
								<h3 className="text-lg font-medium text-card-foreground flex items-center">
									<p>{adoption.dog.name}</p>
									<SquareArrowOutUpRight
										size={10}
										className="ml-2 opacity-50 cursor-pointer"
										onClick={() => {
											router.push(`/dogs/${adoption.dog.id}`);
										}}
									/>
								</h3>
								<p className="text-sm text-card-foreground/40">
									{adoption.dog.breed?.name || "Breed Unknown"}
								</p>
								<p className="text-sm text-card-foreground/40">
									Shelter : {adoption.dog.shelter?.name || "Shelter Unknown"}
								</p>
								{adoption.status === "APPROVED" ? (
									<HoverCard>
										<HoverCardTrigger
											className={`text-md font-semibold ${
												adoption.status === "PENDING"
													? "text-orange-500"
													: adoption.status === "APPROVED"
													? "text-green-600"
													: "text-red-600"
											} flex items-center`}
										>
											<p className="text-sm text-card-foreground/40">
												Status :{" "}
											</p>
											&nbsp;
											<p className="cursor-pointer">
												{adoption.status || "Status Unknown"}
											</p>
											<Info size={20} className="ml-2 cursor-pointer" />
										</HoverCardTrigger>
										<HoverCardContent>
											<p className="text-sm">
												<span className="font-medium text-primary">
													Your adoption has been approved.
												</span>{" "}
												Please contact the shelter for further details.
											</p>
											<p className="mt-2 text-sm">
												<strong className="text-muted-foreground">
													Contact:
												</strong>{" "}
												<span className="text-secondary font-bold">
													{adoption.dog.shelter.phoneNumber}
												</span>
											</p>
										</HoverCardContent>
									</HoverCard>
								) : (
									<h3
										className={`text-md font-medium ${
											adoption.status === "PENDING"
												? "text-orange-500"
												: adoption.status === "APPROVED"
												? "text-green-600"
												: "text-red-600"
										} flex items-center`}
									>
										<p className="text-sm text-card-foreground/40">Status : </p>
										&nbsp;
										{adoption.status || "Status Unknown"}
									</h3>
								)}
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
