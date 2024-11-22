"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function MainNav({ className }) {
	const [isLoading, setIsLoading] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = useSession();

	const handleLogout = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		await signOut();
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	};
	return (
		<div
			className={`${className} mr-4 hidden md:flex justify-between relative`}
		>
			<Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
				<Icons.logo className="h-12 w-12" />
				<span className="hidden font-bold lg:inline-block text-xl">
					FurEver
				</span>
			</Link>

			<nav className="flex items-center gap-4 text-sm xl:gap-6">
				<Link
					href="/dogs"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname === "/dogs" ? "text-foreground" : "text-foreground/60"
					)}
				>
					Dogs
				</Link>

				{/* TODO (Trisha): Change the navigation menus*/}
				<Link
					href="/dogBreed"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/docs/components") &&
							!pathname?.startsWith("/docs/component/chart")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Breeds
				</Link>

				{session && session.user && session.user.role === "SHELTER_STAFF" && (
					<Link
						href="/shelterDashboard"
						className={cn(
							"transition-colors hover:text-foreground/80",
							pathname?.startsWith("/shelterDashboard")
								? "text-foreground"
								: "text-foreground/60"
						)}
					>
						Dashboard
					</Link>
				)}
			</nav>

			{/* Theme toggle button and signIn button */}
			<div className="flex gap-2 justify-center">
				<ThemeToggle />
				{session ? (
					<Button variant="destructive" onClick={handleLogout}>
						Logout
					</Button>
				) : (
					<Button onClick={() => router.push("/signIn")}>SignIn</Button>
				)}
			</div>
		</div>
	);
}
