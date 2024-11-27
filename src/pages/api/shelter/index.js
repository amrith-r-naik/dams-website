import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
	if (req.method === "POST") {
		let { name, address, phoneNumber, staffId } = req.body;
		staffId = parseInt(staffId, 10);

		if (!name || !address || !phoneNumber || !staffId) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		try {
			const [shelter, updatedUser] = await prisma.$transaction([
				prisma.shelter.create({
					data: { name, address, phoneNumber, staffId },
				}),
				prisma.user.update({
					where: { id: staffId },
					data: { role: "SHELTER_STAFF" },
				}),
			]);

			return res.status(201).json({ shelter, updatedUser });
		} catch (error) {
			console.error("Error creating shelter:", error);
			return res.status(500).json({ error: "Failed to create shelter" });
		}
	} else if (req.method === "GET") {
		try {
			const { id, current } = req.query;

			// if (!id && !current) {
			// 	return res
			// 		.status(400)
			// 		.json({ error: "Missing query parameter: id or current" });
			// }

			if (id) {
				const shelter = await prisma.shelter.findUnique({
					where: { id: parseInt(id, 10) },
					include: { dogs: true },
				});

				if (!shelter) {
					return res.status(404).json({ error: "Shelter not found" });
				}

				return res.status(200).json({ shelter });
			}

			if (current === "true") {
				const session = await getServerSession(req, res, authOptions);

				if (!session || !session.user || !session.user.email) {
					return res.status(401).json({ error: "No active session found" });
				}

				const user = await prisma.user.findUnique({
					where: { email: session.user.email },
					include: { shelter: true },
				});

				if (!user) {
					return res.status(404).json({ error: "User not found" });
				}

				if (user.role !== "SHELTER_STAFF") {
					return res.status(403).json({ error: "Forbidden" });
				}

				if (!user.shelter) {
					return res
						.status(404)
						.json({ error: "No shelter associated with this user" });
				}

				return res.status(200).json({ shelter: user.shelter });
			}

			const shelters = await prisma.shelter.findMany();
			return res.status(200).json({ shelters });
		} catch (error) {
			console.error("Error fetching shelters:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else if (req.method === "PUT") {
		const { id, name, address, phoneNumber } = req.body;

		if (!id) {
			return res.status(400).json({ error: "Shelter ID is required" });
		}

		const data = {};
		if (name) data.name = name;
		if (address) data.address = address;
		if (phoneNumber) data.phoneNumber = phoneNumber;

		try {
			const updatedShelter = await prisma.shelter.update({
				where: { id: parseInt(id, 10) },
				data,
			});

			return res.status(200).json(updatedShelter);
		} catch (error) {
			console.error("Error updating shelter:", error);
			return res
				.status(500)
				.json({ error: "Failed to update shelter details" });
		}
	} else {
		res.setHeader("Allow", ["POST", "GET", "PUT"]);
		return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
}
