import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	const { id } = req.query;

	// Validate ID
	if (!id || isNaN(id)) {
		return res.status(400).json({ error: "Invalid ID" });
	}

	const session = await getServerSession(req, res, authOptions);

	// Ensure user is logged in
	if (!session || session.user.role !== "SHELTER_STAFF") {
		return res.status(403).json({ error: "Unauthorized" });
	}

	try {
		// Check if the dog exists and belongs to the current shelter staff
		const dog = await prisma.dog.findUnique({
			where: { id: parseInt(id) },
			include: { shelter: true },
		});

		if (!dog) {
			return res.status(404).json({ error: "Dog not found" });
		}

		if (dog.shelter.staffId !== session.user.id) {
			return res
				.status(403)
				.json({ error: "You do not have permission to modify this dog" });
		}

		if (req.method === "PUT") {
			// Handle status update
			const { status } = req.body;

			// Validate the status with your enum values
			const validStatuses = ["AVAILABLE", "UNAVAILABLE", "ADOPTED", "DECEASED"];
			if (!validStatuses.includes(status)) {
				return res.status(400).json({ error: "Invalid status value" });
			}

			const updatedDog = await prisma.dog.update({
				where: { id: parseInt(id) },
				data: { status },
			});

			return res.status(200).json(updatedDog);
		} else if (req.method === "DELETE") {
			// Handle dog deletion
			await prisma.dog.delete({
				where: { id: parseInt(id) },
			});

			return res.status(204).end(); // No content, successful deletion
		} else {
			// Method not allowed
			return res.status(405).json({ error: "Method not allowed" });
		}
	} catch (error) {
		console.error("Error handling request:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
