import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Testimonial from "@/components/testimonial";

const testimonials = [
    {
        name: "Nguyễn Thanh Tùng",
        image: "https://avatar.iran.liara.run/public",
        rating: 5,
        comment:
            "Nhân viên tư vấn rất nhiệt tình, giá cả hợp lý. Mình đã mua iPhone 14 Pro và rất hài lòng với chất lượng sản phẩm và dịch vụ bảo hành.",
    },
    {
        name: "Trần Thị Hương",
        image: "https://avatar.iran.liara.run/public",
        rating: 4,
        comment:
            "Shop có đầy đủ các mẫu điện thoại mới nhất, không gian thoáng mát, sạch sẽ. Chỉ có điều thời gian chờ hơi lâu vào cuối tuần.",
    },
    {
        name: "Lê Minh Đức",
        image: "https://avatar.iran.liara.run/public",
        rating: 5,
        comment:
            "Mua Samsung S23 Ultra ở đây được tư vấn rất kỹ về tính năng sản phẩm. Giá tốt hơn nhiều shop khác và có nhiều ưu đãi kèm theo.",
    },
    {
        name: "Phạm Thu Thảo",
        image: "https://avatar.iran.liara.run/public",
        rating: 5,
        comment:
            "Chế độ bảo hành rất tốt, mình đã mua điện thoại ở đây nhiều lần và giới thiệu cho bạn bè. Nhân viên chuyên nghiệp, am hiểu sản phẩm.",
    },
    {
        name: "Hoàng Văn Nam",
        image: "https://avatar.iran.liara.run/public",
        rating: 4,
        comment:
            "Mình rất thích cách tư vấn của shop, không ép khách hàng mà đưa ra những gợi ý phù hợp với nhu cầu và ngân sách.",
    },
    {
        name: "Vũ Thị Mai Anh",
        image: "https://avatar.iran.liara.run/public",
        rating: 5,
        comment:
            "Dịch vụ hậu mãi tuyệt vời. Khi gặp vấn đề với máy, shop hỗ trợ rất nhanh và nhiệt tình. Sẽ ủng hộ shop dài dài.",
    },
];

const TestimonialSection = () => {
    return (
        <Carousel opts={{ loop: true }}>
            <CarouselContent>
                {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial.name} className="basis-1/3">
                        <Testimonial {...testimonial} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};

export default TestimonialSection;
