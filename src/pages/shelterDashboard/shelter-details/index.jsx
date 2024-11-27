import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../layout";
import Loader from "@/components/ui/loader";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ShelterPage = () => {
	const [shelter, setShelter] = useState(null); // Shelter state
	const [loading, setLoading] = useState(true); // Loading state
	const [error, setError] = useState(null); // Error state

	const router = useRouter();

	useEffect(() => {
		const fetchShelter = async () => {
			try {
				const response = await fetch("/api/shelter?current=true");
				const data = await response.json();
				if (!response.ok)
					throw new Error(data.error || "Failed to fetch shelter");
				setShelter(data.shelter);
			} catch (err) {
				console.error("Error fetching shelter:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchShelter();
	}, []);

	const handleUpdate = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/shelter`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(shelter),
			});
			if (!res.ok) throw new Error("Failed to update shelter");
			alert("Shelter updated successfully!");
		} catch (error) {
			console.error("Error updating shelter:", error);
			alert("Error updating shelter");
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!shelter) return <p>No shelter data available</p>;

	return (
		<div className="p-8">
			<form onSubmit={handleUpdate}>
				<h1>Update Shelter</h1>
				<input
					value={shelter.name || ""}
					onChange={(e) => setShelter({ ...shelter, name: e.target.value })}
					placeholder="Shelter Name"
				/>
				<input
					value={shelter.address || ""}
					onChange={(e) => setShelter({ ...shelter, address: e.target.value })}
					placeholder="Shelter Address"
				/>
				<textarea
					value={shelter.phoneNumber || ""}
					onChange={(e) =>
						setShelter({ ...shelter, phoneNumber: e.target.value })
					}
					placeholder="Phone Number"
				/>
				<button type="submit">Update Shelter</button>
			</form>
		</div>
	);
};

export default ShelterPage;

ShelterPage.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
