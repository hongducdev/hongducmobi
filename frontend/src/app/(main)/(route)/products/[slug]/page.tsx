import { Product } from "@/types/product";
import { notFound } from "next/navigation";
import React from "react";
import ImageProduct from "./_components/image_product";
import { formatCurrency } from "@/lib/utils";
import ChangeNumber from "./_components/change_number";
import ProductCard from "@/components/product-card";

async function getProduct(slug: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
        {
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!res) {
        notFound();
    }

    const product: Product = await res.json();
    return product;
}

async function getRelatedProducts(category: string, currentProductId: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?category=${category}&limit=4`,
        {
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!res.ok) {
        return [];
    }

    const products: Product[] = await res.json();
    return products.filter((p) => p._id !== currentProductId).slice(0, 4);
}

export async function generateStaticParams() {
    const products = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).then((res) => res.json());

    return products.map((product: Product) => ({
        slug: product.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}) {
    const product = await getProduct(params.slug);
    return {
        title: product.name,
        description: product.description,
    };
}

const ProductPage = async ({ params }: { params: { slug: string } }) => {
    const product = await getProduct(params.slug);
    const relatedProducts = await getRelatedProducts(
        product.category,
        product._id
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                    <ImageProduct images={product.images} />
                </div>
                <div className="flex flex-col gap-4 justify-center">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-gray-500 text-lg">
                        {formatCurrency(product.price)}
                    </p>

                    <div className="flex items-center gap-2">
                        <p className="text-gray-500">
                            Kho hàng: {product.quantity}
                        </p>
                    </div>
                    <ChangeNumber product={product} />
                </div>
            </div>
            <div className="mt-10">
                <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
                <p className="text-gray-600">{product.description}</p>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">
                        Sản phẩm tương tự
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <ProductCard
                                key={relatedProduct._id}
                                product={relatedProduct}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;
