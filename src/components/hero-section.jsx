"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DogModel from "./dog-model";

// Variants for Framer Motion animations
const textVariant = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const buttonVariant = {
	initial: { opacity: 0, scale: 0.9 },
	animate: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 1 } },
};

const modelVariant = {
	initial: { opacity: 0, scale: 0.8 },
	animate: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.5 } },
};

const HeroSection = () => {
	const router = useRouter();

	return (
		<div className="w-full h-full flex flex-col overflow-y-auto">
			{/* Hero Section */}
			<section
				id="hero"
				className="w-full h-screen px-32 flex justify-between items-center"
			>
				{/* Text Section */}
				<div className="flex flex-col justify-center gap-4">
					<motion.h1
						className="text-5xl font-serif"
						variants={textVariant}
						initial="initial"
						animate="animate"
					>
						Welcome to
					</motion.h1>
					<motion.h1
						className="text-5xl font-extrabold"
						variants={textVariant}
						initial="initial"
						animate="animate"
						transition={{ delay: 0.3 }}
					>
						FurEver
					</motion.h1>
					<div className="flex gap-0 flex-col">
						<motion.p
							className="text-lg"
							variants={textVariant}
							initial="initial"
							animate="animate"
							transition={{ delay: 0.6 }}
						>
							Adopting one dog won&apos;t change the world,
						</motion.p>
						<motion.p
							className="text-lg"
							variants={textVariant}
							initial="initial"
							animate="animate"
							transition={{ delay: 0.9 }}
						>
							but for that one dog, the world will change forever.
						</motion.p>
					</div>

					{/* Explore Button */}
					<motion.div
						variants={buttonVariant}
						initial="initial"
						animate="animate"
					>
						<Button className="w-fit" onClick={() => router.push("/dogs")}>
							Explore
							<ArrowRight />
						</Button>
					</motion.div>
				</div>

				{/* 3D Dog Picture Section */}
				<div className="w-1/2 h-[85vh]">
					<Canvas>
						<ambientLight intensity={0.5} />
						<directionalLight position={[2, 2, 5]} />
						<motion.group
							variants={modelVariant}
							initial="initial"
							animate="animate"
						>
							<DogModel />
						</motion.group>
						<OrbitControls
							enableZoom={false}
							minPolarAngle={Math.PI / 2}
							maxPolarAngle={Math.PI / 2}
						/>
					</Canvas>
				</div>
			</section>

			{/* About Us Section */}
			<section
				id="about"
				className="w-full h-screen px-32 py-20 flex flex-col items-center justify-center text-center bg-gradient-to-br"
			>
				<h2
					className="text-5xl font-extrabold mb-6"
					style={{ color: "#D4A373" }}
				>
					About Us
				</h2>
				<p className="text-lg max-w-3xl leading-relaxed">
					At <span className="font-semibold">FurEver</span>, we’re on a mission
					to transform the lives of dogs and their future owners. Partnering
					with shelters and adoption agencies, we connect furry friends with
					loving homes. Every adoption makes a lasting difference.
				</p>
				
			</section>

			{/* Contact Us Section */}
			<section
				id="contact"
				className="w-full h-screen px-32 py-20 flex flex-col items-center justify-center text-center"
			>
				<h2 className="text-5xl font-extrabold mb-6" style={{ color: "#D4A373" }}>
					Contact Us
				</h2>
				<p className="text-lg max-w-3xl mb-8 leading-relaxed">
					Have questions or want to join our mission? Feel free to get in
					touch. We’d love to hear from you and guide you toward the right
					adoption choice.
				</p>
				<div className="p-6 rounded-lg shadow-2xl max-w-lg w-full space-y-4">
					<p>
						<strong>Email:</strong>{" "}
						<a
							href="mailto:support@furever.com"
							className="hover:underline"
							style={{ color: "#D4A373" }}
						>
							support@furever.com
						</a>
					</p>
					<p>
						<strong>Phone:</strong>{" "}
						<a
							href="tel:+11234567890"
							className="hover:underline"
							style={{ color: "#D4A373" }}
						>
							+1 (123) 456-7890
						</a>
					</p>
					<p>
						<strong>Address:</strong> 123 Doggo Street, Petville, PA
					</p>
				</div>
			</section>
		</div>
	);
};

export default HeroSection;
