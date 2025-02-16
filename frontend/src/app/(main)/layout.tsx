import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const MainLayout = ({ childern }: { childern: React.ReactNode }) => {
    return (
        <div>
            <Header />
            {childern}
            <Footer />
        </div>
    );
};

export default MainLayout;
