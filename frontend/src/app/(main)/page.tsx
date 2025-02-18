import { Package, Tag, Users } from "lucide-react";
import HeaderSection from "@/components/header-section";
import TestimonialSection from "./_components/testimonial-section";
import CouponSectioon from "./_components/coupon-section";
import ProductSection from "./_components/product-section";

const HomePage = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <HeaderSection
                icon={<Package size={20} />}
                title="Sản phẩm"
                subTitle="Sản phẩm mới cập nhật"
            />
            <ProductSection />
            <HeaderSection
                icon={<Tag size={20} />}
                title="Mã giảm giá"
                subTitle="Mã giảm giá để khách hàng có thể sử dụng để mua hàng"
            />
            <CouponSectioon />
            <HeaderSection
                icon={<Users size={20} />}
                title="Đánh giá"
                subTitle="Đánh giá của khách hàng"
            />
            <TestimonialSection />
        </div>
    );
};

export default HomePage;
