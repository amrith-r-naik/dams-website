import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
			{/* The footprint image goes here */}
			<div className="w-1/2 h-[80%] absolute right-0">
				<Image
					src="/dog_foot_print.png"
					alt="footprint"
					fill
					objectFit="contain"
					className=""
				/>
			</div>
		</div>
	);
};

export default HeroSection;
