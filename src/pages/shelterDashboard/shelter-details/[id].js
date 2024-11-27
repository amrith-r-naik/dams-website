// /pages/Shelters/[id].js (Updated)
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function UpdateShelterPage() {
	const [shelter, setShelter] = useState(null);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id) {
			fetch(`/api/shelter/${id}`)
				.then((res) => res.json())
				.then(setShelter);
		}
	}, [id]);

	const handleUpdate = async (e) => {
		e.preventDefault();
		const res = await fetch(`/api/shelter/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(shelter),
		});
		if (res.ok) alert("Shelter updated successfully!");
	};

	if (!shelter) return <p>Loading...</p>;

	return (
		<form onSubmit={handleUpdate}>
			<h1>Update Shelter</h1>
			<input
				value={shelter.name}
				onChange={(e) => setShelter({ ...shelter, name: e.target.value })}
			/>
			<input
				value={shelter.address}
				onChange={(e) => setShelter({ ...shelter, address: e.target.value })}
			/>
			<textarea
				value={shelter.phoneNumber}
				onChange={(e) =>
					setShelter({ ...shelter, phoneNumber: e.target.value })
				}
			/>
			<button type="submit">Update Shelter</button>
		</form>
	);
}
