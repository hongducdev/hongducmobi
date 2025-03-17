"use client";

import { useEffect, useState, useCallback } from "react";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const statusMap = {
    pending: { label: "Chờ xử lý", color: "bg-yellow-500" },
    paid: { label: "Đã thanh toán", color: "bg-green-500" },
    delivered: { label: "Đã giao hàng", color: "bg-blue-500" },
    cancelled: { label: "Đã hủy", color: "bg-red-500" },
    delivering: { label: "Đang giao hàng", color: "bg-purple-500" },
};

const validStatusTransitions = {
    pending: ["paid", "cancelled"],
    paid: ["delivering", "cancelled"],
    delivering: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
};

export default function OrderDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        try {
            const response = await axios.get(`/orders/admin/${params.id}`);
            setOrder(response.data);
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

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

    const getValidStatusOptions = (currentStatus: string) => {
        const validOptions = [currentStatus];

        if (
            validStatusTransitions[
                currentStatus as keyof typeof validStatusTransitions
            ]
        ) {
            validOptions.push(
                ...validStatusTransitions[
                    currentStatus as keyof typeof validStatusTransitions
                ]
            );
        }

        return validOptions;
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
                        <h2 className="font-semibold mb-2">
                            Thông tin khách hàng
                        </h2>
                        <p>Tên: {order.user.name}</p>
                        <p>Email: {order.user.email}</p>
                        <p>SĐT: {order.user.phoneNumber || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2">
                            Địa chỉ giao hàng
                        </h2>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                            {order.shippingAddress.ward},{" "}
                            {order.shippingAddress.district}
                        </p>
                        <p>{order.shippingAddress.city}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="font-semibold mb-2">Trạng thái đơn hàng</h2>
                    <div className="flex items-center gap-2">
                        <Select
                            defaultValue={order.status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(statusMap)
                                    .filter(([value]) =>
                                        getValidStatusOptions(
                                            order.status
                                        ).includes(value)
                                    )
                                    .map(([value, { label }]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        <Badge
                            className={
                                statusMap[
                                    order.status as keyof typeof statusMap
                                ]?.color
                            }
                        >
                            {
                                statusMap[
                                    order.status as keyof typeof statusMap
                                ]?.label
                            }
                        </Badge>
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold mb-2">Chi tiết sản phẩm</h2>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead className="text-right">
                                        Giá
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Số lượng
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Tổng
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item: any) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            {item.product.name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(item.price)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(
                                                item.price * item.quantity
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="font-semibold"
                                    >
                                        Tổng tiền
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(order.totalAmount)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
