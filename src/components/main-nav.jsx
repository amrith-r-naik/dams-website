"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function MainNav({ className }) {
	const pathname = usePathname();

	return (
		<div className={`${className} mr-4 hidden md:flex justify-between`}>
			<Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
				<Icons.logo className="h-12 w-12" />
				<span className="hidden font-bold lg:inline-block">FurEver</span>
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
					href="/docs/components"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/docs/components") &&
							!pathname?.startsWith("/docs/component/chart")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Components
				</Link>

				<Link
					href="/blocks"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/blocks")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Blocks
				</Link>

				<Link
					href="/myshelter"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/myshelter")
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					My Shelter
				</Link>
			</nav>

			{/* Theme toggle button and login button */}
			<div className="flex gap-2 justify-center">
				<ThemeToggle />
				<Link href="/login">
					<Button>Login</Button>
				</Link>
			</div>
		</div>
	);
}
