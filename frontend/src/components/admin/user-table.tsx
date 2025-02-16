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

const UserTable = ({ data }: { data: any[] }) => {
    const router = useRouter();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        <TableCell>
                            <Button
                                variant="outline"
                                size="icon"
                                className="mr-2"
                                onClick={() =>
                                    router.push(`/admin/users/${item._id}`)
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

export default UserTable;
