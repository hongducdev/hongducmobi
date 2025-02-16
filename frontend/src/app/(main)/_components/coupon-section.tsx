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

const CouponSectioon = () => {
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
            {coupons && coupons.length > 0 ? (
                <Carousel>
                    <CarouselContent>
                        {coupons.map((coupon) => (
                            <CarouselItem key={coupon._id}>
                                <CouponItem coupon={coupon} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            ) : (
                <div className="text-center text-2xl font-bold">
                    Không có mã giảm giá
                </div>
            )}
        </div>
    );
};

export default CouponSectioon;
