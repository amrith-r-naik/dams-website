import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (req.method === "GET") {
		try {
			const { current } = req.query;

			if (current === "true") {
				const session = await getServerSession(req, res, authOptions);

				if (!session || !session.user || !session.user.email) {
					return res.status(401).json({ error: "No active session found" });
				}

				const user = await prisma.user.findUnique({
					where: { email: session.user.email },
					select: { email: true, name: true, role: true, shelter: true },
				});

				if (!user) {
					return res.status(404).json({ error: "User not found" });
				}

				if (!user.shelter) {
					return res
						.status(404)
						.json({ error: "No shelter associated with this user" });
				}

				return res.status(200).json({ user });
			}

			if (!user) {
				return res.status(404).json({ error: "Shelter not found" });
			}

			return res.status(200).json({ user });
		} catch (error) {
			console.error("Error fetching shelters:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else if (req.method === "PATCH") {
		const { name } = req.body;

		try {
			const updatedName = await prisma.user.update({
				where: { id: session.user.id },
				data: { name },
			});
			return res.status(200).json(updatedName);
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ message: "Failed to update adoption status" });
		}
	} else {
		res.setHeader("Allow", ["GET", "PUT"]);
		return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
}
