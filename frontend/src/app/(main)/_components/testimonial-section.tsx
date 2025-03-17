"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Testimonial from "@/components/testimonial";
import AutoplayPlugin from "embla-carousel-autoplay";
import { useRef } from "react";

const testimonials = [
    {
        name: "Nguyễn Thanh Tùng",
        role: "Khách hàng thân thiết",
        image: "https://avatar.iran.liara.run/public",
        rating: 5,
        comment:
            "Nhân viên tư vấn rất nhiệt tình, giá cả hợp lý. Mình đã mua iPhone 14 Pro và rất hài lòng với chất lượng sản phẩm và dịch vụ bảo hành.",
    },
    {
        name: "Trần Thị Hương",
        role: "Khách hàng mới",
        image: "https://avatar.iran.liara.run/public",
        rating: 4,
        comment:
            "Shop có đầy đủ các mẫu điện thoại mới nhất, không gian thoáng mát, sạch sẽ. Chỉ có điều thời gian chờ hơi lâu vào cuối tuần.",
    },
    {
        name: "Lê Minh Đức",
        role: "Khách hàng VIP",
        image: "https://avatar.iran.liara.run/public",
        rating: 5,
        comment:
            "Mua Samsung S23 Ultra ở đây được tư vấn rất kỹ về tính năng sản phẩm. Giá tốt hơn nhiều shop khác và có nhiều ưu đãi kèm theo.",
    },
    {
        name: "Phạm Thu Thảo",
        role: "Khách hàng thường xuyên",
        image: "https://avatar.iran.liara.run/public",
        rating: 5,
        comment:
            "Chế độ bảo hành rất tốt, mình đã mua điện thoại ở đây nhiều lần và giới thiệu cho bạn bè. Nhân viên chuyên nghiệp, am hiểu sản phẩm.",
    },
    {
        name: "Hoàng Văn Nam",
        role: "Khách hàng",
        image: "https://avatar.iran.liara.run/public",
        rating: 4,
        comment:
            "Mình rất thích cách tư vấn của shop, không ép khách hàng mà đưa ra những gợi ý phù hợp với nhu cầu và ngân sách.",
    },
    {
        name: "Vũ Thị Mai Anh",
        role: "Khách hàng thân thiết",
        image: "https://avatar.iran.liara.run/public",
        rating: 5,
        comment:
            "Dịch vụ hậu mãi tuyệt vời. Khi gặp vấn đề với máy, shop hỗ trợ rất nhanh và nhiệt tình. Sẽ ủng hộ shop dài dài.",
    },
];

const TestimonialSection = () => {
    const plugin = useRef(
        AutoplayPlugin({
            delay: 4000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
        })
    );

    return (
        <div className="relative py-4">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[plugin.current]}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem
                            key={index}
                            className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                        >
                            <div className="h-full">
                                <Testimonial {...testimonial} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
                </div>
            </Carousel>
        </div>
    );
};

export default TestimonialSection;
