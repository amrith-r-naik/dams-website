import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
	const { id } = req.query;

	// Validate ID
	if (!id || isNaN(id)) {
		return res.status(400).json({ error: "Invalid ID" });
	}

	const session = await getServerSession(req, res, authOptions);
	const isStaff = session && session.user.role === "SHELTER_STAFF";

	if (req.method === "GET") {
		try {
			const dog = await prisma.dog.findUnique({
				where: { id: parseInt(id) },
				include: {
					shelter: true,
					breed: true,
				},
			});

			if (!dog) {
				return res.status(404).json({ message: "Dog not found" });
			}

			// If authenticated, ensure the user can access the dog's details
			if (isStaff) {
				const shelter = await prisma.shelter.findUnique({
					where: { staffId: session.user.id },
					include: { dogs: true },
				});
				if (!shelter || !shelter.dogs.some((dog) => dog.id === parseInt(id))) {
					return res
						.status(403)
						.json({ error: "Unauthorized to access this dog" });
				}
			}

			res.status(200).json(dog);
		} catch (error) {
			console.error("Error fetching dog with id ", id, " : ", error);
			res.status(500).json({ message: "Internal server error" });
		}
	} else if (isStaff) {
		// PUT and DELETE methods are restricted to authenticated shelter staff
		const shelter = await prisma.shelter.findUnique({
			where: { staffId: session.user.id },
			include: { dogs: true },
		});

		if (!shelter || !shelter.dogs.some((dog) => dog.id === parseInt(id))) {
			return res.status(404).json({ error: "Dog not found in your shelter" });
		}

		if (req.method === "PUT") {
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
		} else if (req.method === "DELETE") {
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
	} else {
		// Restrict PUT and DELETE for unauthenticated or non-staff users
		res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
		res.status(405).json({ message: `Method ${req.method} not allowed` });
	}
}
