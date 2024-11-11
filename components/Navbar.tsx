import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth"; // Import Session type
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
	// Explicitly type session
	const session: Session | null = await getServerSession(authOptions);
	return (
		<div className=" bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
			<div className="container flex items-center justify-between">
				<Link href="/">
					<Button variant={"link"}>Home</Button>
				</Link>
				{session?.user ? (
					<UserAccountNav />
				) : (
					<Link
						className={buttonVariants()}
						href="/sign-in">
						Sign in
					</Link>
				)}
			</div>
		</div>
	);
};

export default Navbar;
