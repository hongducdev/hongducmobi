"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { Coupon } from "@/types/coupon";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import axios from "@/lib/axios";
import DeleteConfirm from "@/components/delete-confirm";
import { useToast } from "@/hooks/use-toast";

interface DataTableProps {
    data: Coupon[];
}

export function DataTable({ data }: DataTableProps) {
    const [coupons, setCoupons] = useState<Coupon[]>(data);
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/coupons/${id}`);
            setCoupons(coupons.filter((coupon) => coupon._id !== id));
            toast({
                title: "Xóa mã giảm giá thành công",
            });
        } catch (error) {
            console.error("Error deleting coupon:", error);
            toast({
                title: "Có lỗi xảy ra khi xóa mã giảm giá",
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Link href="/admin/coupons/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm mã giảm giá
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã</TableHead>
                            <TableHead>Giảm giá</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Đã dùng</TableHead>
                            <TableHead>Hết hạn</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coupons.map((coupon) => (
                            <TableRow key={coupon._id}>
                                <TableCell className="font-medium">
                                    {coupon.code}
                                </TableCell>
                                <TableCell>
                                    {coupon.discountType === "percent"
                                        ? `${coupon.discount}%`
                                        : formatCurrency(coupon.discount)}
                                </TableCell>
                                <TableCell>{coupon.quantity}</TableCell>
                                <TableCell>{coupon.used}</TableCell>
                                <TableCell>
                                    {formatDate(coupon.expiryDate)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${
                                                new Date(coupon.expiryDate) >
                                                new Date()
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {new Date(coupon.expiryDate) >
                                            new Date()
                                                ? "Còn hạn"
                                                : "Hết hạn"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/coupons/${coupon._id}`}
                                        >
                                            <Button
                                                variant="outline"
                                                size="icon"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <DeleteConfirm
                                            onDelete={() => handleDelete(coupon._id)}
                                            title="Xóa mã giảm giá?"
                                            description={`Bạn chắc chắn muốn xóa mã giảm giá "${coupon.code}"? Hành động này không thể hoàn tác.`}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 