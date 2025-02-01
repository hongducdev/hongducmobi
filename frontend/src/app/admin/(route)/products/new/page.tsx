import type { Metadata } from "next";
import CreateProductForm from "./_components/create-product-form";

export const metadata: Metadata = {
    title: "Tạo sản phẩm",
    description: "Tạo sản phẩm",
};

const NewProductPage = () => {
    return (
        <div>
            <h1 className="font-semibold text-2xl">Tạo sản phẩm</h1>
            <div className="mt-4">
                <CreateProductForm />
            </div>
        </div>
    );
};

export default NewProductPage;
