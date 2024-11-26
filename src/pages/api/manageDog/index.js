import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const session = await getServerSession(req, res, authOptions);

			if (!session || !session.user) {
				return res.status(401).json({ error: "Unauthorized" });
			}

			// Get the user's ID from the session
			const userId = session.user.id;

			// Fetch the dogs for the user's associated shelter
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

			res.status(200).json(dogs);
		} catch (error) {
			console.error("Error fetching dogs:", error);
			res.status(500).json({ error: "Failed to fetch dogs" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
