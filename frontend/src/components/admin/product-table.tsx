import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Pencil, Plus } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useRouter } from "next/navigation";
import DeleteConfirm from "@/components/delete-confirm";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import Link from "next/link";

const ProductTable = ({ data }: { data: any[] }) => {
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/products/${id}`);
            toast({
                title: "Xóa sản phẩm thành công",
                variant: "default",
            });
            router.refresh();
        } catch (error) {
            console.error("Error deleting product:", error);
            toast({
                title: "Có lỗi xảy ra",
                description: "Không thể xóa sản phẩm. Vui lòng thử lại sau.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm sản phẩm
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>STT</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead className="max-w-[400px]">
                                Mô tả
                            </TableHead>
                            <TableHead className="text-right">
                                Số lượng
                            </TableHead>
                            <TableHead className="text-right">Đã bán</TableHead>
                            <TableHead className="text-right">Giá</TableHead>
                            <TableHead className="text-right">
                                Thao tác
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        {item.name}
                                    </TableCell>
                                    <TableCell className="max-w-[400px] line-clamp-2 text-gray-500">
                                        {item.description}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatNumber(item.quantity)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatNumber(item.sold)}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(item.price)}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                router.push(
                                                    `/admin/products/${item._id}`
                                                )
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <DeleteConfirm
                                            onDelete={() =>
                                                handleDelete(item._id)
                                            }
                                            title="Xóa sản phẩm?"
                                            description={`Bạn chắc chắn muốn xóa sản phẩm "${item.name}"? Hành động này không thể hoàn tác.`}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ProductTable;
