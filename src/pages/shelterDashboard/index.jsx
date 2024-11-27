// import React from "react";
// import withRoleProtection from "@/lib/roleProtection";
// import Layout from "./layout";

// export default function ShelterDashboard() {
// 	return <p>Hello</p>;
// }

// ShelterDashboard.getLayout = function getLayout(page) {
// 	return <Layout>{page}</Layout>;
// };

// export default withRoleProtection(ShelterDashboard, ["SHELTER_STAFF"]);
import { useEffect, useState } from "react";
import Link from "next/link";
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
import { withRoleProtection } from "@/lib/roleProtection";

export default function ShelterDashboard() {
	const [user, setUser] = useState(null); // user is a single object, not an array
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null); // Error state

	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch("/api/user?current=true");
				const data = await response.json();
				if (!response.ok) throw new Error(data.error || "Failed to fetch user");
				setUser(data.user);
			} catch (error) {
				console.error("Error fetching user:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);
	const handleUpdate = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/user`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(user),
			});
			if (!res.ok) throw new Error("Failed to update user");
			alert("user updated successfully!");
		} catch (error) {
			console.error("Error updating user:", error);
			alert("Error updating user");
		}
	};

	if (loading)
		return (
			<div className="flex w-full items-center justify-center min-h-screen bg-background">
				<Loader className="w-8 h-8 text-primary animate-spin" />
			</div>
		);
	if (error) return <p>Error: {error}</p>;
	if (!user)
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
				<p>No user data available</p>
			</div>
		);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<Card className="bg-card border border-border shadow-xl rounded-lg p-6 mx-auto max-w-lg transition-transform hover:scale-[1.02]">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-card-foreground">
							{user.name}
						</CardTitle>
						<CardDescription className="text-sm text-muted-foreground">
							email Address: {user.email}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-card-foreground">
							<strong>Role:</strong> {user.role}
						</p>
					</CardContent>
				</Card>
			</div>
			<form onSubmit={handleUpdate}>
				<h1>Update user</h1>
				<input
					value={user.name || ""}
					onChange={(e) => setUser({ ...user, name: e.target.value })}
					placeholder="user Name"
				/>

				<button type="submit">Update user</button>
			</form>
		</div>
	);
}

// export default withRoleProtection(ShelterDashboard, ["SHELTER_STAFF"]);

ShelterDashboard.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
