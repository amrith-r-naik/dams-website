import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state for update

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch("/api/user?current=true");
				const data = await response.json();
				if (!response.ok) throw new Error(data.error || "Failed to fetch user");
				setUser(data.user);
			} catch (err) {
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
			alert("User updated successfully!");
			setIsDialogOpen(false); // Close dialog after update
		} catch (error) {
			console.error("Error updating user:", error);
			alert("Error updating user");
		}
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="loader" />
			</div>
		);

	if (error)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p>{error}</p>
			</div>
		);

	if (!user)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p>No user data available</p>
			</div>
		);

	return (
		<div className="min-h-screen">
			<div className="container mx-auto py-12 px-6">
				<Card className="shadow-lg rounded-lg p-6 mx-auto max-w-md">
					<CardHeader className="flex justify-between items-center">
						<div>
							<CardTitle className="text-xl font-bold">{user.name}</CardTitle>
							<Button variant="outline" onClick={() => setIsDialogOpen(true)}>
								Edit user name
							</Button>
							<CardDescription>Email Address: {user.email}</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Role:</strong> {user.role}
						</p>
					</CardContent>
					<CardFooter />
				</Card>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update User</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleUpdate} className="space-y-4">
						<div>
							<label className="block text-sm font-medium">Name</label>
							<input
								className="w-full border rounded-lg px-4 py-2"
								value={user.name || ""}
								onChange={(e) => setUser({ ...user, name: e.target.value })}
								placeholder="User Name"
							/>
						</div>
						<Button type="submit" className="w-full">
							Update User name
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default UserDashboard;
