import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface TestimonialProps {
    name: string;
    image: string;
    rating: number;
    comment: string;
}

const Testimonial = ({ name, image, rating, comment }: TestimonialProps) => {
    return (
        <div className="pt-8 p-4 border rounded-lg">
            <div className="flex items-center gap-1">
                {Array.from({ length: rating }).map((_, index) => (
                    <Star key={index} className="text-yellow-500" size={20} />
                ))}
            </div>
            <p className="text-sm text-gray-500 mt-2 mb-4">{comment}</p>
            <div className="flex items-center gap-2">
                <Image src={image} alt={name} width={50} height={50} />
                <p className="text-sm font-bold">{name}</p>
            </div>
        </div>
    );
};

export default Testimonial;
