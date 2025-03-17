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
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import axios from "@/lib/axios";
import DeleteConfirm from "@/components/delete-confirm";
import { useToast } from "@/hooks/use-toast";
import { Coupon } from "@/types/coupon";

const CouponTable = ({ data }: { data: Coupon[] }) => {
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/coupons/${id}`);
            toast({
                title: "Xóa mã giảm giá thành công",
            });
            router.refresh();
        } catch (error) {
            console.error("Error deleting coupon:", error);
            toast({
                title: "Có lỗi xảy ra khi xóa mã giảm giá",
            });
        }
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
                    <TableHead className="text-right">Thao tác</TableHead>
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
                                {coupon.startDate ? format(
                                    new Date(coupon.startDate),
                                    "dd/MM/yyyy"
                                ) : "N/A"}
                            </TableCell>
                            <TableCell>
                                {coupon.expirationDate ? format(
                                    new Date(coupon.expirationDate),
                                    "dd/MM/yyyy"
                                ) : "N/A"}
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
                            <TableCell className="space-x-2 text-right">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        router.push(
                                            `/admin/coupons/${coupon._id}`
                                        )
                                    }
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <DeleteConfirm
                                    onDelete={() => handleDelete(coupon._id)}
                                    title="Xóa mã giảm giá?"
                                    description={`Bạn chắc chắn muốn xóa mã giảm giá "${coupon.code}"? Hành động này không thể hoàn tác.`}
                                />
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
