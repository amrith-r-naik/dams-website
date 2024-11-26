import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils"; // Shadcn utility for className handling
import { Card } from "@/components/ui/card";

const DashboardLayout = ({ children }) => {
	const router = useRouter();

	const navLinks = [
		{ href: "/shelterDashboard/manage-dogs", label: "Manage Dogs" },
		{ href: "/shelterDashboard/add-dogs", label: "add Dogs" },
		{ href: "/shelterDashboard/edit-shelter", label: "Edit Shelter Details" },
		{
			href: "/shelterDashboard/view-applications",
			label: "View Adoption Applications",
		},
	];

	return (
		<div className="flex min-h-screen bg-background">
			{/* Side Menu */}
			<aside className="w-64 bg-card p-4">
				<Card className="h-full bg-card shadow-md">
					<nav className="flex flex-col space-y-4">
						<h2 className="text-xl font-semibold text-primary-foreground mb-4">
							Shelter Dashboard
						</h2>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"block px-4 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-primary-foreground",
									router.pathname === link.href &&
										"bg-primary text-primary-foreground"
								)}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</Card>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-6">{children}</main>
		</div>
	);
};

export default DashboardLayout;
