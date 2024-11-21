import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const dogs = await prisma.dogBreed.findMany({
				select: {
					id: true,
					name: true,
					countryOfOrigin: true,
					furColor: true,
					height: true,
					eyeColor: true,
					longevity: true,
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
