import { prisma } from "@/lib/prisma";

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
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
	console.log("Request body:", req.body);
}
