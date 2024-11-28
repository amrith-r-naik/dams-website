"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button"; // Ensure the Button component exists
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
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
		<div className="w-full h-full px-32 flex justify-between items-center">
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
						minPolarAngle={Math.PI / 2} // Restrict vertical rotation
						maxPolarAngle={Math.PI / 2} // Restrict vertical rotation
					/>
				</Canvas>
			</div>
		</div>
	);
};

export default HeroSection;
