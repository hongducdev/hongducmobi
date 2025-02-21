"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

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
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`/orders/admin/${params.id}`);
            setOrder(response.data);
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (status: string) => {
        try {
            await axios.patch(`/orders/${params.id}/status`, { status });
            toast({
                title: "Thành công",
                description: "Cập nhật trạng thái đơn hàng thành công",
            });
            fetchOrder();
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Cập nhật trạng thái đơn hàng thất bại",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (!order) {
        return <div>Không tìm thấy đơn hàng</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h1>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h2 className="font-semibold mb-2">Thông tin khách hàng</h2>
                        <p>Tên: {order.user.name}</p>
                        <p>Email: {order.user.email}</p>
                        <p>SĐT: {order.user.phoneNumber || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                            {order.shippingAddress.ward}, {order.shippingAddress.district}
                        </p>
                        <p>{order.shippingAddress.city}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="font-semibold mb-2">Trạng thái đơn hàng</h2>
                    <Select
                        defaultValue={order.status}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(statusMap).map(([value, { label }]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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