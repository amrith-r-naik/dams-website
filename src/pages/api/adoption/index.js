import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust path if necessary
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

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
			return res.status(201).json(adoption);
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ message: "Failed to submit adoption application" });
		}
	}

	if (req.method === "GET") {
		try {
			const session = await getServerSession(req, res, authOptions);
			const { user } = req.query;
			console.log(user);
			if (!session) {
				return res.status(401).json({ message: "Unauthorized" });
			}

			if (user === "true") {
				const adoptions = await prisma.adoption.findMany({
					where: { userId: session.user.id },
					include: {
						dog: {
							include: {
								breed: true,
								shelter: true,
							},
						},
						user: true,
					},
				});

				return res.status(200).json(adoptions);
			}
			const shelter = await prisma.shelter.findUnique({
				where: { staffId: session.user.id },
			});

			if (!shelter) {
				return res
					.status(400)
					.json({ message: "Shelter not found for the user." });
			}

			const adoptions = await prisma.adoption.findMany({
				where: {
					dog: {
						shelterId: shelter.id,
					},
				},
				include: {
					dog: {
						include: {
							breed: true,
						},
					},
					user: true,
				},
			});

			return res.status(200).json(adoptions);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Failed to fetch adoptions" });
		}
	}

	// Update adoption status
	if (req.method === "PATCH") {
		const { adoptionId, status } = req.body;

		if (!adoptionId || !status) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		try {
			const updatedAdoption = await prisma.adoption.update({
				where: { id: adoptionId },
				data: { status },
				include: {
					dog: {
						include: {
							breed: true,
						},
					},
					user: true,
				},
			});
			return res.status(200).json(updatedAdoption);
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ message: "Failed to update adoption status" });
		}
	}

	// Delete adoption
	if (req.method === "DELETE") {
		const { adoptionId } = req.body;

		if (!adoptionId) {
			return res.status(400).json({ message: "Adoption ID is required" });
		}

		try {
			await prisma.adoption.delete({
				where: { id: adoptionId },
			});
			return res.status(200).json({ message: "Adoption deleted successfully" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Failed to delete adoption" });
		}
	}

	res.setHeader("Allow", ["POST", "GET", "PATCH", "DELETE"]);
	return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
