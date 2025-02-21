"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import axios from "@/lib/axios";
interface Coupon {
    _id: string;
    code: string;
    discountPercentage: number;
    maxUses: number;
    currentUses: number;
    startDate: Date;
    expirationDate: Date;
    isActive: boolean;
}

const CouponTable = ({ data }: { data: Coupon[] }) => {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        const response = await axios.delete(`/coupons/${id}`);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Mã giảm giá</TableHead>
                    <TableHead>Giảm giá (%)</TableHead>
                    <TableHead>Lượt sử dụng</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data && data.length > 0 ? (
                    data.map((coupon, index) => (
                        <TableRow key={coupon._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">
                                {coupon.code}
                            </TableCell>
                            <TableCell>{coupon.discountPercentage}%</TableCell>
                            <TableCell>
                                {coupon.currentUses}/{coupon.maxUses}
                            </TableCell>
                            <TableCell>
                                {format(
                                    new Date(coupon.startDate),
                                    "dd/MM/yyyy"
                                )}
                            </TableCell>
                            <TableCell>
                                {format(
                                    new Date(coupon.expirationDate),
                                    "dd/MM/yyyy"
                                )}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        coupon.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {coupon.isActive
                                        ? "Đang hoạt động"
                                        : "Hết hạn"}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="mr-2"
                                    onClick={() =>
                                        router.push(
                                            `/admin/coupons/${coupon._id}`
                                        )
                                    }
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(coupon._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            Không có dữ liệu
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default CouponTable;
