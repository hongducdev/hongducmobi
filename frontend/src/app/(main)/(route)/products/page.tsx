"use client";

import { Product } from "@/types/product";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch("/api/products/categories"),
                ]);
                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();
                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";

    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete("category");
        } else {
            params.set("category", value);
        }
        router.push(`/products?${params.toString()}`);
    };

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        router.push(`/products?${params.toString()}`);
    };

    let filteredProducts = products;

    if (category && category !== "all") {
        filteredProducts = filteredProducts.filter(
            (product) => product.category === category
        );
    }

    if (search) {
        filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                className="pl-10"
                                defaultValue={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <Select
                            value={category}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tất cả danh mục
                                </SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">
                            Không tìm thấy sản phẩm nào
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
