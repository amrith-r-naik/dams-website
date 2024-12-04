import React from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Separator } from "./ui/separator";
import Link from "next/link";

const Footer = () => {
	return (
		<footer className="w-full py-8">

			<Separator/>
			
			<div className="flex flex-col md:flex-row justify-between items-center gap-8 px-32 py-10">
				{/* Logo and tagline */}
			
				<div>
					<h3 className="text-2xl font-bold">FurEver</h3>
					<p className="text-sm mt-2">
						Making a difference, one adoption at a time.
					</p>
				</div>

				{/* Navigation links */}
				<div className="flex flex-col md:flex-row gap-4 text-center md:text-left">
					<Link href="#hero" className="hover:text-primary">
						Home
					</Link>
					<Link href="#about" className="hover:text-primary">
						About Us
					</Link>
					<Link href="#adoption-process" className="hover:text-primary">
						Adoption Process
					</Link>
					<Link href="#contact" className="hover:text-primary">
						Contact
					</Link>
				</div>

				{/* Social Media Links */}
				<div className="flex gap-4">
					<Link
						href="https://facebook.com"
						target="_blank"
						className="hover:text-primary "
					>
						<Facebook />
					</Link>
					<Link
						href="https://twitter.com"
						target="_blank"
						className="hover:text-primary"
					>
						<Twitter />
					</Link>
					<Link
						href="https://instagram.com"
						target="_blank"
						className="hover:text-primary"
					>
						<Instagram />
					</Link>
					<Link
						href="https://linkedin.com"
						target="_blank"
						className="hover:text-primary"
					>
						<Linkedin />
					</Link>
				</div>
			</div>

			{/* Footer Bottom */}
			
			<div className="mx-32 text-center text-sm">
			<Separator/>
				<p className="pt-4">&copy; {new Date().getFullYear()} FurEver. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
