import { useState, useEffect } from "react";
import Layout from "../layout";

export default function Adoptions() {
	const [adoptions, setAdoptions] = useState([]);
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Fetch adoptions
	useEffect(() => {
		const fetchAdoptions = async () => {
			try {
				const response = await fetch("/api/adoption", {
					method: "GET",
				});
				if (!response.ok) {
					throw new Error("Failed to fetch adoptions");
				}
				const data = await response.json();
				setAdoptions(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchAdoptions();
	}, []);

	// Update adoption status
	const updateStatus = async (adoptionId) => {
		setLoading(true);
		try {
			const response = await fetch("/api/adoption", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ adoptionId, status }),
			});
			if (!response.ok) {
				throw new Error("Failed to update adoption status");
			}
			const updatedAdoption = await response.json();
			setAdoptions((prev) =>
				prev.map((adoption) =>
					adoption.id === updatedAdoption.id ? updatedAdoption : adoption
				)
			);
			setStatus("");
		} catch (error) {
			console.error(error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	// Delete adoption
	const deleteAdoption = async (adoptionId) => {
		setLoading(true);
		try {
			const response = await fetch("/api/adoption", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ adoptionId }),
			});
			if (!response.ok) {
				throw new Error("Failed to delete adoption");
			}
			setAdoptions((prev) =>
				prev.filter((adoption) => adoption.id !== adoptionId)
			);
		} catch (error) {
			console.error(error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Manage Adoptions</h1>

			{error && <div className="text-red-500 mb-4">{error}</div>}

			<table className="w-full border-collapse border border-gray-300">
				<thead>
					<tr>
						<th className="border border-gray-300 p-2">Adoption ID</th>
						<th className="border border-gray-300 p-2">Dog Name</th>
						<th className="border border-gray-300 p-2">Dog breed</th>
						<th className="border border-gray-300 p-2">Description</th>
						<th className="border border-gray-300 p-2">Applicant</th>
						<th className="border border-gray-300 p-2">Status</th>
						<th className="border border-gray-300 p-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{adoptions.map((adoption) => (
						<tr key={adoption.id}>
							<td className="border border-gray-300 p-2">{adoption.id}</td>
							<td className="border border-gray-300 p-2">
								{adoption.dog.name}
							</td>
							<td className="border border-gray-300 p-2">
								{adoption.dog.breed.name}
							</td>
							<td className="border border-gray-300 p-2">
								{adoption.dog.description}
							</td>
							<td className="border border-gray-300 p-2">
								{adoption.user.name}
							</td>
							<td className="border border-gray-300 p-2">{adoption.status}</td>
							<td className="border border-gray-300 p-2">
								<div className="flex space-x-2">
									<select
										value={status}
										onChange={(e) => setStatus(e.target.value)}
										className="border border-gray-300 p-1"
									>
										<option value="">Update Status</option>
										<option value="PENDING">Pending</option>
										<option value="APPROVED">Approved</option>
										<option value="REJECTED">Rejected</option>
									</select>
									<button
										onClick={() => updateStatus(adoption.id)}
										className="bg-blue-500 text-white px-2 py-1 rounded"
										disabled={loading}
									>
										Update
									</button>
									<button
										onClick={() => deleteAdoption(adoption.id)}
										className="bg-red-500 text-white px-2 py-1 rounded"
										disabled={loading}
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
Adoptions.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

