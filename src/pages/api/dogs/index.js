import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (req.method === "POST") {
		// Ensure only shelter staff can add dogs
		if (!session || session.user.role !== "SHELTER_STAFF") {
			return res.status(403).json({ error: "Unauthorized" });
		}

		try {
			let { name, age, description, status, imageUrl, breedId } = req.body;
			age = parseInt(age, 10);

			// Find the shelter associated with the staff user
			const shelter = await prisma.shelter.findUnique({
				where: { staffId: session.user.id },
			});

			if (!shelter) return res.status(404).json({ error: "Shelter not found" });

			// Create a new dog record
			const dog = await prisma.dog.create({
				data: {
					name,
					age,
					description,
					status,
					imageUrl,
					breedId,
					shelterId: shelter.id,
				},
			});

			return res.status(201).json(dog);
		} catch (error) {
			console.error("Error creating dog:", error);
			return res.status(500).json({ error: "Failed to create dog" });
		}
	} else if (req.method === "GET") {
		try {
			const { all } = req.query;

			if (all === "true") {
				// Fetch all available dogs
				const dogs = await prisma.dog.findMany({
					where: { status: "AVAILABLE" },
					select: {
						id: true,
						name: true,
						age: true,
						breed: true,
						description: true,
						imageUrl: true,
					},
				});
				return res.status(200).json(dogs);
			}

			// Fetch dogs for the current user's shelter
			if (!session || !session.user) {
				return res.status(401).json({ error: "Unauthorized" });
			}

			const userId = session.user.id;

			const dogs = await prisma.dog.findMany({
				where: {
					shelter: {
						staff: {
							id: userId, // Ensure the user is linked to the shelter as staff
						},
					},
				},
				select: {
					id: true,
					name: true,
					age: true,
					breed: true,
					description: true,
					imageUrl: true,
				},
			});

			return res.status(200).json(dogs);
		} catch (error) {
			console.error("Error fetching dogs:", error);
			return res.status(500).json({ error: "Failed to fetch dogs" });
		}
	} else {
		// Method not allowed
		res.setHeader("Allow", ["POST", "GET"]);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	}
}
