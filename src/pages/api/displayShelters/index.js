import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { id, current } = req.query;

		if (id) {
			// Fetch a single shelter by ID
			const shelter = await prisma.shelter.findUnique({
				where: { id: parseInt(id) },
				include: { dogs: true }, // Include associated dogs
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
		} else {
			// Fetch all shelters
			const shelters = await prisma.shelter.findMany({
				include: { dogs: false }, // Exclude dogs for the list view
			});

			return res.status(200).json({ shelters });
		}
	} catch (error) {
		console.error("Error handling shelter API:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
