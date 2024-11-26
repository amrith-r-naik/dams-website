import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
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
					title: "Shelter Details",
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
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				{/* TODO (Amrith) : Replace the header */}
				<VersionSwitcher
					versions={data.versions}
					defaultVersion={data.versions[0]}
				/>
				<SearchForm />
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
