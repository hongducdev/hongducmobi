"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import { Clock, CheckCircle2, Truck, XCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: {
        street: string;
        city: string;
        district: string;
        ward: string;
    };
    createdAt: string;
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

export default function OrderDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/orders/${params.id}`);
                setOrder(response.data);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [params.id]);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (!order) {
        return <div>Không tìm thấy đơn hàng</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <h2 className="font-semibold mb-2">Trạng thái đơn hàng</h2>
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

                <div className="mb-6">
                    <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                        {order.shippingAddress.ward},{" "}
                        {order.shippingAddress.district}
                    </p>
                    <p>{order.shippingAddress.city}</p>
                </div>

                <div>
                    <h2 className="font-semibold mb-2">Chi tiết sản phẩm</h2>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">
                                        Sản phẩm
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Giá
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Số lượng
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Tổng
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any) => (
                                    <tr key={item._id} className="border-t">
                                        <td className="px-4 py-2">
                                            {item.product.name}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {formatCurrency(item.price)}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {formatCurrency(
                                                item.price * item.quantity
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr className="border-t">
                                    <td
                                        colSpan={3}
                                        className="px-4 py-2 font-semibold"
                                    >
                                        Tổng tiền
                                    </td>
                                    <td className="px-4 py-2 text-right font-semibold">
                                        {formatCurrency(order.totalAmount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
