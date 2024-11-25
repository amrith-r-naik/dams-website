import React from "react";
import withRoleProtection from "@/lib/roleProtection";
import Layout from "./layout";

export default function ShelterDashboard() {
	return <p>Hello</p>;
}

ShelterDashboard.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

// export default withRoleProtection(ShelterDashboard, ["SHELTER_STAFF"]);
