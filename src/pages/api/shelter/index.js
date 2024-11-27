import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
	if (req.method === "POST") {
		let { name, address, phoneNumber, staffId } = req.body;
		staffId = parseInt(staffId, 10);

		// Validate required fields
		if (!name || !address || !phoneNumber || !staffId) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		try {
			// Start a transaction to ensure both operations succeed together
			const [shelter, updatedUser] = await prisma.$transaction([
				// Create a new shelter
				prisma.shelter.create({
					data: {
						name,
						address,
						phoneNumber,
						staffId,
					},
				}),
				// Update the user's role
				prisma.user.update({
					where: { id: staffId },
					data: { role: "SHELTER_STAFF" },
				}),
			]);

			return res.status(201).json({ shelter, updatedUser });
		} catch (error) {
			console.error("Error creating shelter:", error);
			return res.status(500).json({ error: "Failed to create shelter" });
		}
	} else if (req.method === "GET") {
		try {
			const { id, current } = req.query;

			if (id) {
				// Fetch a single shelter by ID
				const shelter = await prisma.shelter.findUnique({
					where: { id: parseInt(id) },
					include: { dogs: true },
				});

				if (!shelter) {
					return res.status(404).json({ error: "Shelter not found" });
				}

				return res.status(200).json({ shelter });
			}

			if (current === "true") {
				// Fetch the current user's shelter
				const session = await getServerSession(req, res, authOptions);

				if (!session || !session.user || !session.user.email) {
					return res.status(401).json({ error: "Unauthorized" });
				}

				const user = await prisma.user.findUnique({
					where: { email: session.user.email },
					include: { shelter: true },
				});

				if (!user) {
					return res.status(404).json({ error: "User not found" });
				}

				if (user.role !== "SHELTER_STAFF") {
					return res.status(403).json({ error: "Forbidden" });
				}

				if (!user.shelter) {
					return res
						.status(404)
						.json({ error: "No shelter associated with this user" });
				}

				return res.status(200).json({ shelter: user.shelter });
			}

			// Fetch all shelters
			const shelters = await prisma.shelter.findMany();
			return res.status(200).json({ shelters });
		} catch (error) {
			console.error("Error handling shelter API:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else if (req.method === "PUT") {
		const { id, name, address, phoneNumber } = req.body;

		if (!id) {
			return res.status(400).json({ error: "Shelter ID is required" });
		}

		// Build the `data` object dynamically
		const data = {};
		if (name) data.name = name;
		if (address) data.address = address;
		if (phoneNumber) data.phoneNumber = phoneNumber;

		try {
			const updatedShelter = await prisma.shelter.update({
				where: { id: parseInt(id, 10) },
				data,
			});

			return res.status(200).json(updatedShelter);
		} catch (error) {
			console.error("Error updating shelter:", error);
			return res
				.status(500)
				.json({ error: "Failed to update shelter details" });
		}
	} else {
		// Method not allowed
		res.setHeader("Allow", ["POST", "GET"]);
		return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
}
