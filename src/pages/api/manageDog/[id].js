// /pages/api/dogs/[id].js (Updated handler for PUT)

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
export default async function handler(req, res) {
	if (req.method !== "PUT")
		return res.status(405).json({ error: "Method not allowed" });

	const session = await getServerSession(req, res, authOptions);
	if (!session || session.user.role !== "SHELTER_STAFF") {
		return res.status(403).json({ error: "Unauthorized" });
	}

	const { id } = req.query;
	const { name, age, description, status, imageUrl, breedId } = req.body;

	const shelter = await prisma.shelter.findUnique({
		where: { staffId: session.user.id },
		include: { dogs: true },
	});

	if (!shelter || !shelter.dogs.some((dog) => dog.id === parseInt(id))) {
		return res.status(404).json({ error: "Dog not found in your shelter" });
	}

	const updatedDog = await prisma.dog.update({
		where: { id: parseInt(id) },
		data: { name, age, description, status, imageUrl, breedId }, // Include breedId
	});

	return res.status(200).json(updatedDog);
}
