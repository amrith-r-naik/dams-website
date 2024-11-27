import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const CreateShelter = () => {
	const { data: session } = useSession();
	const [shelterDetails, setShelterDetails] = useState({
		name: "",
		address: "",
		phoneNumber: "",
		staffId: "",
	});

	const router = useRouter();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setShelterDetails((prev) => ({
			...prev,
			[name]: value,
			staffId: session.user.id,
		}));
	};

	const submitShelterDetails = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/shelter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(shelterDetails),
			});

			console.log(response);
			if (response.ok) {
				console.log("Response:", response);
				router.push("/shelterDashboard");
			}
		} catch (error) {
			console.error("Error creating shelter", error);
		}
	};

	return (
		<div className="flex justify-center min-h-full w-full items-center bg-background">
			<Card className="w-full max-w-lg bg-card">
				<CardHeader>
					<h1 className="text-2xl font-semibold text-card-foreground text-center">
						Create Shelter
					</h1>
				</CardHeader>
				<CardContent>
					<form onSubmit={submitShelterDetails} className="space-y-4">
						<div className="flex flex-col space-y-1">
							<Label htmlFor="name">Shelter Name</Label>
							<Input
								id="name"
								name="name"
								type="text"
								value={shelterDetails.name}
								onChange={handleInputChange}
								placeholder="Enter shelter name"
								required
							/>
						</div>
						<div className="flex flex-col space-y-1">
							<Label htmlFor="address">Address</Label>
							<Input
								id="address"
								name="address"
								type="text"
								value={shelterDetails.address}
								onChange={handleInputChange}
								placeholder="Enter address"
								required
							/>
						</div>
						<div className="flex flex-col space-y-1">
							<Label htmlFor="phoneNumber">Phone Number</Label>
							<Input
								id="phoneNumber"
								name="phoneNumber"
								type="text"
								value={shelterDetails.phoneNumber}
								onChange={handleInputChange}
								placeholder="Enter phone number"
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							Create Shelter
						</Button>
					</form>
				</CardContent>
				<CardFooter>
					<p className="text-sm text-muted-foreground">
						Ensure all fields are correctly filled before submitting.
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default CreateShelter;
