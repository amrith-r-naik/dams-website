"use client";
import React from "react";
import { Button } from "./ui/button"; // Ensure the Button component exists
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// Component for rendering the 3D Dog Model
const DogModel = () => {
	const { scene } = useGLTF("/dog.glb"); // Ensure `dog.glb` is placed in the `public` folder
	return <primitive object={scene} scale={10} position={[0, -1.5, 0]} />;
};

const HeroSection = () => {
	const router = useRouter();

	return (
		<div className="w-full h-full px-32 flex justify-between items-center">
			{/* Text Section */}
			<div className="flex flex-col justify-center gap-4">
				<h1 className="text-5xl font-serif">Welcome to</h1>
				<h1 className="text-5xl font-extrabold">FurEver</h1>
				<div className="flex gap-0 flex-col">
					<p className="text-lg">
						Adopting one dog won&apos;t change the world,
					</p>
					<p className="text-lg">
						but for that one dog, the world will change forever.
					</p>
				</div>

				{/* Explore Button */}
				<Button className="w-fit" onClick={() => router.push("/dogs")}>
					Explore
					<ArrowRight />
				</Button>
			</div>

			{/* 3D Dog Picture Section */}
			<div className="w-1/2 h-[85vh]">
				<Canvas>
					<ambientLight intensity={0.5} />
					<directionalLight position={[2, 2, 5]} />
					<DogModel />
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
