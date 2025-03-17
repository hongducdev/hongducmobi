"use client";

import { Coupon } from "@/types/coupon";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

interface CouponTableProps {
    data: Coupon[];
}

export function CouponTable({ data }: CouponTableProps) {
    // Implement your table component here
}
