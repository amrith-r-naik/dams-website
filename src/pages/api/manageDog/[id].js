import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	// Check user authentication
	if (!session || session.user.role !== "SHELTER_STAFF") {
		return res.status(403).json({ error: "Unauthorized" });
	}

	const { id } = req.query;

	// Validate ID
	if (!id || isNaN(id)) {
		return res.status(400).json({ error: "Invalid ID" });
	}

	// Check if the dog exists and belongs to the shelter managed by the user
	const shelter = await prisma.shelter.findUnique({
		where: { staffId: session.user.id },
		include: { dogs: true },
	});

	if (!shelter || !shelter.dogs.some((dog) => dog.id === parseInt(id))) {
		return res.status(404).json({ error: "Dog not found in your shelter" });
	}

	if (req.method === "PUT") {
		// Extract fields from the request body
		const { name, age, description, status, imageUrl, breedId } = req.body;

		// Validate status if provided
		const validStatuses = ["AVAILABLE", "UNAVAILABLE", "ADOPTED", "DECEASED"];
		if (status && !validStatuses.includes(status)) {
			return res.status(400).json({ error: "Invalid status value" });
		}

		// Build the `data` object dynamically for partial updates
		const data = {};
		if (name) data.name = name;
		if (age) data.age = age;
		if (description) data.description = description;
		if (status) data.status = status;
		if (imageUrl) data.imageUrl = imageUrl;
		if (breedId) data.breedId = breedId;

		try {
			const updatedDog = await prisma.dog.update({
				where: { id: parseInt(id) },
				data,
			});
			return res.status(200).json(updatedDog);
		} catch (error) {
			console.error("Error updating dog:", error);
			return res.status(500).json({ error: "Failed to update dog details" });
		}
	}

	if (req.method === "DELETE") {
		try {
			await prisma.dog.delete({
				where: { id: parseInt(id) },
			});
			return res.status(200).json({ message: "Dog deleted successfully" });
		} catch (error) {
			console.error("Error deleting dog:", error);
			return res.status(500).json({ error: "Failed to delete dog" });
		}
	}

	return res.status(405).json({ error: "Method not allowed" });
}
