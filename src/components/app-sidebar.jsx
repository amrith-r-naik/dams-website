import * as React from "react";
import Link from "next/link";
import { Icons } from "./icons";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Home } from "lucide-react";
import { useRouter } from "next/router";

// This is sample data.
const data = {
	versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
	navMain: [
		{
			title: "Shelter Dashboard",
			url: "/shelterDashboard",
			items: [
				{
					title: "Manage Dogs",
					url: "/shelterDashboard/manage-dogs",
				},
				{
					title: "Add Dogs",
					url: "/shelterDashboard/add-dogs",
				},
				{
					title: "My Shelter",
					url: "/shelterDashboard/shelter-details",
				},
				{
					title: "Adoption Applications",
					url: "/shelterDashboard/adoption-applications",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }) {
	const router = useRouter();
	return (
		<Sidebar {...props}>
			<SidebarHeader className="m-2 flex flex-row justify-between items-center">
				<Link href="/" className="flex items-center justify-center">
					<Icons.logo className="h-12 w-12" />
					<span className="hidden font-bold lg:inline-block text-xl">
						FurEver
					</span>
				</Link>
				<Button
					variant="outline"
					className="w-fit p-0 px-3"
					onClick={() => router.push("/")}
				>
					<Home />
				</Button>
			</SidebarHeader>
			<SidebarContent>
				{/* We create a SidebarGroup for each parent. */}
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={item.isActive}>
											<a href={item.url}>{item.title}</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
