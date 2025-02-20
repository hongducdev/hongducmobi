"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

const CartPage = () => {
    const router = useRouter();
    const { items, isLoading, fetchCartItems, updateQuantity, removeItem } =
        useCartStore();

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const totalPrice = items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    if (isLoading) {
        return <Loading />;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-semibold mb-4">Giỏ hàng trống</h2>
                <p className="text-gray-500">Hãy thêm sản phẩm vào giỏ hàng</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {items.map((item) => (
                        <div
                            key={item.product._id}
                            className="flex items-center gap-4 p-4 border rounded-lg mb-4"
                        >
                            <div className="relative w-24 h-24">
                                <Image
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">
                                    {item.product.name}
                                </h3>
                                <p className="text-gray-600">
                                    {formatCurrency(item.product.price)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        updateQuantity(
                                            item.product._id,
                                            Math.max(1, item.quantity - 1)
                                        )
                                    }
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">
                                    {item.quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        updateQuantity(
                                            item.product._id,
                                            item.quantity + 1
                                        )
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeItem(item.product._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <div className="border rounded-lg p-4">
                        <h2 className="text-xl font-semibold mb-4">
                            Tổng đơn hàng
                        </h2>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Tạm tính:</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Giảm giá:</span>
                                <span>0đ</span>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between font-semibold">
                                <span>Tổng cộng:</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>
                        <Button
                            className="w-full mt-4"
                            onClick={() => router.push("/checkout")}
                        >
                            Tiến hành thanh toán
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
