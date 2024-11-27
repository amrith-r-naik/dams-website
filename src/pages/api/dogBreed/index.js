import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const { id } = req.query;

			if (id) {
				const dogs = await prisma.dogBreed.findUnique({
					where: { id: parseInt(id, 10) },
					include: { dogs: true },
				});

				if (!dogs) {
					return res.status(404).json({ error: "Shelter not found" });
				}

				return res.status(200).json({ dogs });
			}
			const dogs = await prisma.dogBreed.findMany({
				select: {
					id: true,
					name: true,
					countryOfOrigin: true,
					furColor: true,
					height: true,
					eyeColor: true,
					longevity: true,
					imageUrl: true,
					characterTraits: true,
					commonHealthProblems: true,
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
