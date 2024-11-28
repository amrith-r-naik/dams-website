import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const DogModel = () => {
	const { scene } = useGLTF("/dog.glb"); // Ensure `dog.glb` is placed in the `public` folder
	const dogRef = useRef(); // Ref to control the dog model's rotation

	// Rotate the model slightly
	useFrame((state) => {
		if (dogRef.current) {
			dogRef.current.rotation.y += 0.005; // Adjust rotation speed here
		}
	});

	return (
		<primitive ref={dogRef} object={scene} scale={10} position={[0, -1.5, 0]} />
	);
};

export default DogModel;
