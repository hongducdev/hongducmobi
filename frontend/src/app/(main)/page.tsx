import { Users } from "lucide-react";
import HeaderSection from "@/components/header-section";

const HomePage = () => {
    return (
        <div>
            <HeaderSection icon={<Users />} title="Đánh giá" subTitle="Đánh giá của khách hàng" />
        </div>
    );
};

export default HomePage;
