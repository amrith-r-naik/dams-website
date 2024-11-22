import React from "react";
import withRoleProtection from "@/lib/roleProtection";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CreateShelter = () => {
	const { data: session } = useSession();
	const [shelterDetails, setShelterDetails] = useState({
		name: "",
		address: "",
		phoneNumber: "",
		staffId: "", // staffId is the user who manages the shelter
	});

	const router = useRouter();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setShelterDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const submitShelterDetails = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/createShelter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(shelterDetails),
			});
			console.log(response);
			if (response.status === 200) {
				// Redirect to another page after successful creation
				router.push("/shelterDashboard");
			}
		} catch (error) {
			console.error("Error creating shelter", error);
		}
	};
	return (
		<div>
			<h1>Create Shelter</h1>
			<form onSubmit={submitShelterDetails}>
				<input
					type="text"
					name="name"
					value={shelterDetails.name}
					onChange={handleInputChange}
					placeholder="Shelter Name"
					required
				/>
				<input
					type="text"
					name="address"
					value={shelterDetails.address}
					onChange={handleInputChange}
					placeholder="Address"
					required
				/>
				<input
					type="text"
					name="phoneNumber"
					value={shelterDetails.phoneNumber}
					onChange={handleInputChange}
					placeholder="Phone Number"
					required
				/>
				<input
					type="number"
					name="staffId"
					value={shelterDetails.staffId}
					onChange={handleInputChange}
					placeholder="Staff ID"
					required
				/>
				<button type="submit">Create Shelter</button>
			</form>
		</div>
	);
};

export default CreateShelter;
