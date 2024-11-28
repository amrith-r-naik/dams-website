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
		await signOut({ redirect: "/" });
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	};

	return (
		<div
			className={cn(
				"sticky top-0 z-50 bg-background backdrop-blur-lg shadow-md",
				className
			)}
		>
			<div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-1">
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<Icons.logo className="h-10 w-10" />
					<span className="hidden font-bold text-xl lg:inline-block">
						FurEver
					</span>
				</Link>

				{/* Navigation */}
				<nav className="flex items-center gap-6 text-sm xl:gap-8">
					<Link
						href="/dogs"
						className={cn(
							"transition-colors hover:text-primary",
							pathname === "/dogs" ? "text-primary" : "text-muted-foreground"
						)}
					>
						Dogs
					</Link>
					<Link
						href="/dogBreed"
						className={cn(
							"transition-colors hover:text-primary",
							pathname === "/dogBreed"
								? "text-primary"
								: "text-muted-foreground"
						)}
					>
						Breeds
					</Link>
					{session?.user?.role === "SHELTER_STAFF" && (
						<Link
							href="/shelterDashboard"
							className={cn(
								"transition-colors hover:text-primary",
								pathname?.startsWith("/shelterDashboard")
									? "text-primary"
									: "text-muted-foreground"
							)}
						>
							Dashboard
						</Link>
					)}
					<Link
						href="/shelters"
						className={cn(
							"transition-colors hover:text-primary",
							pathname?.startsWith("/shelters")
								? "text-primary"
								: "text-muted-foreground"
						)}
					>
						Shelters
					</Link>
				</nav>

				{/* Theme toggle button and sign-in/logout */}
				<div className="flex items-center gap-4">
					<ThemeToggle />
					{session ? (
						<Button
							variant="destructive"
							onClick={handleLogout}
							disabled={isLoading}
						>
							{isLoading ? "Logging Out..." : "Logout"}
						</Button>
					) : (
						<Button onClick={() => router.push("/signIn")}>Sign In</Button>
					)}
				</div>
			</div>
		</div>
	);
}
