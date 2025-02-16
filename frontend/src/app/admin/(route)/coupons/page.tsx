"use client";

import React, { useEffect, useState } from "react";
import { getCoupons } from "@/lib/getCoupon";
import CouponTable from "@/components/admin/coupon-table";
import { Coupon } from "@/types/coupon";
import axios from "@/lib/axios";
const CouponPage = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    useEffect(() => {
        const fetchCoupons = async () => {
            const response = await axios.get("/coupons");
            setCoupons(response.data);
        };
        fetchCoupons();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Mã giảm giá</h1>
            <CouponTable data={coupons} />
        </div>
    );
};

export default CouponPage;
