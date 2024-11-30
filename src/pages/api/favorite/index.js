import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session || !session.user?.email) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const userId = session.user.id;

	try {
		if (req.method === "GET") {
			// Fetch all favorite dogs for the logged-in user
			const favorites = await prisma.favorite.findMany({
				where: { userId },
				include: {
					dog: {
						include: {
							breed: true,
						},
					}, // Assuming you have a "dog" relation in your Prisma schema
				},
			});

			return res.status(200).json(favorites);
		}

		res.setHeader("Allow", ["GET"]);
		return res.status(405).json({ error: `Method ${req.method} not allowed` });
	} catch (error) {
		console.error("Error fetching favorites:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
