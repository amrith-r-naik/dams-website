import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session || !session.user?.email) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const userId = session.user.id;

	let { dogId } = req.query;
	dogId = parseInt(dogId);

	if (!dogId) {
		return res.status(400).json({ error: "Dog ID is required" });
	}
	try {
		if (req.method === "POST") {
			// Add to favorites
			const favorite = await prisma.favorite.create({
				data: { userId, dogId: parseInt(dogId) },
			});
			return res.status(201).json(favorite);
		}

		if (req.method === "DELETE") {
			// Remove from favorites
			await prisma.favorite.delete({
				where: { userId_dogId: { userId, dogId: parseInt(dogId) } },
			});
			return res.status(200).json({ message: "Favorite removed" });
		}

		res.setHeader("Allow", ["POST", "DELETE"]);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	} catch (error) {
		console.error("Error managing favorite:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
