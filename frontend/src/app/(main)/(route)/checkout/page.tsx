"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

export default function CheckoutPage() {
    const { items, total, discount, applyDiscount } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [promoCode, setPromoCode] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    useEffect(() => {
        if (items.length === 0) {
            router.push("/cart");
        }
    }, [items, router]);

    const handleCheckout = async () => {
        try {
            setIsLoading(true);

            // Tính tổng tiền sau giảm giá
            const finalAmount = total - discount;

            // Format dữ liệu theo yêu cầu của VNPay
            const orderData = {
                amount: Math.round(finalAmount), // VNPay yêu cầu số nguyên
                orderDescription: `Thanh toan don hang ${new Date().getTime()}`,
                orderType: "billpayment",
                language: "vn",
                items: items.map((item) => ({
                    productId: item.product._id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                discount,
                paymentMethod,
            };

            const response = await axios.post(
                "/payment/create_payment_url",
                orderData
            );

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description:
                    error.response?.data?.message || "Không thể tạo đơn hàng",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyPromoCode = async () => {
        if (!promoCode) return;

        setIsApplying(true);
        try {
            const response = await axios.post("/coupons/validate", {
                code: promoCode,
            });

            const { discountPercentage } = response.data;
            const discountAmount = (total * discountPercentage) / 100;
            applyDiscount(discountAmount);

            toast({
                title: "Thành công",
                description: `Đã áp dụng mã giảm giá ${discountPercentage}%`,
            });
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description:
                    error.response?.data?.message || "Mã giảm giá không hợp lệ",
                variant: "destructive",
            });
        } finally {
            setIsApplying(false);
        }
    };

    const handleCodCheckout = () => {
        // Xử lý đơn hàng COD
        console.log("Xử lý đơn hàng COD");
    };

    const finalTotal = total - discount;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Đơn hàng của bạn
                    </h2>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.product._id}
                                className="flex items-center space-x-4 border-b pb-4"
                            >
                                <div className="relative w-20 h-20">
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Số lượng: {item.quantity}
                                    </p>
                                    <p className="font-medium">
                                        {(
                                            item.product.price * item.quantity
                                        ).toLocaleString()}
                                        đ
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span>Tạm tính:</span>
                            <span>{total.toLocaleString()}đ</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between items-center text-green-600">
                                <span>Giảm giá:</span>
                                <span>-{discount.toLocaleString()}đ</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>Tổng cộng:</span>
                            <span>{finalTotal.toLocaleString()}đ</span>
                        </div>
                    </div>
                </div>

                {/* Phương thức thanh toán */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Phương thức thanh toán
                    </h2>
                    <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                            <RadioGroup
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                                className="space-y-3"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <Label
                                        htmlFor="cod"
                                        className="font-medium"
                                    >
                                        Thanh toán khi nhận hàng (COD)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="vnpay" id="vnpay" />
                                    <Label
                                        htmlFor="vnpay"
                                        className="font-medium"
                                    >
                                        Thanh toán qua VNPay
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {paymentMethod === "vnpay" && (
                            <p className="text-sm text-gray-500">
                                Thanh toán an toàn với VNPay - Hỗ trợ nhiều ngân
                                hàng và ví điện tử
                            </p>
                        )}
                    </div>

                    <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Mã giảm giá</h3>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nhập mã giảm giá"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <Button
                                onClick={handleApplyPromoCode}
                                disabled={isApplying || !promoCode}
                            >
                                {isApplying ? "Đang áp dụng..." : "Áp dụng"}
                            </Button>
                        </div>
                    </div>

                    <Button
                        onClick={
                            paymentMethod === "vnpay"
                                ? handleCheckout
                                : handleCodCheckout
                        }
                        disabled={isLoading}
                        className="w-full mt-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý
                            </>
                        ) : paymentMethod === "vnpay" ? (
                            "Tiến hành thanh toán"
                        ) : (
                            "Đặt hàng"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
