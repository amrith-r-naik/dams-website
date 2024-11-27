// /pages/api/dogs/[id].js
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session || session.user.role !== "SHELTER_STAFF") {
		return res.status(403).json({ error: "Unauthorized" });
	}

	const { id } = req.query;

	// Check if the dog belongs to the shelter managed by the user
	const shelter = await prisma.shelter.findUnique({
		where: { staffId: session.user.id },
		include: { dogs: true },
	});

	if (!shelter || !shelter.dogs.some((dog) => dog.id === parseInt(id))) {
		return res.status(404).json({ error: "Dog not found in your shelter" });
	}

	if (req.method === "PUT") {
		const { name, age, description, status, imageUrl, breedId } = req.body;

		try {
			const updatedDog = await prisma.dog.update({
				where: { id: parseInt(id) },
				data: { name, age, description, status, imageUrl, breedId },
			});

			return res.status(200).json(updatedDog);
		} catch (error) {
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
			return res.status(500).json({ error: "Failed to delete dog" });
		}
	}

	return res.status(405).json({ error: "Method not allowed" });
}
