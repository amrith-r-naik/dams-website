import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const dogs = await prisma.dog.findMany({
				where: { status: "AVAILABLE" },
				select: {
					id: true,
					name: true,
					breed: true,
					age: true,
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
