import Slider from "react-slick";
import React from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ imageArray, dog }) => {
	const settings = {
		dots: true,
		lazyLoad: true,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true, // Optional: Show navigation arrows
	};

	return (
		<div className="w-full">
			{imageArray && imageArray.length > 0 ? (
				<Slider {...settings}>
					{imageArray.map((url, index) => (
						<div key={index} className="relative h-[40vw] max-h-[500px] w-full">
							<Image
								src={url}
								alt={`${dog.name || "Dog"} image ${index + 1}`}
								fill
								sizes="(max-width: 500px) 100vw"
								className="object-cover rounded-xl"
							/>
						</div>
					))}
				</Slider>
			) : (
				<div className="relative h-[40vw] max-h-[500px] w-full bg-gray-200 flex items-center justify-center rounded-xl">
					<p className="text-gray-500">No images available</p>
				</div>
			)}
		</div>
	);
};

export default ImageSlider;
