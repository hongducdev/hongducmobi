"use client";

import { useEffect, useState } from "react";
import EditCouponForm from "./_components/edit-coupon-form";
import axios from "@/lib/axios";
import { Coupon } from "@/types/coupon";

const EditCouponPage = ({ params }: { params: { id: string } }) => {
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const response = await axios.get(`/coupons/${params.id}`);
                setCoupon(response.data);
            } catch (error) {
                console.error("Error fetching coupon:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupon();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!coupon) {
        return <div>Không tìm thấy mã giảm giá</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Chỉnh sửa mã giảm giá</h1>
            <EditCouponForm initialData={coupon} />
        </div>
    );
};

export default EditCouponPage;
