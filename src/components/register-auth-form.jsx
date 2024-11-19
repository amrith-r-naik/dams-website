"use client";

import * as React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// TODO : Implement staff side login

export function RegisterAuthForm({ className, ...props }) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	async function onSubmit(event) {
		event.preventDefault();
		setIsLoading(true);
		await signIn("google");
		setTimeout(() => {
			setIsLoading(false);
			router.push("/");
		}, 3000);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Button type="submit" variant="" disabled={isLoading}>
							{isLoading ? (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Icons.google className="mr-2 h-4 w-4" />
							)}{" "}
							Google
						</Button>
						{/* <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            /> */}
					</div>
				</div>
			</form>
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
			<Button variant="secondary" disabled={isLoading}>
				{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
				Register as Shelter
			</Button>
		</div>
	);
}
