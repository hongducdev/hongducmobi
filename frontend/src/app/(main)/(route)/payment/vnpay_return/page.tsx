"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";

export default function VNPayReturn() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"success" | "failed" | "loading">("loading");
    const { removeAll } = useCartStore();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries());
                
                const response = await axios.get("/payment/vnpay_return", {
                    params
                });

                if (response.data.code === "00") {
                    setStatus("success");
                    removeAll();
                } else {
                    setStatus("failed");
                }
            } catch (error) {
                console.error("Error verifying payment:", error);
                setStatus("failed");
            }
        };

        verifyPayment();
    }, [searchParams, removeAll]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                {status === "loading" ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-lg">Đang xử lý thanh toán...</p>
                    </div>
                ) : status === "success" ? (
                    <div className="text-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                        <h2 className="mt-4 text-2xl font-bold text-green-500">
                            Thanh toán thành công!
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất.
                        </p>
                        <div className="mt-6 space-y-3">
                            <Button
                                className="w-full"
                                onClick={() => router.push("/account/orders")}
                            >
                                Xem đơn hàng
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push("/")}
                            >
                                Tiếp tục mua sắm
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                        <h2 className="mt-4 text-2xl font-bold text-red-500">
                            Thanh toán thất bại!
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.
                        </p>
                        <div className="mt-6 space-y-3">
                            <Button
                                className="w-full"
                                onClick={() => router.push("/checkout")}
                            >
                                Thử lại
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push("/")}
                            >
                                Về trang chủ
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 