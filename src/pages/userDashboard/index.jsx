import React from "react";
import withRoleProtection from "@/lib/roleProtection";
const userDashboard = () => {
	return <div>userDashboard</div>;
};

export default withRoleProtection(userDashboard, ["USER"]);
