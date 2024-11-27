import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import Layout from "../layout";

export default function UpdateShelterPage() {
	const [shelter, setShelter] = useState(null);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id) {
			fetch(`/api/shelter/${id}`)
				.then((res) => res.json())
				.then(setShelter);
		}
	}, [id]);

	const handleUpdate = async (e) => {
		e.preventDefault();
		const res = await fetch(`/api/shelter/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(shelter),
		});
		if (res.ok) alert("Shelter updated successfully!");
	};

	if (!shelter)
		return (
			<div className="flex w-full items-center justify-center min-h-screen bg-background text-muted-foreground">
				<p>Loading...</p>
			</div>
		);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<Card className="max-w-lg mx-auto bg-card border border-border shadow-lg p-6 rounded-lg">
					<CardHeader>
						<CardTitle className="text-xl font-bold text-card-foreground">
							Update Shelter
						</CardTitle>
					</CardHeader>
					<form onSubmit={handleUpdate}>
						<CardContent className="space-y-4">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-muted-foreground"
								>
									Name
								</label>
								<Input
									id="name"
									value={shelter.name}
									onChange={(e) =>
										setShelter({ ...shelter, name: e.target.value })
									}
									className="mt-1 w-full"
								/>
							</div>
							<div>
								<label
									htmlFor="address"
									className="block text-sm font-medium text-muted-foreground"
								>
									Address
								</label>
								<Input
									id="address"
									value={shelter.address}
									onChange={(e) =>
										setShelter({ ...shelter, address: e.target.value })
									}
									className="mt-1 w-full"
								/>
							</div>
							<div>
								<label
									htmlFor="phoneNumber"
									className="block text-sm font-medium text-muted-foreground"
								>
									Phone Number
								</label>
								<Textarea
									id="phoneNumber"
									value={shelter.phoneNumber}
									onChange={(e) =>
										setShelter({ ...shelter, phoneNumber: e.target.value })
									}
									className="mt-1 w-full"
								/>
							</div>
						</CardContent>
						<CardFooter className="mt-4">
							<Button
								type="submit"
								variant="primary"
								className="w-full py-2 text-sm font-medium"
							>
								Update Shelter
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}

UpdateShelterPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
