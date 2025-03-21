"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";
import { Clock, CheckCircle2, Truck, XCircle, Package } from "lucide-react";
import React from "react";

interface OrderItem {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
    };
    quantity: number;
    price: number;
}

type OrderStatus =
    | "pending"
    | "paid"
    | "delivered"
    | "cancelled"
    | "delivering";

const statusMap: Record<
    OrderStatus,
    { label: string; color: string; icon: any }
> = {
    pending: {
        label: "Chờ xử lý",
        color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        icon: Clock,
    },
    paid: {
        label: "Đã thanh toán",
        color: "bg-green-100 text-green-800 hover:bg-green-200",
        icon: CheckCircle2,
    },
    delivered: {
        label: "Đã giao hàng",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        icon: Package,
    },
    cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800 hover:bg-red-200",
        icon: XCircle,
    },
    delivering: {
        label: "Đang giao hàng",
        color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        icon: Truck,
    },
};

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
    shippingAddress: {
        street: string;
        city: string;
        district: string;
        ward: string;
    };
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("/orders");
                setOrders(response.data);
            } catch (error: any) {
                console.error("Error fetching orders:", error);
                if (isAxiosError(error)) {
                    console.error("Error response:", error.response?.data);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                <Link
                    href="/products"
                    className="text-primary hover:underline mt-2 inline-block"
                >
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold">
                                    Đơn hàng #{order._id.slice(-8)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <Badge
                                className={
                                    statusMap[
                                        (order.status as OrderStatus) in
                                        statusMap
                                            ? (order.status as OrderStatus)
                                            : "pending"
                                    ].color
                                }
                            >
                                {React.createElement(
                                    statusMap[
                                        (order.status as OrderStatus) in
                                        statusMap
                                            ? (order.status as OrderStatus)
                                            : "pending"
                                    ].icon,
                                    { className: "w-4 h-4 mr-2" }
                                )}
                                {
                                    statusMap[
                                        (order.status as OrderStatus) in
                                        statusMap
                                            ? (order.status as OrderStatus)
                                            : "pending"
                                    ].label
                                }
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div
                                    key={item.product._id}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            width={64}
                                            height={64}
                                            className="object-cover rounded"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatCurrency(item.price)} x{" "}
                                                {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-medium">
                                        {formatCurrency(
                                            item.price * item.quantity
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div>
                                <p className="text-gray-500">Tổng tiền</p>
                                <p className="text-xl font-bold">
                                    {formatCurrency(order.totalAmount)}
                                </p>
                            </div>
                            <Link href={`/account/orders/${order._id}`}>
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem chi tiết
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
