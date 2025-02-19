"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Order {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: Array<{
        product: {
            name: string;
            price: number;
        };
        quantity: number;
    }>;
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <p>Chưa có đơn hàng nào</p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="border rounded-lg p-4 space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <Link
                                    href={`/account/orders/${order._id}`}
                                    className="font-medium hover:text-blue-600"
                                >
                                    Đơn hàng #{order.orderNumber}
                                </Link>
                                <Badge>{order.status}</Badge>
                            </div>
                            <p className="text-gray-600">
                                Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="font-medium">
                                Tổng tiền: {formatCurrency(order.totalAmount)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrdersPage; 