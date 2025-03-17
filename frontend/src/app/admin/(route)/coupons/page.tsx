"use client";

import React, { useEffect, useState } from "react";
import CouponTable from "@/components/admin/coupon-table";
import { Coupon } from "@/types/coupon";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchCoupons = async () => {
            const response = await axios.get("/coupons");
            setCoupons(response.data);
        };
        fetchCoupons();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mã giảm giá</h1>
                <Button onClick={() => router.push("/admin/coupons/new")}>
                    Thêm mã giảm giá
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <CouponTable data={coupons} />
                </Table>
            </div>
        </div>
    );
}
