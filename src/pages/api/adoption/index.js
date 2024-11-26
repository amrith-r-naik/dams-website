import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { userId, dogId, applicationForm } = req.body;

		if (!userId || !dogId || !applicationForm) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		try {
			const adoption = await prisma.adoption.create({
				data: {
					userId,
					dogId,
					applicationForm,
					status: "PENDING",
				},
			});
			res.status(201).json(adoption);
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ message: "Failed to submit adoption application" });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).json({ message: `Method ${req.method} not allowed` });
	}
}
