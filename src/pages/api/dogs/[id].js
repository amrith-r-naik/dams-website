import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	const { id } = req.query;

	if (req.method === "GET") {
		try {
			const dog = await prisma.dog.findUnique({
				where: { id: parseInt(id) },
				include: {
					shelter: true,
					breed: true,
				},
			});

			if (!dog) {
				return res.status(404).json({ message: "Dog not found" });
			}

			res.status(200).json(dog);
		} catch (error) {
			console.error("Error fetching dog with id ", id, " : ", error);
			res.status(500).json({ message: "Internal server error" });
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).json({ message: `Method ${req.method} not allowed` });
	}
}
