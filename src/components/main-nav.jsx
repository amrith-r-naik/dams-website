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
import { Heart, Home, PawPrint, Menu, X } from "lucide-react"; // Add icons for menu toggle

export function MainNav({ className }) {
	const [isLoading, setIsLoading] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling menu
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
			<div className="max-w-[80%] mx-auto flex justify-between items-center px-6 py-1">
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<Icons.logo className="h-10 w-10" />
					<span className="hidden font-bold text-xl lg:inline-block">
						FurEver
					</span>
				</Link>

				{/* Hamburger Menu Icon for mobile */}
				<div className="lg:hidden">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? <X size={20} /> : <Menu size={20} />}
					</Button>
				</div>

				{/* Navigation menu */}
				<nav
					className={`${
						isMenuOpen ? "block" : "hidden"
					} lg:flex items-center gap-8 text-sm xl:gap-8`}
				>
					{/* Dogs page button */}
					<Button
						variant="ghost"
						size="sm"
						className={
							pathname === "/dogs" ? "text-primary" : "text-muted-foreground"
						}
						onClick={() => router.push("/dogs")}
					>
						<PawPrint size={16} />
						<p>Dogs</p>
					</Button>

					{/* Shelters Page button */}
					<Button
						variant="ghost"
						size="sm"
						className={
							pathname === "/shelters"
								? "text-primary"
								: "text-muted-foreground"
						}
						onClick={() => router.push("/shelters")}
					>
						<Home size={16} />
						<p>Shelters</p>
					</Button>

					{/* Favorites Page Button */}
					{session && (
						<Button
							variant="ghost"
							size="sm"
							className={
								pathname === "/favorite"
									? "text-primary"
									: "text-muted-foreground"
							}
							onClick={() => router.push("/favorite")}
						>
							<Heart size={16} />
							<p>My Favorites</p>
						</Button>
					)}

					{/* My adoptions Page Button */}
					{session && (
						<Button
							variant="ghost"
							size="sm"
							className={
								pathname === "/myAdoptions"
									? "text-primary"
									: "text-muted-foreground"
							}
							onClick={() => router.push("/myAdoptions")}
						>
							<p>My Adoptions</p>
						</Button>
					)}

					{/* Shelter Dashboard Page Button */}
					{session?.user?.role === "SHELTER_STAFF" && (
						<Link
							href="/shelterDashboard"
							className={cn(
								"transition-colors hover:text-primary hover:border-primary border border-secondary rounded-full px-3 py-1",
								pathname?.startsWith("/shelterDashboard")
									? "text-primary"
									: "text-accent"
							)}
						>
							Dashboard
						</Link>
					)}

					{/* User Dashboard Page Button */}
					{session?.user?.role === "USER" && (
						<Link
							href="/userDashboard"
							className={cn(
								"transition-colors hover:text-primary hover:border-primary border border-secondary rounded-full px-3 py-1",
								pathname?.startsWith("/userDashboard")
									? "text-primary"
									: "text-accent"
							)}
						>
							Dashboard
						</Link>
					)}
				</nav>

				{/* Theme toggle button and sign-in/logout button */}
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
