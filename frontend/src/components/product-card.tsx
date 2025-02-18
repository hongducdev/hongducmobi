"use client";

import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
    const { addItem } = useCartStore();

    return (
        <div>
            <div className="relative p-4 rounded-lg overflow-hidden border border-gray-200 ">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={300}
                    height={100}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="my-4">
                <Link
                    href={`/products/${product.slug}`}
                    className="hover:text-blue-500 duration-300 ease-in-out transitionn-all"
                >
                    <h3 className="text-lg font-bold">{product.name}</h3>
                </Link>
                <span className="text-sm text-gray-500">
                    {formatCurrency(product.price)}
                </span>
                <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full mt-4"
                    onClick={() => addItem(product)}
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Thêm vào giỏ hàng
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
