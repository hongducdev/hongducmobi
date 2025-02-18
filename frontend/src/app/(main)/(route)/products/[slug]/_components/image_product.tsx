"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ImageProduct = ({ images }: { images: string[] }) => {
    const [mainImage, setMainImage] = useState(images[0]);
    const [emblaRef] = useEmblaCarousel({
        dragFree: true,
        containScroll: "keepSnaps",
    });

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-[600px] h-[400px] rounded-lg overflow-hidden border">
                <Image
                    src={mainImage}
                    alt="Main product image"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setMainImage(image)}
                            className={cn(
                                "relative flex-none w-[144px] h-24 aspect-3/2 rounded-lg overflow-hidden border",
                                mainImage === image && "border border-blue-500"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageProduct;
