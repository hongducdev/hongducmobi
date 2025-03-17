"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart, CreditCard } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

interface ChangeNumberProps {
    product: Product;
}

const ChangeNumber = ({ product }: ChangeNumberProps) => {
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();
    const router = useRouter();
    const { user } = useUserStore();

    const isAdmin = user?.role === "ADMIN";

    const incrementQuantity = () => {
        if (quantity < product.quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= product.quantity) {
            setQuantity(value);
        }
    };

    const handleAddToCart = async () => {
        for (let i = 0; i < quantity; i++) {
            await addItem(product);
        }
    };

    const handleBuyNow = async () => {
        await addItem(product);
        router.push("/checkout");
    };

    if (isAdmin) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <Input
                    type="number"
                    min={1}
                    max={product.quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 text-center"
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.quantity}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={handleAddToCart}
                    className="flex-1"
                    variant="outline"
                    disabled={product.quantity === 0}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                </Button>
                <Button
                    onClick={handleBuyNow}
                    className="flex-1"
                    disabled={product.quantity === 0}
                >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Mua ngay
                </Button>
            </div>
        </div>
    );
};

export default ChangeNumber;
