"use client";
import {
    Package,
    Tag,
    Users,
    Truck,
    Star,
    Phone,
    Shield,
    Award,
    Clock,
} from "lucide-react";
import HeaderSection from "@/components/header-section";
import TestimonialSection from "./_components/testimonial-section";
import CouponSectioon from "./_components/coupon-section";
import ProductSection from "./_components/product-section";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const HomePage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[500px] bg-gradient-to-r from-blue-600 to-blue-400">
                <div className="max-w-7xl mx-auto h-full flex items-center px-4">
                    <div className="text-white space-y-6 max-w-xl">
                        <h1 className="text-5xl font-bold">
                            Khám phá thế giới mua sắm trực tuyến
                        </h1>
                        <p className="text-lg opacity-90">
                            Tìm kiếm những sản phẩm chất lượng với giá cả hợp lý
                            cùng dịch vụ giao hàng nhanh chóng
                        </p>
                        <Button size="lg" variant="secondary">
                            Khám phá ngay
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                            <Truck className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Giao hàng nhanh chóng
                            </h3>
                            <p className="text-gray-600">
                                Giao hàng trong vòng 24h cho khu vực nội thành
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                            <Star className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Sản phẩm chất lượng
                            </h3>
                            <p className="text-gray-600">
                                Cam kết chính hãng 100%
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                            <Tag className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Giá cả hợp lý
                            </h3>
                            <p className="text-gray-600">
                                Nhiều ưu đãi và mã giảm giá hấp dẫn
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flash Sale Section */}
            <section className="py-12 bg-red-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-red-600" />
                            <h2 className="text-2xl font-bold text-red-600">
                                Flash Sale
                            </h2>
                        </div>
                        <CountdownTimer />
                    </div>
                    <ProductSection />
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <HeaderSection
                        icon={<Award size={20} />}
                        title="Tại sao chọn chúng tôi"
                        subTitle="Cam kết từ Hồng Đức Mobi"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Bảo hành chính hãng
                            </h3>
                            <p className="text-gray-600">
                                100% sản phẩm được bảo hành chính hãng với thời
                                gian lên đến 24 tháng
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Sản phẩm chính hãng
                            </h3>
                            <p className="text-gray-600">
                                Cam kết 100% sản phẩm chính hãng, hoàn tiền gấp
                                10 nếu phát hiện hàng giả
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Giao hàng nhanh chóng
                            </h3>
                            <p className="text-gray-600">
                                Giao hàng trong 2h cho khu vực nội thành và 24h
                                cho khu vực khác
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
                <section>
                    <HeaderSection
                        icon={<Package size={20} />}
                        title="Sản phẩm nổi bật"
                        subTitle="Khám phá những sản phẩm được yêu thích nhất"
                    />
                    <ProductSection />
                </section>

                <section className="bg-blue-50 py-12 -mx-4">
                    <div className="max-w-7xl mx-auto px-4">
                        <HeaderSection
                            icon={<Tag size={20} />}
                            title="Ưu đãi đặc biệt"
                            subTitle="Tiết kiệm hơn với mã giảm giá độc quyền"
                        />
                        <CouponSectioon />
                    </div>
                </section>

                <section>
                    <HeaderSection
                        icon={<Users size={20} />}
                        title="Khách hàng nói gì về chúng tôi"
                        subTitle="Phản hồi từ những khách hàng đã mua sắm"
                    />
                    <TestimonialSection />
                </section>
            </div>

            {/* Newsletter Section */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Đăng ký nhận thông tin
                    </h2>
                    <p className="mb-6 text-gray-400">
                        Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
                    </p>
                    <div className="flex max-w-md mx-auto gap-4">
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            className="flex-1 px-4 py-2 rounded-lg text-black"
                        />
                        <Button>Đăng ký</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CountdownTimer = () => {
    const [time, setTime] = useState({
        hours: 1200,
        minutes: 30,
        seconds: 45,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => {
                const totalSeconds =
                    prevTime.hours * 3600 +
                    prevTime.minutes * 60 +
                    prevTime.seconds -
                    1;

                if (totalSeconds <= 0) {
                    // Reset về thời gian ban đầu khi hết giờ
                    return {
                        hours: 12,
                        minutes: 30,
                        seconds: 45,
                    };
                }

                return {
                    hours: Math.floor(totalSeconds / 3600),
                    minutes: Math.floor((totalSeconds % 3600) / 60),
                    seconds: totalSeconds % 60,
                };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex gap-2 text-xl font-bold">
            <span className="bg-red-600 text-white px-3 py-1 rounded">
                {time.hours.toString().padStart(2, "0")}
            </span>
            :
            <span className="bg-red-600 text-white px-3 py-1 rounded">
                {time.minutes.toString().padStart(2, "0")}
            </span>
            :
            <span className="bg-red-600 text-white px-3 py-1 rounded">
                {time.seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
};

export default HomePage;
