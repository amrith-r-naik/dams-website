import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma"; // Assuming Prisma client is configured here

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Get the current user's session
		const session = await getServerSession(req, res, authOptions);

		if (!session || !session.user || !session.user.email) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		// Fetch the user from the database
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: { shelter: { include: { dogs: true } } }, // Include shelter and its related dogs
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if the user is shelter staff
		if (user.role !== "SHELTER_STAFF") {
			return res.status(403).json({ error: "Forbidden" });
		}

		// Check if the user is linked to a shelter
		if (!user.shelter) {
			return res
				.status(404)
				.json({ error: "No shelter associated with this user" });
		}

		// Return shelter details
		return res.status(200).json({
			shelter: user.shelter,
		});
	} catch (error) {
		console.error("Error fetching shelter details:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
