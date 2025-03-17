"use client";

import { useUserStore } from "@/stores/useUserStore";
import { Search, Smartphone } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import UserHeader from "./user-header";
import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { debounce } from "lodash";

const Header = () => {
    const { user, checkAuth } = useUserStore();
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useOnClickOutside(searchRef, () => setShowSuggestions(false));

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(
                `/products?search=${encodeURIComponent(search.trim())}`
            );
            setShowSuggestions(false);
        }
    };

    const searchProducts = async (query: string) => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const res = await fetch(
                `/api/products?search=${encodeURIComponent(query)}`
            );
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            const filteredProducts = data
                .filter(
                    (product: Product) =>
                        product.name
                            .toLowerCase()
                            .includes(query.toLowerCase()) ||
                        product.category
                            .toLowerCase()
                            .includes(query.toLowerCase())
                )
                .sort((a: Product, b: Product) => {
                    const aNameMatch = a.name
                        .toLowerCase()
                        .includes(query.toLowerCase());
                    const bNameMatch = b.name
                        .toLowerCase()
                        .includes(query.toLowerCase());
                    if (aNameMatch && !bNameMatch) return -1;
                    if (!aNameMatch && bNameMatch) return 1;
                    return 0;
                })
                .slice(0, 5);

            setSuggestions(filteredProducts);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error searching products:", error);
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            searchProducts(query);
        }, 300),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    return (
        <div className="border-b bg-white sticky top-0 z-50">
            <div className="bg-blue-600 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 text-sm flex justify-between items-center">
                    <p>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</p>
                    <div className="flex items-center gap-4">
                        <span>Hotline: 0909090909</span>
                        <span>|</span>
                        <Link href="/tracking">Theo dõi đơn hàng</Link>
                    </div>
                </div>
            </div>

            <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
                <Link
                    href="/"
                    className="text-2xl font-bold flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                    <Smartphone className="text-blue-600" />
                    <span>Hồng Đức Mobi</span>
                </Link>

                {/* Search Bar */}
                <div
                    ref={searchRef}
                    className="relative hidden md:block flex-1 max-w-xl mx-8"
                >
                    <form onSubmit={handleSearch} className="flex items-center">
                        <div className="relative w-full group">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                                group-hover:text-blue-600 transition-colors"
                            />
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full pl-10 pr-4 border-2 focus:border-blue-600 transition-all"
                                value={search}
                                onChange={handleInputChange}
                                onFocus={() => {
                                    if (suggestions.length > 0) {
                                        setShowSuggestions(true);
                                    }
                                }}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="ml-2 bg-blue-600 hover:bg-blue-700"
                        >
                            Tìm kiếm
                        </Button>
                    </form>

                    {/* Suggestions Dropdown with improved styling */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div
                            className="absolute top-full left-0 right-0 mt-1 bg-white border 
                            rounded-md shadow-lg z-50 max-h-[400px] overflow-auto"
                        >
                            {suggestions.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/products/${product.slug}`}
                                    className="flex items-center gap-4 p-4 hover:bg-blue-50 transition-colors border-b last:border-b-0"
                                    onClick={() => setShowSuggestions(false)}
                                >
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 truncate">
                                            {product.name}
                                        </h4>
                                        <p className="text-blue-600 font-semibold">
                                            {formatCurrency(product.price)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    {user ? (
                        <UserHeader />
                    ) : (
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                className="hover:text-blue-600"
                            >
                                <Link href="/auth/login">Đăng nhập</Link>
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/auth/register">Đăng ký</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Header;
