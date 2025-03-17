import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface TestimonialProps {
    name: string;
    image: string;
    rating: number;
    comment: string;
    role?: string;
}

const Testimonial = ({
    name,
    image,
    rating,
    comment,
    role,
}: TestimonialProps) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Quote symbol */}
            <div className="mb-6">
                <svg
                    className="h-8 w-8 text-blue-500 opacity-30"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
            </div>

            {/* Comment */}
            <p className="text-gray-600 mb-6 line-clamp-4">{comment}</p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                        key={index}
                        className={`w-4 h-4 ${
                            index < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                        }`}
                    />
                ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-blue-100">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{name}</h4>
                    {role && <p className="text-sm text-gray-500">{role}</p>}
                </div>
            </div>
        </div>
    );
};

export default Testimonial;
