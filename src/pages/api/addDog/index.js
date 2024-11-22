import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { name, age, description, status, imageUrl, shelterId, breedId } =
			req.body;
		console.log(req.body);
		try {
			const newDog = await prisma.dog.create({
				data: {
					name,
					age,
					description,
					status,
					imageUrl,
					shelterId,
					breedId,
				},
			});

			res.status(201).json(newDog);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Failed to create dog" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
