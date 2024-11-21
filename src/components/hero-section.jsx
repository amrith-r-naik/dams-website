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
  return <primitive object={scene} scale={8} />;
};

const HeroSection = () => {
	const router = useRouter();

	return (
		<div className="w-full h-screen pt-28 p-32 flex justify-between">
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

				<Button className="w-fit" onClick={() => router.push("/dogs")}>
					Explore
					<ArrowRight />
				</Button>
			</div>
			{/* 3D Dog picture */}
			<div className="w-1/2 h-[80%] absolute right-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 5]} />
          <DogModel />
          <OrbitControls enableZoom={false}/>
        </Canvas>
      </div>
		</div>
	);
};

export default HeroSection;