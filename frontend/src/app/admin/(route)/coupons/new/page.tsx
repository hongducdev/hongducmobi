import React from "react";
import NewCouponForm from "./_components/new-coupon-form";

const page = () => {
    return (
        <div>
            <h1 className="font-semibold text-2xl">Tạo mã giảm giá</h1>
            <div className="mt-4">
                <NewCouponForm />
            </div>
        </div>
    );
};

export default page;
