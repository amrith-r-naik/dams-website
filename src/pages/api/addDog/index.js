// /pages/api/dogs/index.js (Updated handler for POST)
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	if (req.method !== "POST")
		return res.status(405).json({ error: "Method not allowed" });

	const session = await getServerSession(req, res, authOptions);
	if (!session || session.user.role !== "SHELTER_STAFF") {
		return res.status(403).json({ error: "Unauthorized" });
	}

	let { name, age, description, status, imageUrl, breedId } = req.body;
	age = parseInt(age, 10);

	const shelter = await prisma.shelter.findUnique({
		where: { staffId: session.user.id },
	});

	if (!shelter) return res.status(404).json({ error: "Shelter not found" });

	const dog = await prisma.dog.create({
		data: {
			name,
			age,
			description,
			status,
			imageUrl,
			breedId, // Set breedId
			shelterId: shelter.id,
		},
	});

	return res.status(201).json(dog);
}
