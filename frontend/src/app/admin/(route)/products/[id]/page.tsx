import { getProductById } from "@/lib/getProduct";
import EditProductForm from "./_components/edit-product-form";

const ProductPage = async ({ params }: { params: { id: string } }) => {
    const productData = await getProductById(params.id);

    return (
        <div>
            <h1 className="font-semibold text-2xl">{productData.name}</h1>
            <div className="mt-4">
                <EditProductForm
                    productId={productData._id}
                    initialData={productData}
                />
            </div>
        </div>
    );
};

export default ProductPage;
