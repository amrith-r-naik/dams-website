"use client";

import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const UserAccountNav = () => {
	return (
		<Button
			onClick={() => signOut()}
			variant="destructive">
			Logout
		</Button>
	);
};

export default UserAccountNav;
