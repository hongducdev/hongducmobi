"use client";

import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { Eye, ShoppingCart, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { useUserStore } from "@/stores/useUserStore";

const ProductCard = ({ product }: { product: Product }) => {
    const { addItem } = useCartStore();
    const { user } = useUserStore();

    const isAdmin = user?.role === "ADMIN";

    return (
        <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            {product.createdAt &&
                new Date(product.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <Badge className="absolute top-2 left-2 z-10 bg-blue-500">
                        Mới
                    </Badge>
                )}
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Quick view overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        href={`/products/${product.slug}`}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
                {/* Category */}
                <p className="text-sm text-gray-500 capitalize">
                    {product.category}
                </p>

                {/* Product Name */}
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-500 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">5</span>
                    <span className="text-sm text-gray-400">
                        ({product.sold} đã bán)
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(product.price)}
                    </span>
                </div>

                {/* Add to Cart Button */}
                {!isAdmin && (
                    <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white 
                            transition-colors flex items-center justify-center gap-2"
                        onClick={() => addItem(product)}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm vào giỏ
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
