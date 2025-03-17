"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Coupon } from "@/types/coupon";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import CouponItem from "@/components/coupon-item";

const CouponSection = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get("/coupons");
                setCoupons(response.data);
            } catch (error) {
                console.error("Error fetching coupons:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-lg"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!coupons.length) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-gray-500">
                    Hiện tại không có mã giảm giá nào
                </p>
            </div>
        );
    }

    return (
        <div className="relative group">
            <Carousel opts={{ loop: true }}>
                <CarouselContent>
                    {coupons.map((coupon) => (
                        <CarouselItem key={coupon._id} className="basis-1/3">
                            <div className="p-2 transform hover:scale-105 transition-transform">
                                <CouponItem coupon={coupon} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Carousel>
        </div>
    );
};

export default CouponSection;
