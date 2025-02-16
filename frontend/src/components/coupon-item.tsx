import React from "react";
import { Coupon } from "@/types/coupon";
import TimeCountdown from "./time-countdown";
import { Button } from "./ui/button";

const CouponItem = ({ coupon }: { coupon: Coupon }) => {
    return (
        <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-10">
            <div className="flex items-center justify-between gap-2">
                <div className="">
                    <h3 className="text-xl font-semibold mb-5">Đừng bỏ lỡ!!</h3>
                    <p>
                        Sử dụng mã giảm giá:{" "}
                        <span className="font-bold">{coupon.code}</span>{" "}
                    </p>
                    <p>
                        Giảm giá:{" "}
                        <span className="font-bold">
                            {coupon.discountPercentage}%
                        </span>{" "}
                    </p>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-5">
                        Sử dụng mã giảm giá
                    </Button>
                </div>
                <div className="">
                    {new Date() < new Date(coupon.startDate) ? (
                        <div className="flex flex-col gap-2">
                            <p>Bắt đầu vào: </p>
                            <TimeCountdown
                                startDate={new Date()}
                                endDate={coupon.startDate}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <p>Kết thúc vào: </p>
                            <TimeCountdown
                                startDate={new Date()}
                                endDate={coupon.expirationDate}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponItem;
