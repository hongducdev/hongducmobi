"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Order {
    _id: string;
    user: {
        name: string;
        email: string;
        phoneNumber: string;
    };
    items: {
        product: {
            name: string;
            price: number;
        };
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
}

const statusOptions = {
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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/orders/admin");
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await axios.patch(`/orders/${orderId}/status`, {
                status: newStatus,
            });
            fetchOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
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

    if (isLoading) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
            <div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã đơn hàng</TableHead>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Tổng tiền</TableHead>
                                <TableHead>Thanh toán</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày đặt</TableHead>
                                <TableHead>Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="font-medium">
                                        #{order._id.slice(-8)}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">
                                                {order.user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.user.email}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.user.phoneNumber}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {order.items.map((item, index) => (
                                                <p
                                                    key={index}
                                                    className="text-sm"
                                                >
                                                    {item.product.name} x{" "}
                                                    {item.quantity}
                                                </p>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(order.totalAmount)}
                                    </TableCell>
                                    <TableCell>
                                        {order.paymentMethod === "cod"
                                            ? "COD"
                                            : "VNPay"}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(value) =>
                                                handleStatusChange(
                                                    order._id,
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(statusOptions)
                                                    .filter(([value]) =>
                                                        getValidStatusOptions(
                                                            order.status
                                                        ).includes(value)
                                                    )
                                                    .map(
                                                        ([
                                                            value,
                                                            { label },
                                                        ]) => (
                                                            <SelectItem
                                                                key={value}
                                                                value={value}
                                                            >
                                                                {label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/admin/orders/${order._id}`}
                                        >
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Chi tiết
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
