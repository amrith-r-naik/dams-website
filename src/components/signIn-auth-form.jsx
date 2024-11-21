"use client";

import * as React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// TODO (Pranav) : Implement authentication

export function SignInAuthForm({ className, ...props }) {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	async function handleUserSignIn(event) {
		event.preventDefault();
		setIsLoading(true);
		await signIn("google", { callbackUrl: "/" });
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}

	async function handleShelterSignIn(event) {
		event.preventDefault();
		setIsLoading(true);
		await signIn("google", { callbackUrl: "/createShelter" });
		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}

	return (
		<div className={cn("grid gap-6 z-10", className)} {...props}>
			<div className="grid gap-1">
				<Button onClick={handleUserSignIn} variant="" disabled={isLoading}>
					{isLoading ? (
						<Icons.spinner className="h-4 w-4 animate-spin" />
					) : (
						<Icons.google className="h-4 w-4" />
					)}{" "}
					Google
				</Button>
			</div>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Do you own a Shelter?
					</span>
				</div>
			</div>
			<Button
				onClick={handleShelterSignIn}
				variant="secondary"
				disabled={isLoading}
			>
				{isLoading ? (
					<Icons.spinner className="h-4 w-4 animate-spin" />
				) : (
					<Icons.google className=" h-4 w-4" />
				)}{" "}
				SignIn as Shelter
			</Button>
		</div>
	);
}
