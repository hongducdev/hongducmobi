"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusMap = {
    pending: { label: "Chờ xử lý", color: "bg-yellow-500" },
    paid: { label: "Đã thanh toán", color: "bg-green-500" },
    delivered: { label: "Đã giao hàng", color: "bg-blue-500" },
    cancelled: { label: "Đã hủy", color: "bg-red-500" },
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<any>(null);
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
                    <Badge className={statusMap[order.status].color}>
                        {statusMap[order.status].label}
                    </Badge>
                </div>

                <div className="mb-6">
                    <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                        {order.shippingAddress.ward}, {order.shippingAddress.district}
                    </p>
                    <p>{order.shippingAddress.city}</p>
                </div>

                <div>
                    <h2 className="font-semibold mb-2">Chi tiết sản phẩm</h2>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Sản phẩm</th>
                                    <th className="px-4 py-2 text-right">Giá</th>
                                    <th className="px-4 py-2 text-right">Số lượng</th>
                                    <th className="px-4 py-2 text-right">Tổng</th>
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
                                            {formatCurrency(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr className="border-t">
                                    <td colSpan={3} className="px-4 py-2 font-semibold">
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