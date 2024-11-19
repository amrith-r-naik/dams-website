import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { RegisterAuthForm } from "@/components/register-auth-form";
import { Icons } from "@/components/icons";
import { ArrowLeft } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RegisterPage() {
	const [isLoading, setIsLoading] = useState(false);
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
		<>
			<div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
				{session ? (
					<Link
						href="/"
						className={cn(
							buttonVariants({ variant: "outline" }),
							"absolute right-4 top-4 md:right-8 md:top-8 md:py-1"
						)}
					>
						<ArrowLeft />
						Home
					</Link>
				) : (
					<Link
						href="/login"
						className={cn(
							buttonVariants({ variant: "ghost" }),
							"absolute right-4 top-4 md:right-8 md:top-8"
						)}
					>
						Login
					</Link>
				)}
				<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
					{/* TODO (Trisha) : Add image over here */}
					<div className="absolute inset-0 bg-secondary text-secondary-foreground z-10" />
					<Link
						href={"/"}
						className="relative z-20 flex items-center text-lg font-medium"
					>
						<Icons.logo className="h-12 w-12" />
						<span className="hidden font-bold lg:inline-block text-xl">
							FurEver
						</span>
					</Link>
					<Icons.logo className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-10 z-0 w-full h-[80%]" />
					<div className="relative z-20 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-lg">
								Adopting one dog won&apos;t change the world, but for that one
								dog, the world will change forever.
							</p>
							<footer className="text-sm">Sofia Davis</footer>
						</blockquote>
					</div>
				</div>
				{session ? (
					// TODO (Amrith) : Stylize this
					<div className="w-full flex flex-col gap-2 justify-center items-center">
						<h1 className="font-foreground font-semibold">
							You are logged in as {session.user.name}
						</h1>
						<Button
							variant="destructive"
							className="w-fit"
							onClick={handleLogout}
						>
							Logout
						</Button>
					</div>
				) : (
					<div className="lg:p-8">
						<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
							<div className="flex flex-col space-y-2 text-center">
								<h1 className="text-2xl font-semibold tracking-tight">
									Create an account
								</h1>
								<p className="text-sm text-muted-foreground">
									Register using your google account
								</p>
							</div>
							<RegisterAuthForm />
							<p className="px-8 text-center text-sm text-muted-foreground">
								By registering, you agree to our{" "}
								<Link
									href="/terms"
									className="underline underline-offset-4 hover:text-primary"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href="/privacy"
									className="underline underline-offset-4 hover:text-primary"
								>
									Privacy Policy
								</Link>
								.
							</p>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
