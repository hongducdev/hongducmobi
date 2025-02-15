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
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ProductTable = ({ data }: { data: any[] }) => {
    const router = useRouter();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead className="max-w-[600px]">Mô tả</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Số lượng mua</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="max-w-[600px]">
                            {item.description}
                        </TableCell>
                        <TableCell>{formatNumber(item.quantity)}</TableCell>
                        <TableCell>{formatNumber(item.sold)}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>
                            <Button
                                variant="outline"
                                size="icon"
                                className="mr-2"
                                onClick={() =>
                                    router.push(`/admin/products/${item._id}`)
                                }
                            >
                                <Pencil />
                            </Button>
                            <Button variant="destructive" size="icon">
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ProductTable;
