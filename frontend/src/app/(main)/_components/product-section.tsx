"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Product } from "@/types/product";
import ProductCard from "@/components/product-card";

const ProductSection = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await axios.get("/products");
            setProducts(response.data);
        };
        fetchProducts();
    }, []);

    return (
        <div>
            {products && products.length > 0 ? (
                <Carousel>
                    <CarouselContent>
                        {products.map((product) => (
                            <CarouselItem key={product._id} className="basis-1/4 h-fit">
                                <ProductCard product={product} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            ) : (
                <div className="text-center text-2xl font-bold">
                    Không có sản phẩm
                </div>
            )}
        </div>
    );
};

export default ProductSection;
