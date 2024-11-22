import React from "react";
import withRoleProtection from "@/lib/roleProtection";
import AddDog from "@/components/add-dog-form";

const shelterDashboard = () => {
	return (
		<div>
			<h1>Shelter Dashboard</h1>
			<AddDog />
		</div>
	);
};

export default withRoleProtection(shelterDashboard, ["SHELTER_STAFF"]);
