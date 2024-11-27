// /pages/api/dogs/[id].js
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session || session.user.role !== "SHELTER_STAFF") {
		return res.status(403).json({ error: "Unauthorized" });
	}

	const { id } = req.query;

	if (req.method === "PUT") {
		const { name, address, phoneNumber } = req.body;

		// Build the `data` object dynamically with only provided fields
		const data = {};
		if (name) data.name = name;
		if (address) data.address = address;
		if (phoneNumber) data.phoneNumber = phoneNumber;

		try {
			const updatedShelter = await prisma.shelter.update({
				where: { id: parseInt(id) },
				data,
			});

			return res.status(200).json(updatedShelter);
		} catch (error) {
			return res
				.status(500)
				.json({ error: "Failed to update Shelter details" });
		}
	}

	return res.status(405).json({ error: "Method not allowed" });
}
